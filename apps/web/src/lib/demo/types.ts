/**
 * BHAVORA EXECUTIVE DEMO ENGINE — TYPE SYSTEM
 */

export type DemoMode = 'executive' | 'government' | 'investor' | 'technical';

export type DemoStatus = 'idle' | 'starting' | 'running' | 'paused' | 'completed' | 'exiting';

export interface DemoStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  route: string;
  durationMs: number;
  narration: string;
  narrationDetail?: string;
  actions?: DemoAction[];
  spotlight?: SpotlightTarget;
  highlightSelectors?: string[];
}

export interface DemoAction {
  type: 'navigate' | 'click' | 'highlight' | 'animate' | 'type' | 'wait' | 'scroll';
  target?: string;
  value?: string;
  delayMs?: number;
}

export interface SpotlightTarget {
  selector?: string;
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface DemoState {
  status: DemoStatus;
  mode: DemoMode;
  currentStepIndex: number;
  totalSteps: number;
  elapsedMs: number;
  totalDurationMs: number;
  isPaused: boolean;
  isMuted: boolean;
  showModal: boolean;
}

export const DEMO_MODES: { id: DemoMode; label: string; icon: string; description: string }[] = [
  { id: 'executive', label: 'Executive Review', icon: '🏛️', description: 'High-level platform overview for C-suite & decision makers' },
  { id: 'government', label: 'Government Demo', icon: '🏙️', description: 'Municipal use cases, emergency response & policy tools' },
  { id: 'investor', label: 'Investor Demo', icon: '📈', description: 'Market opportunity, platform scale & ROI metrics' },
  { id: 'technical', label: 'Technical Demo', icon: '⚙️', description: 'Data pipelines, AI architecture & simulation engine' },
];
