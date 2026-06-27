import React from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/ui/Logo';

export function BrandHeader() {
  return (
    <div 
      className="flex items-center px-[24px] bg-white border-b border-[var(--border-subtle)] flex-shrink-0"
      style={{ height: '76px' }} // 72-80px as requested
    >
      <Link href="/overview" className="flex items-center flex-shrink-0" style={{ gap: '12px' }}>
        <LogoIcon size={52} className="text-[#0A1628]" />
        <div className="flex flex-col justify-center">
          <span 
            className="text-[var(--text-primary)]"
            style={{ 
              fontSize: '22px', 
              fontWeight: 700, 
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-sans)'
            }}
          >
            BHAVORA
          </span>
          <span 
            className="text-[var(--text-muted)]"
            style={{ 
              fontSize: '11px', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.18em', 
              lineHeight: 1.2,
              marginTop: '2px'
            }}
          >
            URBAN INTELLIGENCE OS
          </span>
        </div>
      </Link>
    </div>
  );
}
