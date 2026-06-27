'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDemo } from '@/lib/demo/DemoContext';
import { DEMO_TIMELINE } from '@/lib/demo/timeline';
import {
  Pause, Play, SkipForward, SkipBack, X, Volume2, VolumeX,
  ChevronRight, Bot, CheckCircle2
} from 'lucide-react';

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function DemoProgressBar() {
  const { state, progressPercent, stepProgressPercent, currentStep } = useDemo();

  return (
    <div className="flex flex-col gap-1">
      {/* Overall progress */}
      <div className="flex items-center justify-between text-[10px] text-white/60 font-medium">
        <span>Step {state.currentStepIndex + 1} / {state.totalSteps}</span>
        <span>{Math.round(progressPercent)}% complete</span>
      </div>
      {/* Overall bar */}
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
      {/* Step dots */}
      <div className="flex items-center gap-1 mt-1 flex-wrap">
        {DEMO_TIMELINE.map((step, idx) => (
          <div
            key={step.id}
            className={`rounded-full transition-all duration-300 ${
              idx < state.currentStepIndex
                ? 'w-4 h-1.5 bg-[#10B981]'
                : idx === state.currentStepIndex
                ? 'w-6 h-1.5 bg-[#2563EB]'
                : 'w-1.5 h-1.5 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Narrator Panel ───────────────────────────────────────────────────────────

function DemoNarrator() {
  const { currentStep, state } = useDemo();
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStepRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.id === prevStepRef.current) return;
    prevStepRef.current = currentStep.id;

    // Clear previous
    if (typingRef.current) clearTimeout(typingRef.current);
    setDisplayText('');
    setIsTyping(true);

    const text = currentStep.narrationDetail || currentStep.narration;
    let idx = 0;

    const typeNextChar = () => {
      if (idx < text.length) {
        setDisplayText(text.slice(0, idx + 1));
        idx++;
        typingRef.current = setTimeout(typeNextChar, 18);
      } else {
        setIsTyping(false);
      }
    };

    // Small delay before typing starts
    typingRef.current = setTimeout(typeNextChar, 400);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [currentStep]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563EB] to-[#10B981] flex items-center justify-center">
            <Bot size={14} className="text-white" />
          </div>
          {state.status === 'running' && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#0A1628] animate-pulse" />
          )}
        </div>
        <div>
          <span className="text-white text-xs font-bold">Bhavishyavani</span>
          <span className="text-white/40 text-[10px] ml-1.5">AI Narrator</span>
        </div>
        {isTyping && (
          <div className="ml-auto flex gap-0.5">
            <span className="w-1 h-1 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
      <p className="text-white/80 text-xs leading-relaxed min-h-[60px]">
        {displayText}
        {isTyping && <span className="inline-block w-0.5 h-3 bg-[#2563EB] ml-0.5 animate-pulse align-middle" />}
      </p>
    </div>
  );
}

// ─── Step List ────────────────────────────────────────────────────────────────

function StepList() {
  const { state } = useDemo();

  return (
    <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto scrollbar-hide">
      {DEMO_TIMELINE.map((step, idx) => (
        <div
          key={step.id}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-300 ${
            idx === state.currentStepIndex
              ? 'bg-[#2563EB]/20 border border-[#2563EB]/40'
              : idx < state.currentStepIndex
              ? 'opacity-60'
              : 'opacity-30'
          }`}
        >
          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
            idx < state.currentStepIndex
              ? 'bg-[#10B981]'
              : idx === state.currentStepIndex
              ? 'bg-[#2563EB] animate-pulse'
              : 'bg-white/20'
          }`}>
            {idx < state.currentStepIndex ? (
              <CheckCircle2 size={10} className="text-white" />
            ) : (
              <span className="text-white text-[8px] font-bold">{step.stepNumber}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold truncate">{step.title}</div>
            <div className="text-white/40 text-[10px] truncate">{step.subtitle}</div>
          </div>
          {idx === state.currentStepIndex && (
            <ChevronRight size={12} className="text-[#2563EB] flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Controls ─────────────────────────────────────────────────────────────────

function DemoControls() {
  const { state, pauseDemo, resumeDemo, nextStep, prevStep, exitDemo, toggleMute } = useDemo();

  return (
    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
      <button
        onClick={prevStep}
        disabled={state.currentStepIndex === 0}
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Previous step"
      >
        <SkipBack size={15} />
      </button>

      <button
        onClick={state.isPaused ? resumeDemo : pauseDemo}
        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all"
      >
        {state.isPaused ? (
          <><Play size={14} className="fill-white" /> Resume</>
        ) : (
          <><Pause size={14} /> Pause</>
        )}
      </button>

      <button
        onClick={nextStep}
        disabled={state.currentStepIndex >= state.totalSteps - 1}
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Skip step"
      >
        <SkipForward size={15} />
      </button>

      <button
        onClick={toggleMute}
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
        title={state.isMuted ? 'Unmute' : 'Mute'}
      >
        {state.isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>

      <button
        onClick={exitDemo}
        className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        title="Exit demo"
      >
        <X size={15} />
      </button>
    </div>
  );
}

// ─── Completed Screen ──────────────────────────────────────────────────────────

function DemoCompleted() {
  const { exitDemo } = useDemo();

  return (
    <div className="flex flex-col items-center justify-center py-6 gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10B981] to-[#2563EB] flex items-center justify-center">
        <CheckCircle2 size={24} className="text-white" />
      </div>
      <div className="text-center">
        <div className="text-white font-bold text-sm">Demo Complete</div>
        <div className="text-white/50 text-xs mt-1">All 12 modules demonstrated</div>
      </div>
      <div className="bg-white/5 rounded-xl p-4 w-full">
        <div className="text-white/60 text-[10px] uppercase tracking-wider mb-3 font-bold">Bhavora Platform Capabilities</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Projected Savings', value: '₹4,200 Cr' },
            { label: 'Risk Reduction', value: '67%' },
            { label: 'City Health Target', value: '89/100' },
            { label: 'ROI Period', value: '4.2 Yrs' },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-lg p-2.5 text-center">
              <div className="text-white font-bold text-sm">{item.value}</div>
              <div className="text-white/40 text-[9px] mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={exitDemo}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold py-2.5 rounded-xl transition-all"
      >
        Return to Dashboard
      </button>
    </div>
  );
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────

export function DemoOverlay() {
  const { state, currentStep } = useDemo();
  const [isExpanded, setIsExpanded] = useState(true);

  // Keyboard shortcut: Escape to exit
  useEffect(() => {
    // Handled by DemoProvider
  }, []);

  if (state.status === 'idle' || state.status === 'exiting') return null;

  return (
    <>
      {/* Dim overlay when running (subtle) */}
      <div className="fixed inset-0 pointer-events-none z-[8990]" />

      {/* Main Demo Panel — fixed right side */}
      <div
        className="fixed right-4 top-[80px] z-[9000] w-[320px] transition-all duration-300"
        style={{ transform: isExpanded ? 'translateX(0)' : 'translateX(calc(100% + 16px))' }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -left-9 top-4 w-8 h-8 bg-[#0A1628] border border-white/10 rounded-l-xl flex items-center justify-center text-white/60 hover:text-white transition-colors shadow-lg"
        >
          <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-0' : 'rotate-180'}`} />
        </button>

        <div className="bg-[#0A1628] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Panel Header */}
          <div className="px-4 pt-4 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-white text-xs font-bold uppercase tracking-widest">Demo Running</span>
              </div>
              <div className="text-white/40 text-[10px] font-mono">
                {state.currentStepIndex + 1}/{state.totalSteps}
              </div>
            </div>

            {/* Current step */}
            {currentStep && state.status !== 'completed' && (
              <div className="mb-3">
                <div className="text-white font-bold text-sm">{currentStep.title}</div>
                <div className="text-white/50 text-xs mt-0.5">{currentStep.subtitle}</div>
              </div>
            )}

            {/* Progress */}
            {state.status !== 'completed' && <DemoProgressBar />}
          </div>

          {/* Panel Body */}
          <div className="px-4 py-3">
            {state.status === 'completed' ? (
              <DemoCompleted />
            ) : (
              <>
                <StepList />
                <DemoNarrator />
                <DemoControls />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Step Spotlight — bottom annotation */}
      {currentStep?.spotlight && state.status === 'running' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9001] pointer-events-none">
          <div className="bg-[#0A1628]/90 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 whitespace-nowrap animate-bounce-subtle">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse flex-shrink-0" />
            {currentStep.spotlight.message}
          </div>
        </div>
      )}
    </>
  );
}
