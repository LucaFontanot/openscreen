import type { StickerCategory } from "@/components/video-editor/types";

export interface StickerDef {
  id: string;
  name: string;
  category: StickerCategory;
  /** Full SVG markup for rendering at the target size. */
  svgContent: string;
  /** Simplified thumbnail SVG for the library browser. */
  thumbnailSvg: string;
}

function makeSvgDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ---------------------------------------------------------------------------
// Round / Circular stickers
// ---------------------------------------------------------------------------

const ROUND_PULSE_CIRCLE: StickerDef = {
  id: "round-pulse-circle",
  name: "Pulse Circle",
  category: "round",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="none" stroke="#34B27B" stroke-width="6">
    <animate attributeName="r" values="70;90;70" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="100" cy="100" r="50" fill="none" stroke="#34B27B" stroke-width="3">
    <animate attributeName="r" values="50;65;50" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
    <animate attributeName="stroke-opacity" values="0.8;0.2;0.8" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="100" cy="100" r="25" fill="none" stroke="#34B27B" stroke-width="2">
    <animate attributeName="r" values="25;35;25" dur="1.5s" begin="0.6s" repeatCount="indefinite"/>
    <animate attributeName="stroke-opacity" values="0.6;0.1;0.6" dur="1.5s" begin="0.6s" repeatCount="indefinite"/>
  </circle>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="22" fill="none" stroke="#34B27B" stroke-width="4"/>
  <circle cx="32" cy="32" r="14" fill="none" stroke="#34B27B" stroke-width="2"/>
</svg>`,
};

const ROUND_RING_HIGHLIGHT: StickerDef = {
  id: "round-ring-highlight",
  name: "Ring Highlight",
  category: "round",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <radialGradient id="rhGrad" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="transparent"/>
      <stop offset="100%" stop-color="#FFB020" stop-opacity="0.4"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="95" fill="url(#rhGrad)">
    <animate attributeName="r" values="88;95;88" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="100" cy="100" r="60" fill="none" stroke="#FFB020" stroke-width="5" stroke-dasharray="94.2 94.2" stroke-dashoffset="0">
    <animate attributeName="stroke-dashoffset" values="0;-377" dur="4s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="rotate" values="0 100 100;360 100 100" dur="8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="100" cy="100" r="60" fill="none" stroke="#FFB020" stroke-width="2" stroke-opacity="0.4"/>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="26" fill="none" stroke="#FFB020" stroke-width="4" stroke-dasharray="40 40"/>
  <circle cx="32" cy="32" r="26" fill="none" stroke="#FFB020" stroke-width="1.5" stroke-opacity="0.5"/>
</svg>`,
};

const ROUND_ARROW_CIRCLE: StickerDef = {
  id: "round-arrow-circle",
  name: "Arrow Circle",
  category: "round",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="75" fill="none" stroke="#6C55FF" stroke-width="4">
    <animateTransform attributeName="transform" type="rotate" values="0 100 100;360 100 100" dur="6s" repeatCount="indefinite"/>
  </circle>
  <polygon points="100,20 115,45 100,40 85,45" fill="#6C55FF">
    <animateTransform attributeName="transform" type="rotate" values="0 100 100;360 100 100" dur="6s" repeatCount="indefinite"/>
  </polygon>
  <circle cx="100" cy="100" r="65" fill="none" stroke="#6C55FF" stroke-width="1.5" stroke-opacity="0.3"/>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="24" fill="none" stroke="#6C55FF" stroke-width="3.5"/>
  <polygon points="32,8 39,17 32,15 25,17" fill="#6C55FF"/>
</svg>`,
};

const ROUND_SPOTLIGHT: StickerDef = {
  id: "round-spotlight",
  name: "Spotlight",
  category: "round",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <radialGradient id="slGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.15"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="100" cy="100" r="99" fill="url(#slGrad)">
    <animate attributeName="r" values="85;99;85" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="100" cy="100" r="50" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.5">
    <animate attributeName="stroke-opacity" values="0.5;0.1;0.5" dur="3s" repeatCount="indefinite"/>
  </circle>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><radialGradient id="slGradT" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFF" stop-opacity="0.3"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></radialGradient></defs>
  <circle cx="32" cy="32" r="30" fill="url(#slGradT)"/>
  <circle cx="32" cy="32" r="18" fill="none" stroke="#FFF" stroke-width="2" stroke-opacity="0.5"/>
</svg>`,
};

