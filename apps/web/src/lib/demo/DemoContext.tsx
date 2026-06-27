'use client';

import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DemoState, DemoMode } from '@/lib/demo/types';
import { DEMO_TIMELINE, TOTAL_DEMO_DURATION_MS } from '@/lib/demo/timeline';

// ─── Context Type ────────────────────────────────────────────────────────────

interface DemoContextType {
  state: DemoState;
  startDemo: (mode: DemoMode) => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  exitDemo: () => void;
  toggleMute: () => void;
  openModal: () => void;
  closeModal: () => void;
  currentStep: typeof DEMO_TIMELINE[0] | null;
  progressPercent: number;
  stepProgressPercent: number;
}

const DemoContext = createContext<DemoContextType | null>(null);

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_STATE: DemoState = {
  status: 'idle',
  mode: 'executive',
  currentStepIndex: 0,
  totalSteps: DEMO_TIMELINE.length,
  elapsedMs: 0,
  totalDurationMs: TOTAL_DEMO_DURATION_MS,
  isPaused: false,
  isMuted: false,
  showModal: false,
};

// ─── Provider ────────────────────────────────────────────────────────────────

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<DemoState>(INITIAL_STATE);
  
  // Timers
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepElapsedRef = useRef(0);
  const stepStartTimeRef = useRef(0);
  const currentStepIndexRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const advanceToStep = useCallback((stepIndex: number, mode: DemoMode) => {
    if (stepIndex >= DEMO_TIMELINE.length) {
      // Demo complete
      setState(prev => ({ ...prev, status: 'completed' }));
      return;
    }

    const step = DEMO_TIMELINE[stepIndex];
    currentStepIndexRef.current = stepIndex;
    stepElapsedRef.current = 0;
    stepStartTimeRef.current = Date.now();

    setState(prev => ({
      ...prev,
      currentStepIndex: stepIndex,
      status: 'running',
    }));

    // Navigate to the step's route
    router.push(step.route);

    // Progress tracking interval (update every 100ms for smooth bar)
    clearTimers();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - stepStartTimeRef.current;
      stepElapsedRef.current = elapsed;
      setState(prev => {
        if (prev.isPaused) return prev;
        return {
          ...prev,
          elapsedMs: prev.elapsedMs + 100,
        };
      });
    }, 100);

    // Auto-advance after step duration
    stepTimerRef.current = setTimeout(() => {
      setState(prev => {
        if (prev.isPaused) return prev; // Don't auto-advance if paused
        return prev;
      });
      // We check real-time pause state via ref
      advanceToStep(stepIndex + 1, mode);
    }, step.durationMs);
  }, [router, clearTimers]);

  const startDemo = useCallback((mode: DemoMode) => {
    setState({
      ...INITIAL_STATE,
      status: 'running',
      mode,
      showModal: false,
    });
    advanceToStep(0, mode);
  }, [advanceToStep]);

  const pauseDemo = useCallback(() => {
    clearTimers();
    setState(prev => ({ ...prev, isPaused: true, status: 'paused' }));
  }, [clearTimers]);

  const resumeDemo = useCallback(() => {
    const stepIndex = currentStepIndexRef.current;
    const step = DEMO_TIMELINE[stepIndex];
    const remaining = step.durationMs - stepElapsedRef.current;

    stepStartTimeRef.current = Date.now() - stepElapsedRef.current;

    setState(prev => ({ ...prev, isPaused: false, status: 'running' }));

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - stepStartTimeRef.current;
      stepElapsedRef.current = elapsed;
      setState(prev => ({
        ...prev,
        elapsedMs: prev.elapsedMs + 100,
      }));
    }, 100);

    stepTimerRef.current = setTimeout(() => {
      advanceToStep(stepIndex + 1, state.mode);
    }, Math.max(0, remaining));
  }, [advanceToStep, state.mode]);

  const nextStep = useCallback(() => {
    clearTimers();
    const nextIndex = currentStepIndexRef.current + 1;
    if (nextIndex < DEMO_TIMELINE.length) {
      advanceToStep(nextIndex, state.mode);
    } else {
      setState(prev => ({ ...prev, status: 'completed' }));
    }
  }, [clearTimers, advanceToStep, state.mode]);

  const prevStep = useCallback(() => {
    clearTimers();
    const prevIndex = Math.max(0, currentStepIndexRef.current - 1);
    advanceToStep(prevIndex, state.mode);
  }, [clearTimers, advanceToStep, state.mode]);

  const exitDemo = useCallback(() => {
    clearTimers();
    setState(INITIAL_STATE);
    router.push('/overview');
  }, [clearTimers, router]);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const openModal = useCallback(() => {
    setState(prev => ({ ...prev, showModal: true }));
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({ ...prev, showModal: false }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const currentStep = state.status !== 'idle'
    ? DEMO_TIMELINE[state.currentStepIndex]
    : null;

  const progressPercent = (state.elapsedMs / state.totalDurationMs) * 100;

  const stepElapsed = stepElapsedRef.current;
  const stepDuration = currentStep?.durationMs ?? 1;
  const stepProgressPercent = Math.min(100, (stepElapsed / stepDuration) * 100);

  return (
    <DemoContext.Provider value={{
      state,
      startDemo,
      pauseDemo,
      resumeDemo,
      nextStep,
      prevStep,
      exitDemo,
      toggleMute,
      openModal,
      closeModal,
      currentStep,
      progressPercent,
      stepProgressPercent,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider');
  return ctx;
}
