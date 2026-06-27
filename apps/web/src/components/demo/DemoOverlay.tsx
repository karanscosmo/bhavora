'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDemo } from '@/lib/demo/DemoContext';
import { DEMO_TIMELINE } from '@/lib/demo/timeline';
import {
  Pause, Play, SkipForward, SkipBack, X, Volume2, VolumeX,
  ChevronUp, ChevronDown, CheckCircle2, Bot, Maximize2, Minimize2
} from 'lucide-react';

// ─── Web Speech API Voice ─────────────────────────────────────────────────────

function useSpeech(isMuted: boolean) {
  const speakRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const getVoice = (): SpeechSynthesisVoice | null => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer Indian English
      return (
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.lang === 'en-IN' && v.name.includes('Google')) ||
        voices.find(v => v.name.toLowerCase().includes('ravi')) ||
        voices.find(v => v.name.toLowerCase().includes('veena')) ||
        voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null
      );
    };

    speakRef.current = (text: string) => {
      if (isMuted) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 0.92;   // Slightly slower = clearer
      utterance.pitch = 1.05;  // Slightly higher = more engaging
      utterance.volume = 1.0;  // Maximum volume
      window.speechSynthesis.speak(utterance);
    };

    // Pre-load voices
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, [isMuted]);

  const speak = useCallback((text: string) => {
    speakRef.current?.(text);
  }, []);

  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, cancelSpeech };
}

// ─── Step Dot Progress ────────────────────────────────────────────────────────

