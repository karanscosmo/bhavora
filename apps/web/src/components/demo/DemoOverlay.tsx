'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDemo } from '@/lib/demo/DemoContext';
import { DEMO_TIMELINE, type DemoStep } from '@/lib/demo/timeline';
import {
  Pause, Play, SkipForward, SkipBack, X, Volume2, VolumeX,
  ChevronUp, ChevronDown, CheckCircle2, Bot, Maximize2, Minimize2, MousePointer
} from 'lucide-react';

// ─── Voice Engine (Chrome-safe, sentence-chained) ─────────────────────────────

function useSpeech() {
  const mutedRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const activeUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.name.toLowerCase().includes('ravi')) ||
        voices.find(v => v.name.toLowerCase().includes('veena')) ||
        voices.find(v => v.name.toLowerCase().includes('heera')) ||
        voices.find(v => v.lang.startsWith('en-') && v.name.toLowerCase().includes('google')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null;
    };

    loadVoice();
    window.speechSynthesis.onvoiceschanged = loadVoice;
  }, []);

  // Speak a text string — split into short sentences to avoid Chrome's ~15s buffer cutoff
  const speak = useCallback((text: string) => {
    if (mutedRef.current) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    activeUtterancesRef.current = [];

    // Split on sentence boundaries
    const sentences = text
      .replace(/\n/g, '. ')
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    let idx = 0;

    const speakNext = () => {
      if (idx >= sentences.length || mutedRef.current) return;

      const utt = new SpeechSynthesisUtterance(sentences[idx]);
      if (voiceRef.current) utt.voice = voiceRef.current;
      utt.rate = 1.05;    // Crisp, clear delivery
      utt.pitch = 1.0;
      utt.volume = 1.0;

      utt.onend = () => {
        idx++;
        // Small gap between sentences
        setTimeout(speakNext, 80);
      };

      utt.onerror = () => {
        idx++;
        speakNext();
      };

      activeUtterancesRef.current.push(utt);
      window.speechSynthesis.speak(utt);
    };

    speakNext();
  }, []);

  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeUtterancesRef.current = [];
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted;
    if (muted) {
      window.speechSynthesis?.cancel();
    }
  }, []);

  return { speak, cancelSpeech, setMuted };
}

// ─── Spotlight / Click Visual Indicator ──────────────────────────────────────

interface SpotlightState {
  top: number;
  left: number;
  width: number;
  height: number;
  label: string;
  isClick: boolean;
}

