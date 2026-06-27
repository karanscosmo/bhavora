import React from 'react';

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30 overflow-hidden">
        {/* Urban Grid Background inside Logo */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
        
        {/* AI Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-white/20 rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Central 'B' Symbol */}
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 11h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none">BHAVORA</span>
        <span className="text-[9px] uppercase tracking-widest text-blue-600 font-bold leading-none mt-0.5">Urban Intelligence OS</span>
      </div>
    </div>
  );
}