function StepDots({ currentIndex, total }: { currentIndex: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`rounded-full transition-all duration-500 ${
            idx < currentIndex
              ? 'w-2 h-2 bg-[#10B981]'
              : idx === currentIndex
              ? 'w-4 h-2 bg-[#2563EB] animate-pulse'
              : 'w-2 h-2 bg-white/25'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Completion Panel ─────────────────────────────────────────────────────────

function CompletionPanel({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex items-center gap-6 flex-1">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10B981] to-[#2563EB] flex items-center justify-center">
          <CheckCircle2 size={16} className="text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm">Demo Complete — All 12 Modules Demonstrated</div>
          <div className="text-white/50 text-xs">Projected Savings: ₹4,200 Cr · Risk Reduction: 67% · ROI: 4.2 years</div>
        </div>
      </div>
      <button
        onClick={onExit}
        className="ml-auto bg-white text-[#0A1628] text-sm font-bold px-4 py-2 rounded-xl hover:bg-white/90 transition-all"
      >
        Return to Dashboard
      </button>
    </div>
  );
}

// ─── Expanded Narrator Panel ──────────────────────────────────────────────────

function ExpandedPanel({ currentStep, isTypingNarration, displayText }: {
  currentStep: typeof DEMO_TIMELINE[0] | null;
  isTypingNarration: boolean;
  displayText: string;
}) {
  return (
    <div className="border-t border-white/10 px-6 py-4 grid grid-cols-3 gap-6">
      {/* Narrator */}
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2563EB] to-[#10B981] flex items-center justify-center">
            <Bot size={12} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold">Bhavishyavani AI Narrator</span>
          {isTypingNarration && (
            <div className="flex gap-0.5 ml-1">
              {[0, 150, 300].map(d => (
                <span key={d} className="w-1 h-1 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          )}
        </div>
        <p className="text-white/75 text-xs leading-relaxed min-h-[40px]">
          {displayText}
          {isTypingNarration && (
            <span className="inline-block w-0.5 h-3 bg-[#2563EB] ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>
      {/* Step spotlight */}
      {currentStep?.spotlight && (
        <div className="bg-[#2563EB]/20 border border-[#2563EB]/30 rounded-xl p-3 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Now Showing</span>
          </div>
          <p className="text-white text-xs leading-snug">{currentStep.spotlight.message}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Demo Overlay (Bottom Bar) ──────────────────────────────────────────

export function DemoOverlay() {
  const { state, currentStep, progressPercent, pauseDemo, resumeDemo, nextStep, prevStep, exitDemo, toggleMute } = useDemo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTypingNarration, setIsTypingNarration] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStepIdRef = useRef<string | null>(null);

  const { speak, cancelSpeech } = useSpeech(state.isMuted);

  // Typewriter + voice on step change
  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.id === prevStepIdRef.current) return;
    prevStepIdRef.current = currentStep.id;

    // Cancel previous
    if (typingRef.current) clearTimeout(typingRef.current);
    setDisplayText('');
    setIsTypingNarration(true);

    const text = currentStep.narrationDetail || currentStep.narration;

    // Speak immediately
    speak(text);

    // Typewriter
    let idx = 0;
    const typeNext = () => {
      if (idx < text.length) {
        setDisplayText(text.slice(0, idx + 1));
        idx++;
        typingRef.current = setTimeout(typeNext, 22);
      } else {
        setIsTypingNarration(false);
      }
    };
    typingRef.current = setTimeout(typeNext, 300);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [currentStep, speak]);

  // Cancel speech on mute toggle
  useEffect(() => {
    if (state.isMuted) cancelSpeech();
  }, [state.isMuted, cancelSpeech]);

  // Cancel speech on exit
  useEffect(() => {
    if (state.status === 'idle') cancelSpeech();
  }, [state.status, cancelSpeech]);

  if (state.status === 'idle' || state.status === 'exiting') return null;

  const isCompleted = state.status === 'completed';

  return (
    <>
      {/* Subtle top progress bar spanning full width */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-black/20">
        <div
          className="h-full bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#2563EB] transition-all duration-300"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      {/* Bottom Demo Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[9990] transition-all duration-300">
        <div className="bg-[#0A1628]/97 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
          
          {/* Expand/collapse pull tab */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0A1628] border border-white/10 px-5 py-1.5 rounded-t-xl flex items-center gap-2 text-white/60 hover:text-white text-xs font-medium transition-all"
          >
            {isExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
            <span>Bhavora Demo</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          </button>

          {/* Expanded panel — narrator + spotlight */}
          {isExpanded && !isCompleted && (
            <ExpandedPanel
              currentStep={currentStep}
              isTypingNarration={isTypingNarration}
              displayText={displayText}
            />
          )}

          {/* Main Bottom Bar */}
          <div className="flex items-center gap-4 px-6 h-[68px]">
            
            {/* Left: Status */}
            {isCompleted ? (
              <CompletionPanel onExit={exitDemo} />
            ) : (
              <>
                {/* Step indicator */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${state.isPaused ? 'bg-amber-400' : 'bg-[#10B981] animate-pulse'}`} />
                    <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                      {state.isPaused ? 'PAUSED' : 'DEMO LIVE'}
                    </span>
                  </div>
                  <div className="text-white/20">|</div>
                  <span className="text-white/80 text-xs font-bold">
                    {state.currentStepIndex + 1}/{state.totalSteps}
                  </span>
                </div>

                {/* Step dots */}
                <StepDots currentIndex={state.currentStepIndex} total={state.totalSteps} />

                {/* Current step name */}
                {currentStep && (
                  <div className="hidden md:flex flex-col">
                    <span className="text-white font-bold text-sm leading-tight">{currentStep.title}</span>
                    <span className="text-white/40 text-[10px]">{currentStep.subtitle}</span>
                  </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={prevStep}
                    disabled={state.currentStepIndex === 0}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Previous"
                  >
                    <SkipBack size={16} />
                  </button>

                  <button
                    onClick={state.isPaused ? resumeDemo : pauseDemo}
                    className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg"
                  >
                    {state.isPaused
                      ? <><Play size={13} className="fill-white" /> Resume</>
                      : <><Pause size={13} /> Pause</>
                    }
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={state.currentStepIndex >= state.totalSteps - 1}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Skip"
                  >
                    <SkipForward size={16} />
                  </button>

                  <button
                    onClick={toggleMute}
                    className={`p-2 rounded-lg transition-all ${state.isMuted ? 'text-amber-400 bg-amber-400/10' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                    title={state.isMuted ? 'Unmute voice' : 'Mute voice'}
                  >
                    {state.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    title={isExpanded ? 'Collapse' : 'Expand narrator'}
                  >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>

                  <div className="w-px h-6 bg-white/10" />

                  <button
                    onClick={exitDemo}
                    className="p-2 rounded-lg text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    title="Exit demo"
                  >
                    <X size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
