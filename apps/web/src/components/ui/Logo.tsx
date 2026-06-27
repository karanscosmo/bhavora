import React from 'react';

// === BHAVORA BRAND LOGO SYSTEM ===
// B + Urban Grid + Digital Twin Pulse

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Dark logo variant — icon in cyan, wordmark in white
 * Readable at 24px height and 200px height
 */
export function LogoDark({ className = '', size = 36 }: LogoProps) {
  const scale = size / 36;
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      <LogoIcon size={36} variant="dark" />
      <div className="flex flex-col justify-center">
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: '18px',
          letterSpacing: '-0.02em',
          color: '#ffffff',
          lineHeight: 1,
        }}>BHAVORA</span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#00D4FF',
          lineHeight: 1,
          marginTop: '2px',
        }}>URBAN OS</span>
      </div>
    </div>
  );
}

/**
 * Light logo variant — icon in #0F1E38, wordmark in #050A14
 */
export function LogoLight({ className = '', size = 36 }: LogoProps) {
  const scale = size / 36;
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      <LogoIcon size={36} variant="light" />
      <div className="flex flex-col justify-center">
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: '18px',
          letterSpacing: '-0.02em',
          color: '#050A14',
          lineHeight: 1,
        }}>BHAVORA</span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#0F1E38',
          lineHeight: 1,
          marginTop: '2px',
        }}>URBAN OS</span>
      </div>
    </div>
  );
}

/**
 * The B Icon — urban grid within letterform + pulse arc
 */
export function LogoIcon({ size = 36, variant = 'dark' }: { size?: number; variant?: 'dark' | 'light' }) {
  const primary = variant === 'dark' ? '#00D4FF' : '#0F1E38';
  const bg = variant === 'dark' ? '#0A1628' : '#E8F0FE';
  const gridStroke = variant === 'dark' ? 'rgba(0,212,255,0.15)' : 'rgba(15,30,56,0.1)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bhavora Logo"
    >
      {/* Background */}
      <rect width="36" height="36" rx="8" fill={bg} />

      {/* Urban Grid inside B letterform */}
      {/* Horizontal grid lines */}
      <line x1="7" y1="12" x2="29" y2="12" stroke={gridStroke} strokeWidth="0.75" />
      <line x1="7" y1="18" x2="29" y2="18" stroke={gridStroke} strokeWidth="0.75" />
      <line x1="7" y1="24" x2="29" y2="24" stroke={gridStroke} strokeWidth="0.75" />
      {/* Vertical grid lines */}
      <line x1="12" y1="7" x2="12" y2="29" stroke={gridStroke} strokeWidth="0.75" />
      <line x1="18" y1="7" x2="18" y2="29" stroke={gridStroke} strokeWidth="0.75" />
      <line x1="24" y1="7" x2="24" y2="29" stroke={gridStroke} strokeWidth="0.75" />

      {/* B Letterform — geometric construction from urban blocks */}
      {/* Vertical stem */}
      <rect x="8" y="8" width="3.5" height="20" rx="1.5" fill={primary} />
      {/* Top arm */}
      <rect x="11.5" y="8" width="8" height="3.5" rx="1.5" fill={primary} />
      {/* Middle arm */}
      <rect x="11.5" y="16.25" width="7" height="3.5" rx="1.5" fill={primary} />
      {/* Bottom arm */}
      <rect x="11.5" y="24.5" width="8.5" height="3.5" rx="1.5" fill={primary} />
      {/* Top bump */}
      <rect x="19.5" y="8" width="3.5" height="11.75" rx="1.75" fill={primary} opacity="0.85" />
      {/* Bottom bump — slightly wider for B proportions */}
      <rect x="20" y="16.25" width="4" height="11.75" rx="2" fill={primary} opacity="0.85" />

      {/* Digital twin pulse arc — glows in the negative space */}
      <circle
        cx="18"
        cy="18"
        r="11"
        stroke={primary}
        strokeWidth="1"
        strokeDasharray="6 4"
        fill="none"
        opacity="0.18"
      />

      {/* Central pulse dot */}
      <circle cx="18" cy="18" r="2" fill={primary} opacity="0.5" />
      <circle cx="18" cy="18" r="1" fill={primary} />
    </svg>
  );
}

/**
 * Simplified icon for favicons (32x32)
 */
export function FaviconIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="6" fill="#050A14" />
      <rect x="7" y="7" width="3" height="18" rx="1.5" fill="#00D4FF" />
      <rect x="10" y="7" width="7" height="3" rx="1.5" fill="#00D4FF" />
      <rect x="10" y="14.5" width="6" height="3" rx="1.5" fill="#00D4FF" />
      <rect x="10" y="22" width="7.5" height="3" rx="1.5" fill="#00D4FF" />
      <rect x="17" y="7" width="3" height="10.5" rx="1.5" fill="#00D4FF" opacity="0.85" />
      <rect x="17.5" y="14.5" width="3.5" height="10.5" rx="1.75" fill="#00D4FF" opacity="0.85" />
    </svg>
  );
}