const ROUND_CROSSHAIR: StickerDef = {
  id: "round-crosshair",
  name: "Crosshair",
  category: "round",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="none" stroke="#FF4560" stroke-width="2">
    <animate attributeName="r" values="75;85;75" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
  </circle>
  <line x1="100" y1="40" x2="100" y2="85" stroke="#FF4560" stroke-width="3">
    <animate attributeName="y2" values="85;75;85" dur="2s" repeatCount="indefinite"/>
  </line>
  <line x1="100" y1="115" x2="100" y2="160" stroke="#FF4560" stroke-width="3">
    <animate attributeName="y1" values="115;125;115" dur="2s" repeatCount="indefinite"/>
  </line>
  <line x1="40" y1="100" x2="85" y2="100" stroke="#FF4560" stroke-width="3">
    <animate attributeName="x2" values="85;75;85" dur="2s" repeatCount="indefinite"/>
  </line>
  <line x1="115" y1="100" x2="160" y2="100" stroke="#FF4560" stroke-width="3">
    <animate attributeName="x1" values="115;125;115" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="100" cy="100" r="4" fill="#FF4560"/>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="24" fill="none" stroke="#FF4560" stroke-width="2.5"/>
  <line x1="32" y1="14" x2="32" y2="26" stroke="#FF4560" stroke-width="2.5"/>
  <line x1="32" y1="38" x2="32" y2="50" stroke="#FF4560" stroke-width="2.5"/>
  <line x1="14" y1="32" x2="26" y2="32" stroke="#FF4560" stroke-width="2.5"/>
  <line x1="38" y1="32" x2="50" y2="32" stroke="#FF4560" stroke-width="2.5"/>
  <circle cx="32" cy="32" r="2.5" fill="#FF4560"/>
</svg>`,
};

// ---------------------------------------------------------------------------
// Square / Rectangular stickers
// ---------------------------------------------------------------------------

const SQUARE_BOX_HIGHLIGHT: StickerDef = {
  id: "square-box-highlight",
  name: "Box Highlight",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect x="10" y="10" width="180" height="180" rx="12" fill="none" stroke="#34B27B" stroke-width="4">
    <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite"/>
  </rect>
  <rect x="25" y="25" width="150" height="150" rx="8" fill="none" stroke="#34B27B" stroke-width="2">
    <animate attributeName="stroke-opacity" values="0.7;0.2;0.7" dur="1.2s" begin="0.3s" repeatCount="indefinite"/>
  </rect>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="4" y="4" width="56" height="56" rx="6" fill="none" stroke="#34B27B" stroke-width="4"/>
  <rect x="12" y="12" width="40" height="40" rx="4" fill="none" stroke="#34B27B" stroke-width="2"/>
</svg>`,
};

const SQUARE_UNDERLINE: StickerDef = {
  id: "square-underline",
  name: "Sweep Underline",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40">
  <line x1="10" y1="30" x2="190" y2="30" stroke="#FFB020" stroke-width="5" stroke-linecap="round">
    <animate attributeName="x2" values="10;190" dur="1s" repeatCount="indefinite"/>
  </line>
  <line x1="10" y1="30" x2="190" y2="30" stroke="#FFB020" stroke-width="2" stroke-linecap="round" stroke-opacity="0.3"/>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 16">
  <line x1="4" y1="12" x2="60" y2="12" stroke="#FFB020" stroke-width="5" stroke-linecap="round"/>
</svg>`,
};

const SQUARE_CORNER_BRACKET: StickerDef = {
  id: "square-corner-bracket",
  name: "Corner Brackets",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Top-left -->
  <polyline points="15,55 15,15 55,15" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
  </polyline>
  <!-- Top-right -->
  <polyline points="145,15 185,15 185,55" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" begin="0.5s" repeatCount="indefinite"/>
  </polyline>
  <!-- Bottom-right -->
  <polyline points="185,145 185,185 145,185" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" begin="1s" repeatCount="indefinite"/>
  </polyline>
  <!-- Bottom-left -->
  <polyline points="55,185 15,185 15,145" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" begin="1.5s" repeatCount="indefinite"/>
  </polyline>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <polyline points="6,18 6,6 18,6" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round"/>
  <polyline points="46,6 58,6 58,18" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round"/>
  <polyline points="58,46 58,58 46,58" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round"/>
  <polyline points="18,58 6,58 6,46" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round"/>
</svg>`,
};

