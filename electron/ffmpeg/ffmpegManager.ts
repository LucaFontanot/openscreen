import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { app } from "electron";

let cachedFFmpegPath: string | null = null;
let cachedEncoders: string[] | null = null;

/**
 * Resolves the FFmpeg binary path.
 * - In packaged builds: looks in extraResources/ffmpeg/
 * - In development: looks for system FFmpeg on PATH, or a local vendor copy
 */
export function getFFmpegPath(): string | null {
  if (cachedFFmpegPath !== null) {
    return cachedFFmpegPath;
  }

  const isWin = process.platform === "win32";
  const binaryName = isWin ? "ffmpeg.exe" : "ffmpeg";

  // 1. Packaged build — extraResources
  if (app.isPackaged) {
    const resourcePath = path.join(process.resourcesPath, "ffmpeg", binaryName);
    if (fs.existsSync(resourcePath)) {
      cachedFFmpegPath = resourcePath;
      return cachedFFmpegPath;
    }
  }

  // 2. Development — local vendor directory
  const vendorPath = path.join(app.getAppPath(), "vendor", "ffmpeg", binaryName);
  if (fs.existsSync(vendorPath)) {
    cachedFFmpegPath = vendorPath;
    return cachedFFmpegPath;
  }

  // 3. System PATH fallback
  const systemPath = findOnPath(binaryName);
  if (systemPath) {
    cachedFFmpegPath = systemPath;
    return cachedFFmpegPath;
  }

  cachedFFmpegPath = null;
  return null;
}

/**
 * Checks if FFmpeg is available.
 */
export function isFFmpegAvailable(): boolean {
  return getFFmpegPath() !== null;
}

/**
 * Probes available hardware encoders by running `ffmpeg -encoders`.
 * Caches the result after the first call.
 */
export async function probeHardwareEncoders(): Promise<string[]> {
  if (cachedEncoders !== null) {
    return cachedEncoders;
  }

  const ffmpegPath = getFFmpegPath();
  if (!ffmpegPath) {
    cachedEncoders = [];
    return cachedEncoders;
  }

  try {
    const output = await execFileAsync(ffmpegPath, ["-hide_banner", "-encoders"]);
    const encoders: string[] = [];

    // Check for hardware H.264 encoders
    const hwEncoders = [
      "h264_nvenc", // NVIDIA
      "h264_qsv", // Intel Quick Sync
      "h264_amf", // AMD
    ];

    const probeStart = Date.now();
  for (const encoder of hwEncoders) {
    if (output.includes(encoder)) {
      // Verify the encoder actually works by trying to initialize it
      const testStart = Date.now();
      const works = await testEncoder(ffmpegPath, encoder);
      const testDuration = Date.now() - testStart;
      if (works) {
        console.log(`[FFmpegManager] Encoder ${encoder} validated OK (${testDuration}ms)`);
        encoders.push(encoder);
      }
    }
  }

  // Software fallback is always available if FFmpeg exists
  if (output.includes("libx264")) {
    encoders.push("libx264");
  }

  cachedEncoders = encoders;
  const probeDuration = Date.now() - probeStart;
  console.log(`[FFmpegManager] Encoder probe complete (${probeDuration}ms). Available:`, encoders);
    return cachedEncoders;
  } catch (error) {
    console.warn("[FFmpegManager] Failed to probe encoders:", error);
    cachedEncoders = [];
    return cachedEncoders;
  }
}

/**
 * Selects the best available encoder.
 * Priority: NVENC > QSV > AMF > libx264
 */
export async function selectBestEncoder(): Promise<string | null> {
  const encoders = await probeHardwareEncoders();
  const priority = ["h264_nvenc", "h264_qsv", "h264_amf", "libx264"];
  for (const encoder of priority) {
    if (encoders.includes(encoder)) {
      return encoder;
    }
  }
  return null;
}

/**
 * Gets the full FFmpeg capabilities object for the renderer.
 */
export async function getFFmpegCapabilities(): Promise<{
  available: boolean;
  encoders: string[];
  bestEncoder: string | null;
  path: string | null;
}> {
  const ffmpegPath = getFFmpegPath();
  if (!ffmpegPath) {
    return { available: false, encoders: [], bestEncoder: null, path: null };
  }

  const encoders = await probeHardwareEncoders();
  const bestEncoder = await selectBestEncoder();

  return {
    available: true,
    encoders,
    bestEncoder,
    path: ffmpegPath,
  };
}

/**
 * Builds FFmpeg arguments for encoding raw RGBA frames piped to stdin.
 */
/**
 * Builds FFmpeg args for step 1: video-only export from pipe:0.
 * Audio is handled separately in step 2 via buildAudioMuxArgs().
 * We split video and audio because raw H.264 from pipe:0 has no timestamps,
 * which causes the MP4 muxer to drop audio when both are processed together.
 * By exporting video-only first, the resulting MP4 has proper container timestamps
 * that FFmpeg can then use to correctly interleave audio in step 2.
 */
