"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/store/useSimulationStore';
import { motion } from 'framer-motion';
import { PlayCircle, Rocket } from 'lucide-react';


const DEMO_STEPS = [
  { id: 1, name: "Initialize City Twin", duration: 5000, description: "Loading Bengaluru 3D map and baseline metrics..." },
  { id: 2, name: "Apply EV Town Archetype", duration: 5000, description: "Setting EV adoption to 75% and renewable growth to 60%..." },
  { id: 3, name: "Run Neural Simulation", duration: 8000, description: "Processing 240+ urban variables against historical data..." },
  { id: 4, name: "Generate AI Insights", duration: 6000, description: "Scanning output for policy recommendations and bottlenecks..." },
  { id: 5, name: "Update Spatial Heatmaps", duration: 8000, description: "Rendering new traffic and emissions layers on GIS twin..." },
  { id: 6, name: "Finalize Executive Report", duration: 8000, description: "Compiling strategy brief PDF..." }
];

export default function DemoPage() {
  const router = useRouter();
  const store = useSimulationStore();
  
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isDemoRunning) return;

    let progressInterval: NodeJS.Timeout;
    
    const runStep = async (stepIndex: number) => {
      if (stepIndex >= DEMO_STEPS.length) {
        setIsDemoRunning(false);
        // Demo complete, navigate to results
        router.push('/simulation-results');
        return;
      }

      setCurrentStep(stepIndex);
      setProgress(0);
      
      const step = DEMO_STEPS[stepIndex];
      const intervalMs = 50;
      const totalTicks = step.duration / intervalMs;
      let tick = 0;

      // Execute specific actions at the start of certain steps
      if (stepIndex === 1) {
        store.setInputs({
          evAdoption: 75,
          renewableGrowth: 60,
          popGrowth: 15,
          metroExpansion: 4,
          indExpansion: 12
        });
      } else if (stepIndex === 2) {
        await store.runSimulation();
      }

      progressInterval = setInterval(() => {
        tick++;
        setProgress(Math.min(100, (tick / totalTicks) * 100));
        
        if (tick >= totalTicks) {
          clearInterval(progressInterval);
          runStep(stepIndex + 1);
        }
      }, intervalMs);
    };

    runStep(0);

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isDemoRunning, router, store]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden text-white animate-fade-in select-none">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="z-10 flex flex-col items-center max-w-2xl w-full">
        
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <PlayCircle />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Bhavora Live Demo</h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
            Experience the full end-to-end urban intelligence workflow. This automated sequence will load the city twin, apply an archetype, run the simulation engine, and generate actionable insights in under 45 seconds.
          </p>
        </div>

        {!isDemoRunning && currentStep === 0 ? (
          <button 
            onClick={() => setIsDemoRunning(true)}
            className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(var(--color-primary),0.4)] flex items-center gap-3 cursor-pointer"
          >
            <Rocket />
            RUN FULL CITY DEMO
          </button>
        ) : (
          <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
            
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-primary font-mono text-sm uppercase tracking-widest mb-1">Executing Step {currentStep + 1} of {DEMO_STEPS.length}</p>
                <h2 className="text-2xl font-bold text-white">{DEMO_STEPS[currentStep]?.name || 'Finalizing...'}</h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-light text-white/80">{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Main Progress Bar */}
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-8">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Terminal output simulation */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs text-white/70 h-32 overflow-y-auto">
              {DEMO_STEPS.slice(0, currentStep + 1).map((step, idx) => (
                <div key={idx} className={`flex items-start gap-2 mb-2 ${idx === currentStep ? 'text-primary animate-pulse' : 'text-white/40'}`}>
                  <span className="shrink-0">[sys-{step.id}]</span>
                  <span>{step.description}</span>
                  {idx < currentStep && <span className="ml-auto text-emerald-400">DONE</span>}
                </div>
              ))}
            </div>

          </div>
        )}

        <button 
          onClick={() => router.push('/overview')}
          className="mt-12 text-white/40 hover:text-white transition-colors text-sm underline underline-offset-4 cursor-pointer"
        >
          Cancel and return to Dashboard
        </button>
      </div>
    </div>
  );
}