const SQUARE_ANIMATED_FRAME: StickerDef = {
  id: "square-animated-frame",
  name: "Dash Frame",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect x="8" y="8" width="184" height="184" rx="10" fill="none" stroke="#FF4560" stroke-width="3" stroke-dasharray="40 20">
    <animate attributeName="stroke-dashoffset" values="0;-600" dur="4s" repeatCount="indefinite"/>
  </rect>
  <rect x="20" y="20" width="160" height="160" rx="6" fill="none" stroke="#FF4560" stroke-width="1.5" stroke-dasharray="30 30" stroke-opacity="0.4">
    <animate attributeName="stroke-dashoffset" values="0;480" dur="3s" repeatCount="indefinite"/>
  </rect>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="3" y="3" width="58" height="58" rx="6" fill="none" stroke="#FF4560" stroke-width="3" stroke-dasharray="16 8"/>
</svg>`,
};

const SQUARE_ARROW_CALLOUT: StickerDef = {
  id: "square-arrow-callout",
  name: "Arrow Callout",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect x="30" y="30" width="140" height="100" rx="14" fill="none" stroke="#34B27B" stroke-width="3"/>
  <polygon points="100,130 90,160 100,150 110,160" fill="none" stroke="#34B27B" stroke-width="3" stroke-linejoin="round">
    <animate attributeName="points" values="100,130 90,160 100,150 110,160;100,135 85,165 100,153 115,165;100,130 90,160 100,150 110,160" dur="1.5s" repeatCount="indefinite"/>
  </polygon>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="10" y="10" width="44" height="30" rx="6" fill="none" stroke="#34B27B" stroke-width="3"/>
  <polygon points="32,40 28,50 32,46 36,50" fill="none" stroke="#34B27B" stroke-width="3" stroke-linejoin="round"/>
</svg>`,
};

// ---------------------------------------------------------------------------
// Library
// ---------------------------------------------------------------------------

const ROUND_STICKERS: StickerDef[] = [
  ROUND_PULSE_CIRCLE,
  ROUND_RING_HIGHLIGHT,
  ROUND_ARROW_CIRCLE,
  ROUND_SPOTLIGHT,
  ROUND_CROSSHAIR,
];

const SQUARE_STICKERS: StickerDef[] = [
  SQUARE_BOX_HIGHLIGHT,
  SQUARE_UNDERLINE,
  SQUARE_CORNER_BRACKET,
  SQUARE_ANIMATED_FRAME,
  SQUARE_ARROW_CALLOUT,
];

export const STICKER_LIBRARY: StickerDef[] = [...ROUND_STICKERS, ...SQUARE_STICKERS];

const STICKER_MAP = new Map<string, StickerDef>(
  STICKER_LIBRARY.map((s) => [s.id, s]),
);

export function getStickersByCategory(category: StickerCategory): StickerDef[] {
  return STICKER_LIBRARY.filter((s) => s.category === category);
}

export function getStickerById(id: string): StickerDef | undefined {
  return STICKER_MAP.get(id);
}

export function getStickerDataUrl(sticker: StickerDef): string {
  return makeSvgDataUrl(sticker.svgContent);
}

export function getStickerThumbnailUrl(sticker: StickerDef): string {
  return makeSvgDataUrl(sticker.thumbnailSvg);
}
