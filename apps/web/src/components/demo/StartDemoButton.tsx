'use client';

import React from 'react';
import { useDemo } from '@/lib/demo/DemoContext';
import { Play } from 'lucide-react';

interface StartDemoButtonProps {
  variant?: 'hero' | 'compact' | 'floating';
  className?: string;
}

export function StartDemoButton({ variant = 'hero', className = '' }: StartDemoButtonProps) {
  const { openModal } = useDemo();

  if (variant === 'compact') {
    return (
      <button
        id="start-demo-btn-compact"
        onClick={openModal}
        className={`flex items-center gap-2 bg-[#0A1628] hover:bg-[#1a2d4a] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-white/10 ${className}`}
      >
        <Play size={12} className="fill-white" />
        Start Demo
      </button>
    );
  }

  if (variant === 'floating') {
    return (
      <button
        id="start-demo-btn-floating"
        onClick={openModal}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl shadow-blue-900/40 hover:shadow-blue-800/50 transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      >
        <Play size={16} className="fill-white" />
        ▶ Start Executive Demo
      </button>
    );
  }

  // Hero variant (default)
  return (
    <button
      id="start-demo-btn-hero"
      onClick={openModal}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1e3a5f 100%)',
        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.35), 0 1px 0 rgba(255,255,255,0.1) inset',
      }}
    >
      {/* Animated shimmer */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Pulsing dot */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]" />
      </span>

      <Play size={16} className="text-white fill-white relative z-10" />
      <span className="text-white relative z-10">▶ Start Executive Demo</span>
    </button>
  );
}
