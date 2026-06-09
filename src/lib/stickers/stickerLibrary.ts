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
  <rect x="2" y="2" width="196" height="196" rx="6" fill="none" stroke="#34B27B" stroke-width="5">
    <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite"/>
  </rect>
  <rect x="8" y="8" width="184" height="184" rx="4" fill="none" stroke="#34B27B" stroke-width="2.5">
    <animate attributeName="stroke-opacity" values="0.7;0.2;0.7" dur="1.2s" begin="0.3s" repeatCount="indefinite"/>
  </rect>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="2" y="2" width="60" height="60" rx="4" fill="none" stroke="#34B27B" stroke-width="4"/>
  <rect x="8" y="8" width="48" height="48" rx="3" fill="none" stroke="#34B27B" stroke-width="2"/>
</svg>`,
};

const SQUARE_UNDERLINE: StickerDef = {
  id: "square-underline",
  name: "Sweep Underline",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40">
  <line x1="0" y1="30" x2="200" y2="30" stroke="#FFB020" stroke-width="6" stroke-linecap="round">
    <animate attributeName="x2" values="0;200" dur="1s" repeatCount="indefinite"/>
  </line>
  <line x1="0" y1="30" x2="200" y2="30" stroke="#FFB020" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.3"/>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 16">
  <line x1="0" y1="12" x2="64" y2="12" stroke="#FFB020" stroke-width="5" stroke-linecap="round"/>
</svg>`,
};

const SQUARE_CORNER_BRACKET: StickerDef = {
  id: "square-corner-bracket",
  name: "Corner Brackets",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Top-left -->
  <polyline points="2,40 2,2 40,2" fill="none" stroke="#6C55FF" stroke-width="5" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
  </polyline>
  <!-- Top-right -->
  <polyline points="160,2 198,2 198,40" fill="none" stroke="#6C55FF" stroke-width="5" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" begin="0.5s" repeatCount="indefinite"/>
  </polyline>
  <!-- Bottom-right -->
  <polyline points="198,160 198,198 160,198" fill="none" stroke="#6C55FF" stroke-width="5" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" begin="1s" repeatCount="indefinite"/>
  </polyline>
  <!-- Bottom-left -->
  <polyline points="40,198 2,198 2,160" fill="none" stroke="#6C55FF" stroke-width="5" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" begin="1.5s" repeatCount="indefinite"/>
  </polyline>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <polyline points="2,18 2,2 18,2" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round"/>
  <polyline points="46,2 62,2 62,18" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round"/>
  <polyline points="62,46 62,62 46,62" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round"/>
  <polyline points="18,62 2,62 2,46" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round"/>
</svg>`,
};

const SQUARE_ANIMATED_FRAME: StickerDef = {
  id: "square-animated-frame",
  name: "Dash Frame",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect x="2" y="2" width="196" height="196" rx="4" fill="none" stroke="#FF4560" stroke-width="4" stroke-dasharray="40 20">
    <animate attributeName="stroke-dashoffset" values="0;-600" dur="4s" repeatCount="indefinite"/>
  </rect>
  <rect x="8" y="8" width="184" height="184" rx="2" fill="none" stroke="#FF4560" stroke-width="2" stroke-dasharray="30 30" stroke-opacity="0.4">
    <animate attributeName="stroke-dashoffset" values="0;480" dur="3s" repeatCount="indefinite"/>
  </rect>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="2" y="2" width="60" height="60" rx="3" fill="none" stroke="#FF4560" stroke-width="3" stroke-dasharray="16 8"/>
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
// Arrow stickers (all 4 cardinal + 4 diagonal directions)
// ---------------------------------------------------------------------------

function makeArrowSvg(
  rotation: number,
  color: string,
): { svgContent: string; thumbnailSvg: string } {
  // The base arrow points UP. We rotate the entire group around (100,100).
  // Arrow shaft: 100,160 → 100,45; Head: triangle at top.
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <g transform="rotate(${rotation} 100 100)">
    <!-- Arrow shaft -->
    <line x1="100" y1="155" x2="100" y2="50" stroke="${color}" stroke-width="5" stroke-linecap="round">
      <animate attributeName="y1" values="155;150;155" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="y2" values="50;42;50" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" values="1;0.7;1" dur="1s" repeatCount="indefinite"/>
    </line>
    <!-- Arrow head (chevron) -->
    <polyline points="70,70 100,42 130,70" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <animate attributeName="points" values="70,70 100,42 130,70;70,62 100,34 130,62;70,70 100,42 130,70" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" values="1;0.8;1" dur="1s" repeatCount="indefinite"/>
    </polyline>
    <!-- Small accent dot near tail -->
    <circle cx="100" cy="160" r="4" fill="${color}">
      <animate attributeName="r" values="4;3;4" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="fill-opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
    </circle>
  </g>
</svg>`;

  const thumbnailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <g transform="rotate(${rotation} 32 32)">
    <line x1="32" y1="50" x2="32" y2="16" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <polyline points="22,24 32,14 42,24" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="32" cy="52" r="2.5" fill="${color}"/>
  </g>
</svg>`;

  return { svgContent, thumbnailSvg };
}

const ARROW_UP: StickerDef = {
  id: "arrow-up",
  name: "Arrow Up",
  category: "arrow",
  ...makeArrowSvg(0, "#34B27B"),
};

const ARROW_DOWN: StickerDef = {
  id: "arrow-down",
  name: "Arrow Down",
  category: "arrow",
  ...makeArrowSvg(180, "#FF4560"),
};

const ARROW_LEFT: StickerDef = {
  id: "arrow-left",
  name: "Arrow Left",
  category: "arrow",
  ...makeArrowSvg(-90, "#FFB020"),
};

const ARROW_RIGHT: StickerDef = {
  id: "arrow-right",
  name: "Arrow Right",
  category: "arrow",
  ...makeArrowSvg(90, "#6C55FF"),
};

const ARROW_UP_RIGHT: StickerDef = {
  id: "arrow-up-right",
  name: "Arrow Up-Right",
  category: "arrow",
  ...makeArrowSvg(45, "#00B4D8"),
};

const ARROW_DOWN_RIGHT: StickerDef = {
  id: "arrow-down-right",
  name: "Arrow Down-Right",
  category: "arrow",
  ...makeArrowSvg(135, "#E040FB"),
};

const ARROW_DOWN_LEFT: StickerDef = {
  id: "arrow-down-left",
  name: "Arrow Down-Left",
  category: "arrow",
  ...makeArrowSvg(225, "#FF6D00"),
};

const ARROW_UP_LEFT: StickerDef = {
  id: "arrow-up-left",
  name: "Arrow Up-Left",
  category: "arrow",
  ...makeArrowSvg(-45, "#76FF03"),
};

// ---------------------------------------------------------------------------
// Additional square / rectangular stickers with varied colors
// ---------------------------------------------------------------------------

const SQUARE_PULSE_RECT: StickerDef = {
  id: "square-pulse-rect",
  name: "Pulse Rectangle",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect x="15" y="15" width="170" height="170" rx="20" fill="none" stroke="#00B4D8" stroke-width="4">
    <animate attributeName="stroke-width" values="4;7;4" dur="1.4s" repeatCount="indefinite"/>
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite"/>
  </rect>
  <rect x="25" y="25" width="150" height="150" rx="14" fill="none" stroke="#00B4D8" stroke-width="2">
    <animate attributeName="stroke-opacity" values="0.6;0.15;0.6" dur="1.4s" begin="0.35s" repeatCount="indefinite"/>
  </rect>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="6" y="6" width="52" height="52" rx="8" fill="none" stroke="#00B4D8" stroke-width="4"/>
  <rect x="12" y="12" width="40" height="40" rx="6" fill="none" stroke="#00B4D8" stroke-width="2"/>
</svg>`,
};

