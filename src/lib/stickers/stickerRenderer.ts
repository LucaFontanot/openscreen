import type { StickerData } from "@/components/video-editor/types";

// ─── Animation helpers ────────────────────────────────────────────────────────

/** Linear phase [0,1) for an indefinitely repeating SMIL animation. */
function animPhase(elapsedMs: number, durMs: number, beginMs = 0): number {
  if (durMs <= 0) return 0;
  const t = elapsedMs - beginMs;
  if (t <= 0) return 0;
  return (t % durMs) / durMs;
}

/** Ping-pong: linearly maps from→to→from over one phase period. Mirrors SMIL `values="A;B;A"`. */
function pp(phase: number, from: number, to: number): number {
  const t = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
  return from + (to - from) * t;
}

/** One-way ramp: maps from→to over phase [0,1]. Mirrors SMIL `values="A;B"`. */
function ramp(phase: number, from: number, to: number): number {
  return from + (to - from) * phase;
}

// ─── Per-sticker canvas renderers (draw in viewBox coordinate space) ──────────

type InternalRenderer = (ctx: CanvasRenderingContext2D, elapsedMs: number) => void;

function renderPulseCircle(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const color = "#34B27B";

  // Circle 1: r 70→90→70, opacity 1→0.3→1, dur 1.5s
  const p1 = animPhase(elapsedMs, 1500);
  ctx.beginPath();
  ctx.arc(100, 100, pp(p1, 70, 90), 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.globalAlpha = pp(p1, 1, 0.3);
  ctx.stroke();

  // Circle 2: r 50→65→50, opacity 0.8→0.2→0.8, dur 1.5s, begin 0.3s
  const p2 = animPhase(elapsedMs, 1500, 300);
  ctx.beginPath();
  ctx.arc(100, 100, pp(p2, 50, 65), 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.globalAlpha = pp(p2, 0.8, 0.2);
  ctx.stroke();

  // Circle 3: r 25→35→25, opacity 0.6→0.1→0.6, dur 1.5s, begin 0.6s
  const p3 = animPhase(elapsedMs, 1500, 600);
  ctx.beginPath();
  ctx.arc(100, 100, pp(p3, 25, 35), 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.globalAlpha = pp(p3, 0.6, 0.1);
  ctx.stroke();
}

function renderRingHighlight(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  // Gradient fill circle: r 88→95→88, dur 2s
  const p1 = animPhase(elapsedMs, 2000);
  const r1 = pp(p1, 88, 95);
  const grad = ctx.createRadialGradient(100, 100, r1 * 0.7, 100, 100, r1);
  grad.addColorStop(0, "transparent");
  grad.addColorStop(1, "rgba(255,176,32,0.4)");
  ctx.beginPath();
  ctx.arc(100, 100, r1, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Dashed arc: dashoffset 0→-377 dur 4s, rotation 0→360 dur 8s
  const pDash = animPhase(elapsedMs, 4000);
  const pRot  = animPhase(elapsedMs, 8000);
  ctx.save();
  ctx.translate(100, 100);
  ctx.rotate(ramp(pRot, 0, Math.PI * 2));
  ctx.translate(-100, -100);
  ctx.beginPath();
  ctx.arc(100, 100, 60, 0, Math.PI * 2);
  ctx.setLineDash([94.2, 94.2]);
  ctx.lineDashOffset = ramp(pDash, 0, -377);
  ctx.strokeStyle = "#FFB020";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Static inner ring
  ctx.beginPath();
  ctx.arc(100, 100, 60, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,176,32,0.4)";
  ctx.lineWidth = 2;
  ctx.globalAlpha = 1;
  ctx.stroke();
}

function renderArrowCircle(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const color = "#6C55FF";
  const pRot = animPhase(elapsedMs, 6000);

  ctx.save();
  ctx.translate(100, 100);
  ctx.rotate(ramp(pRot, 0, Math.PI * 2));
  ctx.translate(-100, -100);

  ctx.beginPath();
  ctx.arc(100, 100, 75, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 1;
  ctx.stroke();

  // Arrow head polygon: "100,20 115,45 100,40 85,45"
  ctx.beginPath();
  ctx.moveTo(100, 20);
  ctx.lineTo(115, 45);
  ctx.lineTo(100, 40);
  ctx.lineTo(85, 45);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();

  // Static outer ring
  ctx.beginPath();
  ctx.arc(100, 100, 65, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(108,85,255,0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function renderSpotlight(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const p1 = animPhase(elapsedMs, 3000);
  const r1 = pp(p1, 85, 99);
  const grad = ctx.createRadialGradient(100, 100, 0, 100, 100, r1);
  grad.addColorStop(0, "rgba(255,255,255,0.15)");
  grad.addColorStop(0.6, "rgba(255,255,255,0.05)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.beginPath();
  ctx.arc(100, 100, r1, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Inner ring: opacity 0.5→0.1→0.5, dur 3s
  ctx.beginPath();
  ctx.arc(100, 100, 50, 0, Math.PI * 2);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = pp(p1, 0.5, 0.1);
  ctx.stroke();
}

function renderCrosshair(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const color = "#FF4560";
  const p = animPhase(elapsedMs, 2000);

  // Outer ring: r 75→85→75, opacity 1→0.4→1
  ctx.beginPath();
  ctx.arc(100, 100, pp(p, 75, 85), 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = pp(p, 1, 0.4);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  // Top gap: y2 85→75→85
  ctx.beginPath(); ctx.moveTo(100, 40);             ctx.lineTo(100, pp(p, 85, 75)); ctx.stroke();
  // Bottom gap: y1 115→125→115
  ctx.beginPath(); ctx.moveTo(100, pp(p, 115, 125)); ctx.lineTo(100, 160);          ctx.stroke();
  // Left gap: x2 85→75→85
  ctx.beginPath(); ctx.moveTo(40, 100);              ctx.lineTo(pp(p, 85, 75), 100); ctx.stroke();
  // Right gap: x1 115→125→115
  ctx.beginPath(); ctx.moveTo(pp(p, 115, 125), 100); ctx.lineTo(160, 100);          ctx.stroke();

  // Center dot (static)
  ctx.beginPath();
  ctx.arc(100, 100, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function renderBoxHighlight(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const color = "#34B27B";

  // Outer rect: opacity 1→0.4→1, dur 1.2s
  const p1 = animPhase(elapsedMs, 1200);
  ctx.beginPath();
  ctx.roundRect(2, 2, 196, 196, 6);
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.globalAlpha = pp(p1, 1, 0.4);
  ctx.stroke();

  // Inner rect: opacity 0.7→0.2→0.7, dur 1.2s, begin 0.3s
  const p2 = animPhase(elapsedMs, 1200, 300);
  ctx.beginPath();
  ctx.roundRect(8, 8, 184, 184, 4);
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = pp(p2, 0.7, 0.2);
  ctx.stroke();
}

function renderSweepUnderline(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  ctx.lineCap = "round";

  // Static ghost line
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(200, 30);
  ctx.strokeStyle = "rgba(255,176,32,0.3)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Sweeping line: x2 0→200, dur 1s
  const p = animPhase(elapsedMs, 1000);
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(ramp(p, 0, 200), 30);
  ctx.strokeStyle = "#FFB020";
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.lineCap = "butt";
}

function renderCornerBracket(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  ctx.strokeStyle = "#6C55FF";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  // 4 corners with staggered 0.5s opacity pulses, each dur 2s
  const corners: { pts: [number, number][]; begin: number }[] = [
    { pts: [[2, 40], [2, 2], [40, 2]],          begin: 0    },
    { pts: [[160, 2], [198, 2], [198, 40]],      begin: 500  },
    { pts: [[198, 160], [198, 198], [160, 198]], begin: 1000 },
    { pts: [[40, 198], [2, 198], [2, 160]],      begin: 1500 },
  ];

  for (const c of corners) {
    const p = animPhase(elapsedMs, 2000, c.begin);
    ctx.globalAlpha = pp(p, 1, 0.5);
    ctx.beginPath();
    ctx.moveTo(c.pts[0][0], c.pts[0][1]);
    ctx.lineTo(c.pts[1][0], c.pts[1][1]);
    ctx.lineTo(c.pts[2][0], c.pts[2][1]);
    ctx.stroke();
  }

  ctx.lineCap = "butt";
}

function renderDashFrame(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  // Outer rect: dashoffset 0→-600, dur 4s
  const p1 = animPhase(elapsedMs, 4000);
  ctx.beginPath();
  ctx.roundRect(2, 2, 196, 196, 4);
  ctx.setLineDash([40, 20]);
  ctx.lineDashOffset = ramp(p1, 0, -600);
  ctx.strokeStyle = "#FF4560";
  ctx.lineWidth = 4;
  ctx.globalAlpha = 1;
  ctx.stroke();

  // Inner rect: dashoffset 0→480, dur 3s, opacity 0.4
  const p2 = animPhase(elapsedMs, 3000);
  ctx.beginPath();
  ctx.roundRect(8, 8, 184, 184, 2);
  ctx.setLineDash([30, 30]);
  ctx.lineDashOffset = ramp(p2, 0, 480);
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;
  ctx.stroke();

  ctx.setLineDash([]);
}

function renderArrowCallout(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const color = "#34B27B";

  ctx.beginPath();
  ctx.roundRect(30, 30, 140, 100, 14);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 1;
  ctx.stroke();

  // Arrow: ping-pongs between two point sets, dur 1.5s
  const p = animPhase(elapsedMs, 1500);
  const pts: [number, number][] = [
    [pp(p, 100, 100), pp(p, 130, 135)],
    [pp(p, 90,  85),  pp(p, 160, 165)],
    [pp(p, 100, 100), pp(p, 150, 153)],
    [pp(p, 110, 115), pp(p, 160, 165)],
  ];

  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.lineJoin = "miter";
}

// ─── Arrow renderers (factory for all 8 directions) ─────────────────────────────

function makeArrowRenderer(rotationDeg: number, color: string): InternalRenderer {
  const rotRad = (rotationDeg * Math.PI) / 180;

  return (ctx: CanvasRenderingContext2D, elapsedMs: number): void => {
    const p = animPhase(elapsedMs, 1000);

    ctx.save();
    ctx.translate(100, 100);
    ctx.rotate(rotRad);
    ctx.translate(-100, -100);

    // Arrow shaft: y1 155→150→155, y2 50→42→50
    ctx.beginPath();
    ctx.moveTo(100, pp(p, 155, 150));
    ctx.lineTo(100, pp(p, 50, 42));
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.globalAlpha = pp(p, 1, 0.7);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Arrow head chevron: points 70,70 100,42 130,70
    ctx.beginPath();
    ctx.moveTo(70, pp(p, 70, 62));
    ctx.lineTo(100, pp(p, 42, 34));
    ctx.lineTo(130, pp(p, 70, 62));
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = pp(p, 1, 0.8);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Accent dot: r 4→3→4
    ctx.beginPath();
    ctx.arc(100, 160, pp(p, 4, 3), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = pp(p, 1, 0.5);
    ctx.fill();

    ctx.restore();
  };
}

const renderArrowUp = makeArrowRenderer(0, "#34B27B");
const renderArrowDown = makeArrowRenderer(180, "#FF4560");
const renderArrowLeft = makeArrowRenderer(-90, "#FFB020");
const renderArrowRight = makeArrowRenderer(90, "#6C55FF");
const renderArrowUpRight = makeArrowRenderer(45, "#00B4D8");
const renderArrowDownRight = makeArrowRenderer(135, "#E040FB");
const renderArrowDownLeft = makeArrowRenderer(225, "#FF6D00");
const renderArrowUpLeft = makeArrowRenderer(-45, "#76FF03");

// ─── Additional square renderers ────────────────────────────────────────────────

function renderPulseRect(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const color = "#00B4D8";
  const p = animPhase(elapsedMs, 1400);

  // Outer rect: stroke-width 4→7→4, opacity 1→0.5→1
  ctx.beginPath();
  ctx.roundRect(15, 15, 170, 170, 20);
  ctx.strokeStyle = color;
  ctx.lineWidth = pp(p, 4, 7);
  ctx.globalAlpha = pp(p, 1, 0.5);
  ctx.stroke();

  // Inner rect: opacity 0.6→0.15→0.6, begin 0.35s
  const p2 = animPhase(elapsedMs, 1400, 350);
  ctx.beginPath();
  ctx.roundRect(25, 25, 150, 150, 14);
  ctx.lineWidth = 2;
  ctx.globalAlpha = pp(p2, 0.6, 0.15);
  ctx.stroke();
}

function renderGradientFrame(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const p = animPhase(elapsedMs, 4000);

  // Animate gradient by shifting the linear gradient endpoints
  const x1 = pp(p, 0, 1);
  const y2 = pp(p, 1, 0);
  const grad = ctx.createLinearGradient(x1 * 200, 0, 200, y2 * 200);
  grad.addColorStop(0, "#E040FB");
  grad.addColorStop(0.5, "#6C55FF");
  grad.addColorStop(1, "#00B4D8");

  // Outer rect
  ctx.beginPath();
  ctx.roundRect(10, 10, 180, 180, 12);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 5;
  ctx.globalAlpha = 1;
  ctx.stroke();

  // Inner rect
  ctx.beginPath();
  ctx.roundRect(20, 20, 160, 160, 8);
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;
  ctx.stroke();
}

function renderBadgeRibbon(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const p = animPhase(elapsedMs, 2000);

  // Ribbon tails
  ctx.beginPath();
  ctx.moveTo(70, 130);
  ctx.lineTo(85, 160);
  ctx.lineTo(100, 145);
  ctx.lineTo(115, 160);
  ctx.lineTo(130, 130);
  ctx.strokeStyle = "#FF6D00";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.globalAlpha = pp(p, 1, 0.5);
  ctx.stroke();

  // Main badge circle: r 48→52→48
  ctx.beginPath();
  ctx.arc(100, 80, pp(p, 48, 52), 0, Math.PI * 2);
  ctx.strokeStyle = "#FF6D00";
  ctx.lineWidth = 4;
  ctx.globalAlpha = pp(p, 1, 0.6);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Inner rotating dashed arc
  const pRot = animPhase(elapsedMs, 10000);
  ctx.save();
  ctx.translate(100, 80);
  ctx.rotate(ramp(pRot, 0, Math.PI * 2));
  ctx.translate(-100, -80);
  ctx.beginPath();
  ctx.arc(100, 80, 32, 0, Math.PI * 2);
  ctx.setLineDash([40, 20]);
  ctx.strokeStyle = "#FFB020";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function renderFocusRect(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  const color = "#76FF03";
  const p = animPhase(elapsedMs, 3000);

  // Outer rect with animated dash offset
  ctx.beginPath();
  ctx.roundRect(8, 8, 184, 184, 4);
  ctx.setLineDash([120, 250]);
  ctx.lineDashOffset = ramp(p, 0, -740);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner thin frame (static)
  ctx.beginPath();
  ctx.roundRect(18, 18, 164, 164, 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.35;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Center crosshair gaps
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.moveTo(100, 55); ctx.lineTo(100, 75); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(100, 125); ctx.lineTo(100, 145); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(55, 100); ctx.lineTo(75, 100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(125, 100); ctx.lineTo(145, 100); ctx.stroke();
}

function renderCornerAccent(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  const corners: { start: [number, number]; cp: [number, number]; end: [number, number]; color: string; begin: number }[] = [
    { start: [8, 50], cp: [8, 8], end: [50, 8], color: "#E040FB", begin: 0 },
    { start: [150, 8], cp: [192, 8], end: [192, 50], color: "#6C55FF", begin: 450 },
    { start: [192, 150], cp: [192, 192], end: [150, 192], color: "#00B4D8", begin: 900 },
    { start: [50, 192], cp: [8, 192], end: [8, 150], color: "#E040FB", begin: 1350 },
  ];

  for (const c of corners) {
    const p = animPhase(elapsedMs, 1800, c.begin);
    ctx.globalAlpha = pp(p, 1, 0.4);
    ctx.strokeStyle = c.color;
    ctx.beginPath();
    ctx.moveTo(c.start[0], c.start[1]);
    ctx.quadraticCurveTo(c.cp[0], c.cp[1], c.end[0], c.end[1]);
    ctx.stroke();
  }

  ctx.lineCap = "butt";
}

function renderDoubleUnderline(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  ctx.lineCap = "round";

  // Ghost lines
  ctx.beginPath();
  ctx.moveTo(0, 24); ctx.lineTo(200, 24);
  ctx.strokeStyle = "rgba(108,85,255,0.2)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 34); ctx.lineTo(200, 34);
  ctx.strokeStyle = "rgba(224,64,251,0.2)";
  ctx.stroke();

  // Top sweeping line
  const p1 = animPhase(elapsedMs, 800);
  ctx.beginPath();
  ctx.moveTo(0, 24);
  ctx.lineTo(ramp(p1, 0, 200), 24);
  ctx.strokeStyle = "#6C55FF";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Bottom sweeping line with delay
  const p2 = animPhase(elapsedMs, 800, 250);
  ctx.beginPath();
  ctx.moveTo(0, 34);
  ctx.lineTo(ramp(p2, 0, 200), 34);
  ctx.strokeStyle = "#E040FB";
  ctx.stroke();

  ctx.lineCap = "butt";
}

// ─── Renderer registry ────────────────────────────────────────────────────────

interface StickerDef {
  viewBoxW: number;
  viewBoxH: number;
  render: InternalRenderer;
}

const STICKER_RENDERERS: Record<string, StickerDef> = {
  "round-pulse-circle":       { viewBoxW: 200, viewBoxH: 200, render: renderPulseCircle       },
  "round-ring-highlight":     { viewBoxW: 200, viewBoxH: 200, render: renderRingHighlight     },
  "round-arrow-circle":       { viewBoxW: 200, viewBoxH: 200, render: renderArrowCircle       },
  "round-spotlight":          { viewBoxW: 200, viewBoxH: 200, render: renderSpotlight         },
  "round-crosshair":          { viewBoxW: 200, viewBoxH: 200, render: renderCrosshair         },
  "square-box-highlight":     { viewBoxW: 200, viewBoxH: 200, render: renderBoxHighlight      },
  "square-underline":         { viewBoxW: 200, viewBoxH: 40,  render: renderSweepUnderline    },
  "square-corner-bracket":    { viewBoxW: 200, viewBoxH: 200, render: renderCornerBracket     },
  "square-animated-frame":    { viewBoxW: 200, viewBoxH: 200, render: renderDashFrame         },
  "square-arrow-callout":     { viewBoxW: 200, viewBoxH: 200, render: renderArrowCallout      },
  "square-pulse-rect":        { viewBoxW: 200, viewBoxH: 200, render: renderPulseRect         },
  "square-gradient-frame":    { viewBoxW: 200, viewBoxH: 200, render: renderGradientFrame     },
  "square-badge-ribbon":      { viewBoxW: 200, viewBoxH: 200, render: renderBadgeRibbon       },
  "square-focus-rect":        { viewBoxW: 200, viewBoxH: 200, render: renderFocusRect         },
  "square-corner-accent":     { viewBoxW: 200, viewBoxH: 200, render: renderCornerAccent      },
  "square-double-underline":  { viewBoxW: 200, viewBoxH: 40,  render: renderDoubleUnderline   },
  "arrow-up":                 { viewBoxW: 200, viewBoxH: 200, render: renderArrowUp           },
  "arrow-down":               { viewBoxW: 200, viewBoxH: 200, render: renderArrowDown         },
  "arrow-left":               { viewBoxW: 200, viewBoxH: 200, render: renderArrowLeft         },
  "arrow-right":              { viewBoxW: 200, viewBoxH: 200, render: renderArrowRight        },
  "arrow-up-right":           { viewBoxW: 200, viewBoxH: 200, render: renderArrowUpRight      },
  "arrow-down-right":         { viewBoxW: 200, viewBoxH: 200, render: renderArrowDownRight    },
  "arrow-down-left":          { viewBoxW: 200, viewBoxH: 200, render: renderArrowDownLeft     },
  "arrow-up-left":            { viewBoxW: 200, viewBoxH: 200, render: renderArrowUpLeft       },
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Draw a sticker frame onto a Canvas 2D context using a pure Canvas renderer
 * driven by `elapsedFromStartMs`. This gives frame-accurate animation sync in
 * both the preview loop and the FFmpeg export pipeline (where wall-clock time
 * runs much faster than video time).
 */
export function renderStickerFrame(
  ctx: CanvasRenderingContext2D,
  stickerData: StickerData,
  x: number,
  y: number,
  width: number,
  height: number,
  elapsedFromStartMs: number,
): void {
  const def = STICKER_RENDERERS[stickerData.stickerId];
  if (!def) return;

  const fillArea = stickerData.fillArea ?? (stickerData.category === "square");

  let drawX = x;
  let drawY = y;
  let drawW = width;
  let drawH = height;

  if (!fillArea) {
    // Contain: preserve viewBox aspect ratio
    const vbAspect = def.viewBoxW / def.viewBoxH;
    const boxAspect = width / height;
    if (vbAspect > boxAspect) {
      drawH = width / vbAspect;
      drawY = y + (height - drawH) / 2;
    } else {
      drawW = height * vbAspect;
      drawX = x + (width - drawW) / 2;
    }
  }

  ctx.save();
  ctx.translate(drawX, drawY);
  ctx.scale(drawW / def.viewBoxW, drawH / def.viewBoxH);
  ctx.globalAlpha = 1;
  def.render(ctx, elapsedFromStartMs);
  ctx.restore();
}

/** No-op: canvas renderers require no async preloading. */
export function preloadStickerImage(_stickerId: string): Promise<void> {
  return Promise.resolve();
}

/** No-op: canvas renderers require no async preloading. */
export async function preloadAllStickers(_stickerDataList: StickerData[]): Promise<void> {
  // intentional no-op
}

/** No-op: no image cache to clear. */
export function clearStickerImageCache(): void {
  // intentional no-op
}
