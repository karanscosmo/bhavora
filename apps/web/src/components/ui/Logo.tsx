import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

// 36×36 viewBox grid system:
// 4 cols × 5 rows of city blocks (5×5 each, 1-unit "street" gaps)
// Cols at x=5, 11, 17, 23 — Rows at y=4, 10, 16, 22, 28
//
// B letterform block pattern:
// Row 0 (y=4):  ■ ■ ■ ■   top bar
// Row 1 (y=10): ■ □ □ ■   top bump (spine + far right)
// Row 2 (y=16): ■ ■ ■ □   middle bar
// Row 3 (y=22): ■ □ □ ■   bottom bump (spine + far right)
// Row 4 (y=28): ■ ■ ■ ■   bottom bar

const BLOCK_SIZE = 5;
const GAP = 1;
const COL_POSITIONS = [5, 11, 17, 23];
const ROW_POSITIONS = [4, 10, 16, 22, 28];

// B pattern — which blocks are present (1) vs absent (0)
const B_PATTERN: number[][] = [
  [1, 1, 1, 1], // row 0 — top bar
  [1, 0, 0, 1], // row 1 — top bump
  [1, 1, 1, 0], // row 2 — middle bar
  [1, 0, 0, 1], // row 3 — bottom bump
  [1, 1, 1, 1], // row 4 — bottom bar
];

function BBlocks({ rx = 1.2 }: { rx?: number }) {
  return (
    <g>
      {B_PATTERN.map((row, ri) =>
        row.map((present, ci) =>
          present ? (
            <rect
              key={`${ri}-${ci}`}
              x={COL_POSITIONS[ci]}
              y={ROW_POSITIONS[ri]}
              width={BLOCK_SIZE}
              height={BLOCK_SIZE}
              rx={rx}
              fill="currentColor"
            />
          ) : null
        )
      )}
    </g>
  );
}

function GridLines() {
  return (
    <g stroke="currentColor" strokeWidth="0.4" opacity="0.12">
      {/* Horizontal streets */}
      <line x1="5" y1="9" x2="28" y2="9" />
      <line x1="5" y1="15" x2="28" y2="15" />
      <line x1="5" y1="21" x2="28" y2="21" />
      <line x1="5" y1="27" x2="28" y2="27" />
      {/* Vertical streets */}
      <line x1="10" y1="4" x2="10" y2="33" />
      <line x1="16" y1="4" x2="16" y2="33" />
      <line x1="22" y1="4" x2="22" y2="33" />
      {/* Perimeter grid frame */}
      <rect x="5" y="4" width="23" height="29" rx="0" strokeWidth="0.5" fill="none" />
    </g>
  );
}

function PulseArc() {
  const teal = '#006242';
  return (
    <g>
      {/* Outer arc — subtle halo */}
      <path
        d="M 4 18 A 14 14 0 0 1 32 18"
        fill="none"
        stroke={teal}
        strokeWidth="1.5"
        opacity="0.1"
      />
      {/* Mid arc */}
      <path
        d="M 8 18 A 10 10 0 0 1 28 18"
        fill="none"
        stroke={teal}
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Inner arc — most visible */}
      <path
        d="M 12 18 A 6 6 0 0 1 24 18"
        fill="none"
        stroke={teal}
        strokeWidth="0.8"
        opacity="0.65"
      />
      {/* Central pulse node */}
      <circle cx="18" cy="18" r="0.8" fill={teal} opacity="0.9" />
      {/* Signal glow ring */}
      <circle cx="18" cy="18" r="2.5" fill="none" stroke={teal} strokeWidth="0.4" opacity="0.25" />
    </g>
  );
}

export function LogoDark({ className = '', size = 36 }: LogoProps) {
  const scale = size / 36;
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}
    >
      <LogoIcon size={36} />
      <div className="flex flex-col justify-center">
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          BHAVORA
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '7px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#006242',
            lineHeight: 1,
            marginTop: '3px',
          }}
        >
          URBAN INTELLIGENCE OS
        </span>
      </div>
    </div>
  );
}

export function LogoLight({ className = '', size = 36 }: LogoProps) {
  const scale = size / 36;
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}
    >
      <LogoIcon size={36} color="#004ac6" />
      <div className="flex flex-col justify-center">
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '-0.02em',
            color: '#0b1c30',
            lineHeight: 1,
          }}
        >
          BHAVORA
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '7px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#004ac6',
            lineHeight: 1,
            marginTop: '3px',
          }}
        >
          URBAN INTELLIGENCE OS
        </span>
      </div>
    </div>
  );
}

export function LogoIcon({
  size = 36,
  className = '',
  color = 'currentColor',
  pulseColor = '#006242',
}: {
  size?: number;
  className?: string;
  color?: string;
  pulseColor?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bhavora Logo"
      className={className}
      style={{ color }}
    >
      <BBlocks />
    </svg>
  );
}

export function FaviconIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bhavora"
    >
      {/* Dark rounded background */}
      <rect width="32" height="32" rx="6" fill="#0b1c30" />

      {/* Simplified B blocks scaled to 32×32 viewBox */}
      {/* Same 4×5 pattern, adjusted coords: scale = 32/36, blocks slightly smaller */}
      <g fill="#ffffff">
        {/* Row 0 — top bar */}
        <rect x="4" y="3" width="5" height="5" rx="1.2" />
        <rect x="10" y="3" width="5" height="5" rx="1.2" />
        <rect x="16" y="3" width="5" height="5" rx="1.2" />
        <rect x="22" y="3" width="5" height="5" rx="1.2" />
        {/* Row 1 — top bump */}
        <rect x="4" y="9" width="5" height="5" rx="1.2" />
        <rect x="22" y="9" width="5" height="5" rx="1.2" />
        {/* Row 2 — middle bar */}
        <rect x="4" y="15" width="5" height="5" rx="1.2" />
        <rect x="10" y="15" width="5" height="5" rx="1.2" />
        <rect x="16" y="15" width="5" height="5" rx="1.2" />
        {/* Row 3 — bottom bump */}
        <rect x="4" y="21" width="5" height="5" rx="1.2" />
        <rect x="22" y="21" width="5" height="5" rx="1.2" />
        {/* Row 4 — bottom bar */}
        <rect x="4" y="27" width="5" height="5" rx="1.2" />
        <rect x="10" y="27" width="5" height="5" rx="1.2" />
        <rect x="16" y="27" width="5" height="5" rx="1.2" />
        <rect x="22" y="27" width="5" height="5" rx="1.2" />
      </g>
    </svg>
  );
}