const SQUARE_GRADIENT_FRAME: StickerDef = {
  id: "square-gradient-frame",
  name: "Gradient Frame",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="gfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E040FB"/>
      <stop offset="50%" stop-color="#6C55FF"/>
      <stop offset="100%" stop-color="#00B4D8"/>
      <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite"/>
      <animate attributeName="y2" values="100%;0%;100%" dur="4s" repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="180" height="180" rx="12" fill="none" stroke="url(#gfGrad)" stroke-width="5"/>
  <rect x="20" y="20" width="160" height="160" rx="8" fill="none" stroke="url(#gfGrad)" stroke-width="2" stroke-opacity="0.4"/>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="gfGradT" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E040FB"/><stop offset="100%" stop-color="#00B4D8"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="56" height="56" rx="6" fill="none" stroke="url(#gfGradT)" stroke-width="4"/>
  <rect x="10" y="10" width="44" height="44" rx="4" fill="none" stroke="url(#gfGradT)" stroke-width="2" stroke-opacity="0.4"/>
</svg>`,
};

const SQUARE_BADGE_RIBBON: StickerDef = {
  id: "square-badge-ribbon",
  name: "Badge Ribbon",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Ribbon tails -->
  <polygon points="70,130 85,160 100,145 115,160 130,130" fill="none" stroke="#FF6D00" stroke-width="3" stroke-linejoin="round">
    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
  </polygon>
  <!-- Main badge circle -->
  <circle cx="100" cy="80" r="50" fill="none" stroke="#FF6D00" stroke-width="4">
    <animate attributeName="r" values="48;52;48" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="stroke-opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/>
  </circle>
  <!-- Inner accent -->
  <circle cx="100" cy="80" r="32" fill="none" stroke="#FFB020" stroke-width="2" stroke-dasharray="40 20">
    <animateTransform attributeName="transform" type="rotate" values="0 100 80;360 100 80" dur="10s" repeatCount="indefinite"/>
  </circle>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <polygon points="22,42 28,52 32,46 36,52 42,42" fill="none" stroke="#FF6D00" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="32" cy="26" r="17" fill="none" stroke="#FF6D00" stroke-width="3"/>
  <circle cx="32" cy="26" r="10" fill="none" stroke="#FFB020" stroke-width="1.5" stroke-dasharray="14 7"/>
</svg>`,
};