export function buildVideoOnlyArgs(config: {
  width: number;
  height: number;
  frameRate: number;
  encoder: string;
  bitrate: number;
  outputPath: string;
}): string[] {
  const args: string[] = [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-y",
    // Input 0: Raw H.264 video stream from stdin.
    // FFmpeg sets analyzeduration=0 for pipes by default, which means it won't wait
    // for codec parameters (SPS/PPS) to arrive from the WebCodecs encoder over IPC.
    // We must override analyzeduration and probesize so FFmpeg waits for the first
    // keyframe before failing with "unspecified size".
    "-fflags",
    "+genpts",  // Generate PTS for raw H.264 packets from pipe — without this,
                // the MP4 muxer drops audio because video timestamps are unset
    "-f",
    "h264",
    "-framerate",  // --framerate (not -r) is the correct flag for input formats
    String(config.frameRate),  // like raw H.264 that have no inherent timestamps
    "-analyzeduration",
    "20000000", // 20 seconds — enough time for WebCodecs to encode and IPC to deliver the first keyframe
    "-probesize",
    "5000000", // 5 MB probe buffer (FFmpeg default for files; pipes default to much less)
    "-i",
    "pipe:0",
    "-map", "0:v",
    "-c:v", "copy",
    "-an",  // No audio in step 1 — will be added in step 2
    "-movflags", "+faststart",
    config.outputPath,
  ];

  return args;
}

/**
 * Builds FFmpeg args for step 2: mux video (from step 1 temp file) with audio
 * from the source recording and/or background music.
 *
 * In this step both inputs are regular files with proper timestamps, so the
 * MP4 muxer can correctly interleave video and audio packets.
 */
export function buildAudioMuxArgs(config: {
  videoInputPath: string;
  audioSourcePath?: string;
  hasAudio?: boolean;
  backgroundAudioPath?: string;
  backgroundAudioVolume?: number;
  backgroundMusicFadeIn?: number;
  outputPath: string;
}): string[] | null {
  const hasBackgroundAudio = Boolean(config.backgroundAudioPath);
  const hasMainAudio = Boolean(config.audioSourcePath && config.hasAudio);
  const bgVolume = config.backgroundAudioVolume ?? 0.35;
  const fadeInSec = config.backgroundMusicFadeIn ?? 0;

  // No audio at all — nothing to mux
  if (!hasMainAudio && !hasBackgroundAudio) {
    return null;
  }

  console.log(
    `[FFmpegManager] buildAudioMuxArgs:\n` +
      `  hasMainAudio: ${hasMainAudio} (sourcePath=${config.audioSourcePath || "(none)"}, hasAudio=${config.hasAudio})\n` +
      `  hasBackgroundAudio: ${hasBackgroundAudio} (bgPath=${config.backgroundAudioPath || "(none)"})\n` +
      `  bgVolume: ${bgVolume}, fadeInSec: ${fadeInSec}`,
  );

  const args: string[] = [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-y",
    // Input 0: video from step 1 (proper MP4 with timestamps)
    "-i", config.videoInputPath,
  ];

  // Input 1: main audio from source recording
  if (hasMainAudio) {
    args.push("-i", config.audioSourcePath!);
  }

  // Input 2: background music
  if (hasBackgroundAudio) {
    args.push("-i", config.backgroundAudioPath!);
  }

  // Video: copy from input 0
  args.push("-map", "0:v", "-c:v", "copy");

  // Audio: mix or pass through
  if (hasMainAudio && hasBackgroundAudio) {
    // Both: mix with amix filter, apply volume/fade to background music
    const bgFilterParts = [`[2:a]volume=${bgVolume}`];
    if (fadeInSec > 0) bgFilterParts.push(`afade=t=in:d=${fadeInSec}`);
    const bgFilter = bgFilterParts.join(",");
    const filterComplex = `${bgFilter}[bg];[1:a][bg]amix=inputs=2:duration=longest:dropout_transition=0[audio]`;
    args.push("-filter_complex", filterComplex);
    args.push("-map", "[audio]");
  } else if (hasMainAudio) {
    // Only main audio
    args.push("-map", "1:a");
  } else if (hasBackgroundAudio) {
    // Only background audio
    const audioFilters = [`volume=${bgVolume}`];
    if (fadeInSec > 0) audioFilters.push(`afade=t=in:d=${fadeInSec}`);
    args.push("-map", "1:a", "-af", audioFilters.join(","));
  }

  args.push("-c:a", "aac", "-b:a", "192k", "-ac", "2");
  args.push("-movflags", "+faststart");

  // -shortest is only needed when background music (which is longer than the video)
  // is being mixed in. Without it, -shortest can truncate the output if the
  // step 1 video has slightly different timestamps than the source audio file.
  if (hasBackgroundAudio) {
    args.push("-shortest");
  }

  args.push(config.outputPath);

  return args;
}

// ---- Helpers ----

function findOnPath(binaryName: string): string | null {
  const pathEnv = process.env.PATH || "";
  const separator = process.platform === "win32" ? ";" : ":";
  const dirs = pathEnv.split(separator);

  for (const dir of dirs) {
    const fullPath = path.join(dir, binaryName);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

function execFileAsync(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout + stderr);
    });
  });
}

async function testEncoder(ffmpegPath: string, encoder: string): Promise<boolean> {
  try {
    // Try encoding 1 black frame with the encoder to see if it actually initializes
    // Using 256x256 because some hardware encoders (NVENC/QSV) fail on very small dimensions like 64x64
    await execFileAsync(ffmpegPath, [
      "-hide_banner",
      "-loglevel",
      "error",
      "-f",
      "lavfi",
      "-i",
      "color=c=black:s=256x256:d=0.1",
      "-c:v",
      encoder,
      "-frames:v",
      "1",
      "-f",
      "null",
      "-",
    ]);
    return true;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException & { stderr?: string };
    const reason = nodeError.stderr?.trim() || nodeError.message || String(error);
    console.warn(
        `[FFmpegManager] Encoder ${encoder} SKIPPED: not functional. ` +
          `(reason: ${reason.split("\n")[0] || reason})`,
      );
    return false;
  }
}