function SpotlightRing({ spotlight }: { spotlight: SpotlightState | null }) {
  if (!spotlight) return null;
  return (
    <>
      {/* Ring around element */}
      <div
        className="fixed pointer-events-none z-[9995] transition-all duration-500"
        style={{
          top: spotlight.top - 6,
          left: spotlight.left - 6,
          width: spotlight.width + 12,
          height: spotlight.height + 12,
          borderRadius: 10,
          border: '2px solid #2563EB',
          boxShadow: '0 0 0 4px rgba(37,99,235,0.25), 0 0 20px rgba(37,99,235,0.3)',
        }}
      />
      {/* Label below element */}
      <div
        className="fixed pointer-events-none z-[9996] transition-all duration-500"
        style={{
          top: spotlight.top + spotlight.height + 14,
          left: spotlight.left + spotlight.width / 2,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5">
          {spotlight.isClick && <MousePointer size={11} className="fill-white" />}
          {spotlight.label}
        </div>
      </div>
      {/* Click ripple */}
      {spotlight.isClick && (
        <div
          className="fixed pointer-events-none z-[9994]"
          style={{
            top: spotlight.top + spotlight.height / 2 - 16,
            left: spotlight.left + spotlight.width / 2 - 16,
          }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-[#2563EB] animate-ping opacity-75" />
        </div>
      )}
    </>
  );
}

// ─── Demo Interaction Engine ──────────────────────────────────────────────────

function useDemoInteractions(
  currentStep: DemoStep | null,
  isRunning: boolean,
  setSpotlight: (s: SpotlightState | null) => void
) {
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Clear previous timers
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
    setSpotlight(null);

    if (!currentStep || !isRunning) return;

    currentStep.interactions.forEach(action => {
      const tid = setTimeout(() => {
        const el = document.querySelector(action.selector) as HTMLElement | null;
        if (!el) return;

        // Scroll element into view
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Get bounding rect
        const rect = el.getBoundingClientRect();

        const spotlightData: SpotlightState = {
          top: rect.top + window.scrollY,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          label: action.label || '',
          isClick: action.type === 'click',
        };

        setSpotlight(spotlightData);

        if (action.type === 'click') {
          // Visual flash before click
          el.style.outline = '3px solid #2563EB';
          el.style.outlineOffset = '3px';
          setTimeout(() => {
            el.click();
            setTimeout(() => {
              el.style.outline = '';
              el.style.outlineOffset = '';
            }, 800);
          }, 300);
        }

        // Clear spotlight after 2.5s
        setTimeout(() => setSpotlight(null), 2500);
      }, action.delayMs);

      timerRefs.current.push(tid);
    });

    return () => {
      timerRefs.current.forEach(clearTimeout);
      timerRefs.current = [];
    };
  }, [currentStep?.id, isRunning, setSpotlight]);
}

// ─── Step Progress Dots ───────────────────────────────────────────────────────

function StepDots({ currentIndex, total }: { currentIndex: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`rounded-full transition-all duration-500 ${
            idx < currentIndex ? 'w-2 h-2 bg-[#10B981]' :
            idx === currentIndex ? 'w-5 h-2 bg-[#2563EB]' :
            'w-2 h-2 bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Expanded Narrator Panel ──────────────────────────────────────────────────

function ExpandedPanel({ currentStep, displayText, isTyping }: {
  currentStep: DemoStep | null;
  displayText: string;
  isTyping: boolean;
}) {
  return (
    <div className="border-t border-white/10 px-6 py-4 grid grid-cols-5 gap-5 bg-[#0A1628]/95">
      {/* Narrator text */}
      <div className="col-span-3">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2563EB] to-[#10B981] flex items-center justify-center">
            <Bot size={12} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold">Bhavishyavani — AI Narrator</span>
          {isTyping && (
            <div className="flex gap-0.5 ml-1">
              {[0, 150, 300].map(d => (
                <span key={d} className="w-1 h-1 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          )}
        </div>
        <p className="text-white/75 text-xs leading-relaxed min-h-[44px]">
          {displayText}
          {isTyping && (
            <span className="inline-block w-0.5 h-3 bg-[#2563EB] ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>

      {/* Steps panel */}
      <div className="col-span-2 flex flex-col gap-1 max-h-[100px] overflow-y-auto scrollbar-hide">
        {DEMO_TIMELINE.slice(
          Math.max(0, (currentStep?.stepNumber ?? 1) - 3),
          Math.min(DEMO_TIMELINE.length, (currentStep?.stepNumber ?? 1) + 2)
        ).map(step => {
          const isCurrent = step.id === currentStep?.id;
          return (
            <div
              key={step.id}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${
                isCurrent ? 'bg-[#2563EB]/25 border border-[#2563EB]/40' : 'opacity-40'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                (currentStep?.stepNumber ?? 0) > step.stepNumber ? 'bg-[#10B981]' :
                isCurrent ? 'bg-[#2563EB] animate-pulse' : 'bg-white/20'
              }`}>
                {(currentStep?.stepNumber ?? 0) > step.stepNumber
                  ? <CheckCircle2 size={10} className="text-white" />
                  : <span className="text-white text-[8px] font-bold">{step.stepNumber}</span>
                }
              </div>
              <span className={`font-${isCurrent ? 'bold' : 'medium'} ${isCurrent ? 'text-white' : 'text-white/60'} truncate`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Completion State ─────────────────────────────────────────────────────────

function CompletionBar({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex items-center gap-5 flex-1">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10B981] to-[#2563EB] flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={16} className="text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm">Demo Complete — All 12 Modules Demonstrated</div>
          <div className="text-white/50 text-xs">Projected Savings: ₹4,200 Cr · Risk Reduction: 67% · Payback: 4.2 yrs</div>
        </div>
      </div>
      <button
        onClick={onExit}
        className="ml-auto flex-shrink-0 bg-white text-[#0A1628] text-sm font-bold px-5 py-2 rounded-xl hover:bg-white/90 transition-all"
      >
        Return to Dashboard
      </button>
    </div>
  );
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────

export function DemoOverlay() {
  const {
    state, currentStep, progressPercent,
    pauseDemo, resumeDemo, nextStep, prevStep, exitDemo, toggleMute
  } = useDemo();

  const [isExpanded, setIsExpanded] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [spotlight, setSpotlight] = useState<SpotlightState | null>(null);

  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStepIdRef = useRef<string | null>(null);

  const { speak, cancelSpeech, setMuted } = useSpeech();

  // Sync mute state
  useEffect(() => {
    setMuted(state.isMuted);
  }, [state.isMuted, setMuted]);

  // On step change: typewriter + voice
  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.id === prevStepIdRef.current) return;
    prevStepIdRef.current = currentStep.id;

    if (typingRef.current) clearTimeout(typingRef.current);
    setDisplayText('');
    setIsTyping(true);

    // Speak short voice text immediately
    speak(currentStep.voiceText);

    // Typewriter for the detail text
    const text = currentStep.narrationDetail;
    let idx = 0;
    const typeNext = () => {
      if (idx <= text.length) {
        setDisplayText(text.slice(0, idx));
        idx += 2; // 2 chars per tick for snappy feel
        typingRef.current = setTimeout(typeNext, 20);
      } else {
        setIsTyping(false);
      }
    };
    typingRef.current = setTimeout(typeNext, 200);

    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, [currentStep, speak]);

  // Cancel speech on exit/mute
  useEffect(() => {
    if (state.status === 'idle') { cancelSpeech(); setSpotlight(null); }
  }, [state.status, cancelSpeech]);

  // Run interactions
  const isRunning = state.status === 'running';
  useDemoInteractions(currentStep, isRunning, setSpotlight);

  if (state.status === 'idle') return null;

  const isCompleted = state.status === 'completed';

  return (
    <>
      {/* Top progress stripe */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-black/10">
        <div
          className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] transition-all duration-500"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      {/* Spotlight ring follows highlighted element */}
      <SpotlightRing spotlight={spotlight} />

      {/* Bottom demo bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[9990]">
        <div className="bg-[#0A1628]/97 backdrop-blur-xl border-t border-white/10 shadow-[0_-6px_30px_rgba(0,0,0,0.4)]">

          {/* Pull tab */}
          <button
            onClick={() => setIsExpanded(v => !v)}
            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0A1628]/95 border border-white/10 px-6 py-1.5 rounded-t-xl flex items-center gap-2 text-white/60 hover:text-white text-[11px] font-semibold transition-all"
          >
            {isExpanded ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
            Bhavora Demo Mode
            <span className={`w-1.5 h-1.5 rounded-full ${state.isPaused ? 'bg-amber-400' : 'bg-[#10B981] animate-pulse'}`} />
          </button>

          {/* Expanded narrator */}
          {isExpanded && !isCompleted && (
            <ExpandedPanel currentStep={currentStep} displayText={displayText} isTyping={isTyping} />
          )}

          {/* Main bar — 68px */}
          <div className="flex items-center gap-4 px-6 h-[68px]">
            {isCompleted ? (
              <CompletionBar onExit={exitDemo} />
            ) : (
              <>
                {/* Status dot + step count */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${state.isPaused ? 'bg-amber-400' : 'bg-[#10B981] animate-pulse'}`} />
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                    {state.isPaused ? 'PAUSED' : 'LIVE DEMO'}
                  </span>
                  <span className="text-white/30 hidden sm:block">|</span>
                  <span className="text-white text-xs font-bold">
                    {state.currentStepIndex + 1}<span className="text-white/30">/{state.totalSteps}</span>
                  </span>
                </div>

                {/* Step dots */}
                <StepDots currentIndex={state.currentStepIndex} total={state.totalSteps} />

                {/* Current step name */}
                {currentStep && (
                  <div className="hidden lg:flex flex-col flex-shrink-0">
                    <span className="text-white font-bold text-sm leading-tight">{currentStep.title}</span>
                    <span className="text-white/40 text-[10px]">{currentStep.subtitle}</span>
                  </div>
                )}

                {/* Spotlight hint (shows what's being highlighted) */}
                {spotlight?.label && (
                  <div className="hidden md:flex items-center gap-1.5 bg-[#2563EB]/15 border border-[#2563EB]/25 text-[#93C5FD] text-[11px] font-semibold px-3 py-1 rounded-full flex-shrink-0">
                    <MousePointer size={11} />
                    {spotlight.label}
                  </div>
                )}

                <div className="flex-1" />

                {/* Controls */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={prevStep}
                    disabled={state.currentStepIndex === 0}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    title="Previous"
                  >
                    <SkipBack size={15} />
                  </button>

                  <button
                    onClick={state.isPaused ? resumeDemo : pauseDemo}
                    className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    {state.isPaused
                      ? <><Play size={13} className="fill-white" /> Resume</>
                      : <><Pause size={13} /> Pause</>
                    }
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={state.currentStepIndex >= state.totalSteps - 1}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    title="Skip step"
                  >
                    <SkipForward size={15} />
                  </button>

                  <button
                    onClick={toggleMute}
                    className={`p-2 rounded-lg transition-all ${state.isMuted ? 'text-amber-400 bg-amber-400/10' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                    title={state.isMuted ? 'Unmute' : 'Mute voice'}
                  >
                    {state.isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>

                  <button
                    onClick={() => setIsExpanded(v => !v)}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all hidden md:block"
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </button>

                  <div className="w-px h-5 bg-white/10 mx-1" />

                  <button
                    onClick={exitDemo}
                    className="p-2 rounded-lg text-red-400/60 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    title="Exit demo"
                  >
                    <X size={15} />
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