const SQUARE_FOCUS_RECT: StickerDef = {
  id: "square-focus-rect",
  name: "Focus Rectangle",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Outer frame with corner gaps -->
  <rect x="8" y="8" width="184" height="184" rx="4" fill="none" stroke="#76FF03" stroke-width="3" stroke-dasharray="120 250" stroke-dashoffset="0">
    <animate attributeName="stroke-dashoffset" values="0;-740" dur="3s" repeatCount="indefinite"/>
  </rect>
  <!-- Inner thin frame -->
  <rect x="18" y="18" width="164" height="164" rx="2" fill="none" stroke="#76FF03" stroke-width="1.5" stroke-opacity="0.35"/>
  <!-- Center crosshair -->
  <line x1="100" y1="55" x2="100" y2="75" stroke="#76FF03" stroke-width="2" stroke-opacity="0.5"/>
  <line x1="100" y1="125" x2="100" y2="145" stroke="#76FF03" stroke-width="2" stroke-opacity="0.5"/>
  <line x1="55" y1="100" x2="75" y2="100" stroke="#76FF03" stroke-width="2" stroke-opacity="0.5"/>
  <line x1="125" y1="100" x2="145" y2="100" stroke="#76FF03" stroke-width="2" stroke-opacity="0.5"/>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="3" y="3" width="58" height="58" rx="3" fill="none" stroke="#76FF03" stroke-width="3"/>
  <rect x="9" y="9" width="46" height="46" rx="2" fill="none" stroke="#76FF03" stroke-width="1.5" stroke-opacity="0.35"/>
</svg>`,
};

const SQUARE_CORNER_ACCENT: StickerDef = {
  id: "square-corner-accent",
  name: "Corner Accent",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Top-left corner accent -->
  <path d="M8,50 Q8,8 50,8" fill="none" stroke="#E040FB" stroke-width="5" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite"/>
  </path>
  <!-- Top-right corner accent -->
  <path d="M150,8 Q192,8 192,50" fill="none" stroke="#6C55FF" stroke-width="5" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.8s" begin="0.45s" repeatCount="indefinite"/>
  </path>
  <!-- Bottom-right corner accent -->
  <path d="M192,150 Q192,192 150,192" fill="none" stroke="#00B4D8" stroke-width="5" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.8s" begin="0.9s" repeatCount="indefinite"/>
  </path>
  <!-- Bottom-left corner accent -->
  <path d="M50,192 Q8,192 8,150" fill="none" stroke="#E040FB" stroke-width="5" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.4;1" dur="1.8s" begin="1.35s" repeatCount="indefinite"/>
  </path>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M4,20 Q4,4 20,4" fill="none" stroke="#E040FB" stroke-width="4" stroke-linecap="round"/>
  <path d="M44,4 Q60,4 60,20" fill="none" stroke="#6C55FF" stroke-width="4" stroke-linecap="round"/>
  <path d="M60,44 Q60,60 44,60" fill="none" stroke="#00B4D8" stroke-width="4" stroke-linecap="round"/>
  <path d="M20,60 Q4,60 4,44" fill="none" stroke="#E040FB" stroke-width="4" stroke-linecap="round"/>
</svg>`,
};

const SQUARE_DOUBLE_UNDERLINE: StickerDef = {
  id: "square-double-underline",
  name: "Double Underline",
  category: "square",
  svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40">
  <!-- Top line sweeping -->
  <line x1="0" y1="24" x2="200" y2="24" stroke="#6C55FF" stroke-width="4" stroke-linecap="round">
    <animate attributeName="x2" values="0;200" dur="0.8s" repeatCount="indefinite"/>
  </line>
  <!-- Bottom line sweeping with delay -->
  <line x1="0" y1="34" x2="200" y2="34" stroke="#E040FB" stroke-width="4" stroke-linecap="round">
    <animate attributeName="x2" values="0;200" dur="0.8s" begin="0.25s" repeatCount="indefinite"/>
  </line>
  <!-- Ghost lines -->
  <line x1="0" y1="24" x2="200" y2="24" stroke="#6C55FF" stroke-width="1.5" stroke-opacity="0.2"/>
  <line x1="0" y1="34" x2="200" y2="34" stroke="#E040FB" stroke-width="1.5" stroke-opacity="0.2"/>
</svg>`,
  thumbnailSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 16">
  <line x1="0" y1="8" x2="64" y2="8" stroke="#6C55FF" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="0" y1="14" x2="64" y2="14" stroke="#E040FB" stroke-width="3.5" stroke-linecap="round"/>
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
  SQUARE_PULSE_RECT,
  SQUARE_GRADIENT_FRAME,
  SQUARE_BADGE_RIBBON,
  SQUARE_FOCUS_RECT,
  SQUARE_CORNER_ACCENT,
  SQUARE_DOUBLE_UNDERLINE,
];

const ARROW_STICKERS: StickerDef[] = [
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP_RIGHT,
  ARROW_DOWN_RIGHT,
  ARROW_DOWN_LEFT,
  ARROW_UP_LEFT,
];

export const STICKER_LIBRARY: StickerDef[] = [...ROUND_STICKERS, ...SQUARE_STICKERS, ...ARROW_STICKERS];

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
