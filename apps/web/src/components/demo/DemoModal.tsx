'use client';

import React, { useState } from 'react';
import { useDemo } from '@/lib/demo/DemoContext';
import { DEMO_MODES } from '@/lib/demo/types';
import type { DemoMode } from '@/lib/demo/types';
import { X, Play, Clock, ChevronRight } from 'lucide-react';

export function DemoModal() {
  const { state, startDemo, closeModal } = useDemo();
  const [selectedMode, setSelectedMode] = useState<DemoMode>('executive');

  if (!state.showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[520px] mx-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1628] to-[#1a2d4a] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center">
                <Play size={18} className="text-white fill-white" />
              </div>
              <div>
                <h2 className="text-white text-lg font-bold tracking-tight">Automated Product Walkthrough</h2>
                <p className="text-blue-300 text-xs mt-0.5">Bhavora Urban Intelligence OS</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Duration badge */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <Clock size={12} />
              Estimated Duration: 2m 30s
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              12 Modules • Fully Automated
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="px-6 pt-5 pb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Select Demo Mode</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`text-left p-3.5 rounded-xl border-2 transition-all duration-200 ${
                  selectedMode === mode.id
                    ? 'border-[#2563EB] bg-blue-50'
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="text-xl mb-1.5">{mode.icon}</div>
                <div className={`text-sm font-bold mb-0.5 ${selectedMode === mode.id ? 'text-[#2563EB]' : 'text-slate-800'}`}>
                  {mode.label}
                </div>
                <div className="text-xs text-slate-500 leading-tight">{mode.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* What you'll see */}
        <div className="px-6 pb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">What you&apos;ll see</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Executive Overview', 'City Twin GIS', 'Disaster Response', 'Decision Twin',
              'Simulation Engine', 'AI Insights', 'Analytics', 'Report Generation',
              'Bhavishyavani AI', 'Impact Analysis'
            ].map(item => (
              <span key={item} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            No interaction required. Press <kbd className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono">Esc</kbd> to exit anytime.
          </p>
          <button
            onClick={() => startDemo(selectedMode)}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95"
          >
            <Play size={15} className="fill-white" />
            Start Demo
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
