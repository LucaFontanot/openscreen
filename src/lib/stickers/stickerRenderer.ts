import type { StickerData } from "@/components/video-editor/types";
import { getStickerById, getStickerDataUrl } from "./stickerLibrary";

interface CachedSticker {
  /** Rasterized bitmap of the SVG source (pre-rendered, ready to draw). */
  bitmap: HTMLCanvasElement | null;
  /** True once the source SVG has been loaded and rasterized. */
  loaded: boolean;
  /** Promise that resolves when rasterization completes. */
  ready: Promise<void>;
}

const rasterCache = new Map<string, CachedSticker>();

/**
 * Ensures a sticker is loaded and rasterized.  Returns the cached entry
 * immediately; the caller can check `.loaded` or await `.ready`.
 */
function getOrCreateRaster(stickerId: string): CachedSticker {
  const existing = rasterCache.get(stickerId);
  if (existing) return existing;

  const sticker = getStickerById(stickerId);
  const dataUrl = sticker ? getStickerDataUrl(sticker) : null;

  let resolveReady!: () => void;
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  const entry: CachedSticker = {
    bitmap: null,
    loaded: false,
    ready,
  };
  rasterCache.set(stickerId, entry);

  if (!dataUrl) {
    resolveReady();
    return entry;
  }

  // Load the SVG via an Image, then rasterize it once.
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    // Raster at a fixed size; the bitmap will be stretched during drawImage
    // to match the target rect, which is fine for vector SVGs.
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, 256, 256);
    }
    entry.bitmap = canvas;
    entry.loaded = true;
    resolveReady();
  };
  img.onerror = () => {
    // Leave loaded=false so rendering is skipped
    resolveReady();
  };
  img.src = dataUrl;

  return entry;
}

/**
 * Draw a sticker frame onto a Canvas 2D context.
 *
 * Uses a pre-rasterized bitmap (loaded once, reused every frame) so the hot
 * path is a plain `drawImage(bitmapCanvas)` — safe for FFmpeg export where
 * live SVG rasterization can stall the pipeline.
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
  const entry = getOrCreateRaster(stickerData.stickerId);
  if (!entry.loaded || !entry.bitmap) return;

  const fillArea = stickerData.fillArea ?? (stickerData.category === "square");
  const bitmap = entry.bitmap;

  if (fillArea) {
    // Fill the entire bounding box (stretch to fit)
    ctx.drawImage(bitmap, x, y, width, height);
  } else {
    // Contain within bounds, preserving aspect ratio (round stickers)
    const bmpW = bitmap.width;
    const bmpH = bitmap.height;
    const bmpAspect = bmpW / bmpH;
    const boxAspect = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let drawX = x;
    let drawY = y;

    if (bmpAspect > boxAspect) {
      drawHeight = width / bmpAspect;
      drawY = y + (height - drawHeight) / 2;
    } else {
      drawWidth = height * bmpAspect;
      drawX = x + (width - drawWidth) / 2;
    }

    ctx.drawImage(bitmap, drawX, drawY, drawWidth, drawHeight);
  }
}

/**
 * Preloads + rasterizes a sticker so it is ready before the export loop.
 * Returns a promise that resolves when the sticker is loaded.
 */
export function preloadStickerImage(stickerId: string): Promise<void> {
  const entry = getOrCreateRaster(stickerId);
  return entry.ready;
}

/**
 * Preloads all stickers used by a list of sticker data entries.
 * Call this before the export loop starts.
 */
export async function preloadAllStickers(
  stickerDataList: StickerData[],
): Promise<void> {
  await Promise.all(
    stickerDataList.map((sd) => preloadStickerImage(sd.stickerId)),
  );
}

/**
 * Clears the raster cache (useful when unmounting or switching projects).
 */
export function clearStickerImageCache(): void {
  rasterCache.clear();
}
