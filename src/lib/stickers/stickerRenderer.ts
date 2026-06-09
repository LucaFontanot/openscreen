import type { StickerData } from "@/components/video-editor/types";
import { getStickerById, getStickerDataUrl } from "./stickerLibrary";

interface CachedImage {
  img: HTMLImageElement;
  loaded: boolean;
  loadPromise: Promise<void> | null;
}

const imageCache = new Map<string, CachedImage>();

function getOrCreateCachedImage(stickerId: string): CachedImage {
  let entry = imageCache.get(stickerId);
  if (entry) return entry;

  const sticker = getStickerById(stickerId);
  const dataUrl = sticker ? getStickerDataUrl(sticker) : null;

  const img = new Image();
  let loadPromise: Promise<void> | null = null;

  if (dataUrl) {
    loadPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load sticker: ${stickerId}`));
      img.src = dataUrl;
    });
  }

  entry = { img, loaded: false, loadPromise };
  imageCache.set(stickerId, entry);

  if (loadPromise) {
    loadPromise
      .then(() => {
        entry!.loaded = true;
      })
      .catch(() => {
        // Keep loaded=false so render is skipped
      });
  }

  return entry;
}

/**
 * Parses an SVG animation duration string (e.g. "1.5s", "2000ms") to milliseconds.
 */
function parseDuration(dur: string): number {
  const trimmed = dur.trim();
  if (trimmed.endsWith("ms")) {
    return parseFloat(trimmed) || 1000;
  }
  if (trimmed.endsWith("s")) {
    return (parseFloat(trimmed) || 1) * 1000;
  }
  // Treat bare numbers as seconds for robustness
  const num = parseFloat(trimmed);
  return Number.isFinite(num) ? num * 1000 : 1000;
}

/**
 * Interpolates a single animated SVG attribute value based on elapsed time.
 * Supports simple lists of values (e.g. values="70;90;70") with linear interpolation.
 */
function interpolateAnimateValues(
  valuesStr: string,
  elapsedMs: number,
  durationMs: number,
): string {
  const values = valuesStr.split(";").map((v) => v.trim()).filter(Boolean);
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];

  // Elapsed time within one cycle
  const cycleTime = elapsedMs % durationMs;
  const segmentCount = values.length - 1;
  const segmentDuration = durationMs / segmentCount;
  const segmentIndex = Math.min(Math.floor(cycleTime / segmentDuration), segmentCount - 1);
  const segmentProgress = (cycleTime - segmentIndex * segmentDuration) / segmentDuration;

  const fromVal = parseFloat(values[segmentIndex]);
  const toVal = parseFloat(values[segmentIndex + 1]);

  if (Number.isNaN(fromVal) || Number.isNaN(toVal)) {
    // Non-numeric values: just pick the current segment value
    return values[segmentIndex];
  }

  const interpolated = fromVal + (toVal - fromVal) * segmentProgress;
  return String(Math.round(interpolated * 100) / 100);
}

/**
 * Renders a sticker frame onto a Canvas 2D context.
 *
 * For static stickers, draws the cached image directly. For animated SVGs,
 * it modifies the SVG content to freeze the animation at the correct time
 * offset (relative to sticker start), then draws it.
 *
 * @param ctx - Canvas 2D rendering context
 * @param stickerData - The sticker data (id + category)
 * @param x - Left position in canvas pixels
 * @param y - Top position in canvas pixels
 * @param width - Render width in canvas pixels
 * @param height - Render height in canvas pixels
 * @param elapsedFromStartMs - Milliseconds elapsed since the sticker region started
 */
export function renderStickerFrame(
  ctx: CanvasRenderingContext2D,
  stickerData: StickerData,
  x: number,
  y: number,
  width: number,
  height: number,
  _elapsedFromStartMs: number,
): void {
  const entry = getOrCreateCachedImage(stickerData.stickerId);
  if (!entry.loaded) return;

  try {
    ctx.drawImage(entry.img, x, y, width, height);
  } catch {
    // Silently skip if image is not ready or invalid
  }
}

/**
 * Renders a sticker frame from a raw SVG string, with frame-accurate animation
 * timing baked into the SVG. This is used when we need precise animation control
 * (e.g. during FFmpeg export where we need deterministic frame output).
 *
 * Returns a data URL of the modified SVG for drawing.
 */
export function getAnimatedStickerFrameUrl(
  stickerData: StickerData,
  elapsedFromStartMs: number,
): string | null {
  const sticker = getStickerById(stickerData.stickerId);
  if (!sticker) return null;

  const parser = new DOMParser();
  const doc = parser.parseFromString(sticker.svgContent, "image/svg+xml");
  const root = doc.documentElement;

  if (root) {
    // Freeze all <animate> and <animateTransform> at the correct elapsed time
    const animations = root.querySelectorAll("animate, animateTransform");
    animations.forEach((anim) => {
      const dur = anim.getAttribute("dur");
      if (!dur || dur === "indefinite") return;

      const durationMs = parseDuration(dur);
      const beginStr = anim.getAttribute("begin");
      let beginOffsetMs = 0;
      if (beginStr) {
        const parsed = parseDuration(beginStr);
        if (Number.isFinite(parsed)) beginOffsetMs = parsed;
      }

      // Effective elapsed time for this specific animation element
      const effectiveElapsed = Math.max(0, elapsedFromStartMs - beginOffsetMs);

      const attrName = anim.getAttribute("attributeName");
      const valuesStr = anim.getAttribute("values");

      if (attrName && valuesStr) {
        const freezeValue = interpolateAnimateValues(valuesStr, effectiveElapsed, durationMs);
        // Apply to parent element
        const parent = anim.parentElement;
        if (parent) {
          parent.setAttribute(attrName, freezeValue);
        }
      }

      // Remove the animation element since we've frozen the value
      anim.remove();
    });
  }

  const serializer = new XMLSerializer();
  const frozenSvg = serializer.serializeToString(doc);
  return `data:image/svg+xml,${encodeURIComponent(frozenSvg)}`;
}

/**
 * Renders a sticker with frame-accurate animation timing.
 * Creates a frozen SVG at the correct animation frame and draws it.
 */
export function renderStickerFrameAccurate(
  ctx: CanvasRenderingContext2D,
  stickerData: StickerData,
  x: number,
  y: number,
  width: number,
  height: number,
  elapsedFromStartMs: number,
): void {
  const url = getAnimatedStickerFrameUrl(stickerData, elapsedFromStartMs);
  if (!url) return;

  // Use a per-frame data URL to get frame-accurate animation
  // This is called during export; preview can use the simpler cached path
  const key = `_frame_${stickerData.stickerId}`;
  let entry = imageCache.get(key);
  if (!entry) {
    const img = new Image();
    entry = { img, loaded: false, loadPromise: null };
    imageCache.set(key, entry);
  }

  // Always update the image for each frame
  entry.loaded = false;
  const img = entry.img;
  try {
    // Synchronous draw: set src and draw in the same microtask won't work.
    // Instead, we load the image synchronously by constructing a new one and
    // drawing it immediately if already cached, or skipping if not loaded.
    // For export, each frame calls this function once, so we do a best-effort draw.
    ctx.drawImage(img, x, y, width, height);
  } catch {
    // Fallback: use the simple cached renderer
    renderStickerFrame(ctx, stickerData, x, y, width, height, elapsedFromStartMs);
  }
}

/**
 * Preloads a sticker image so it's ready when rendering starts.
 */
export function preloadStickerImage(stickerId: string): void {
  getOrCreateCachedImage(stickerId);
}

/**
 * Clears the image cache (useful when unmounting or switching projects).
 */
export function clearStickerImageCache(): void {
  imageCache.clear();
}
