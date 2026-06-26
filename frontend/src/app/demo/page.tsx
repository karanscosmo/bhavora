"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const SIMULATION_STEPS = [
  { label: "Analyzing Population Growth...", icon: "groups", duration: 1500 },
  { label: "Forecasting EV Adoption...", icon: "electric_car", duration: 1500 },
  { label: "Modeling Infrastructure Load...", icon: "domain", duration: 1500 },
  { label: "Calculating Energy Demand...", icon: "bolt", duration: 1500 },
  { label: "Generating AI Recommendations...", icon: "psychology", duration: 2000 },
];

const DEMO_RESULTS = {
  metrics: [
    { label: "Energy Demand", value: "+24%", icon: "bolt", color: "text-amber-600", bg: "bg-amber-50", trend: "up" },
    { label: "Carbon Emissions", value: "-18%", icon: "co2", color: "text-emerald-600", bg: "bg-emerald-50", trend: "down" },
    { label: "Traffic Congestion", value: "-12%", icon: "traffic", color: "text-emerald-600", bg: "bg-emerald-50", trend: "down" },
    { label: "Employment Growth", value: "+14%", icon: "work", color: "text-blue-600", bg: "bg-blue-50", trend: "up" },
    { label: "Charging Stations Required", value: "+2,200", icon: "ev_station", color: "text-violet-600", bg: "bg-violet-50", trend: "up" },
    { label: "Grid Upgrade Requirement", value: "Medium", icon: "electric_meter", color: "text-orange-600", bg: "bg-orange-50", trend: "neutral" },
  ],
  recommendations: [
    { title: "Whitefield Charging Capacity", text: "Whitefield will require 18% additional charging capacity by 2030 to support projected EV density.", severity: "high", icon: "ev_station" },
    { title: "North Bengaluru Substations", text: "North Bengaluru should add 11 new power substations before 2032 to prevent grid overload during peak demand.", severity: "critical", icon: "bolt" },
    { title: "Metro Phase 3 Acceleration", text: "Metro expansion could offset 9% congestion increase. Accelerating Phase 3 is strongly recommended.", severity: "medium", icon: "subway" },
    { title: "Eastern Water Stress", text: "Eastern Bengaluru may face moderate water stress by 2033. Recommend accelerating Cauvery Stage V.", severity: "medium", icon: "water_drop" },
  ],
  timeline: [
    { year: 2025, energy: 4.2, evPenetration: 8, population: 13.2, congestion: 78 },
    { year: 2027, energy: 4.8, evPenetration: 22, population: 13.8, congestion: 72 },
    { year: 2030, energy: 5.6, evPenetration: 48, population: 14.6, congestion: 68 },
    { year: 2035, energy: 6.8, evPenetration: 80, population: 15.8, congestion: 66 },
  ],
};

type Phase = 'landing' | 'simulating' | 'results';

export default function DemoPage() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [timelineIndex, setTimelineIndex] = useState(3);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const runSimulation = useCallback(() => {
    setPhase('simulating');
    setCurrentStep(0);
    setCompletedSteps([]);
  }, []);

  useEffect(() => {
    if (phase !== 'simulating') return;
    if (currentStep >= SIMULATION_STEPS.length) {
      setTimeout(() => {
        setPhase('results');
        setTimeout(() => setShowRecommendations(true), 800);
      }, 500);
      return;
    }
    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }, SIMULATION_STEPS[currentStep].duration);
    return () => clearTimeout(timer);
  }, [phase, currentStep]);

  const currentTimeline = DEMO_RESULTS.timeline[timelineIndex];

  // ======================== LANDING ========================
  if (phase === 'landing') {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col">
        {/* Nav */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">B</div>
            <span className="text-xl font-bold tracking-tight">BHAVORA</span>
            <span className="text-white/40 text-xs ml-2">v3.0</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">circle</span>
            <span>AI Engine Online</span>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Bengaluru Digital Twin • Live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Simulate Tomorrow.<br />
              <span className="text-blue-400">Decide Today.</span>
            </h1>

            <p className="text-lg text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
              What happens if Karnataka reaches 80% EV adoption by 2035?
              Run the simulation and find out.
            </p>

            <button
              onClick={runSimulation}
              className="group relative px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xl font-bold shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all hover:scale-[1.03] active:scale-95"
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">play_arrow</span>
                Run Bengaluru 2035 Demo
              </span>
            </button>

            <p className="text-white/30 text-sm mt-6">No login required • 90 second demo</p>
          </div>

          {/* Stats bar */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-16 text-center">
            <div>
              <div className="text-2xl font-bold text-white">1.2M+</div>
              <div className="text-xs text-white/40 uppercase tracking-widest">Data Nodes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-xs text-white/40 uppercase tracking-widest">Districts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.8%</div>
              <div className="text-xs text-white/40 uppercase tracking-widest">Sim Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">LIVE</div>
              <div className="text-xs text-white/40 uppercase tracking-widest">Engine Status</div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-white/10 flex justify-between text-xs text-white/30">
          <span>© 2025 Bugs2Bucks • Bhavora V3</span>
          <span>Built for SIH 2025</span>
        </footer>
      </div>
    );
  }

  // ======================== SIMULATING ========================
  if (phase === 'simulating') {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-6">
              <span className="material-symbols-outlined text-blue-400 text-3xl animate-pulse">neurology</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Running Neural Simulation</h2>
            <p className="text-white/50 text-sm">Karnataka EV Adoption 2035 • 80% Target</p>
          </div>

          <div className="space-y-4">
            {SIMULATION_STEPS.map((step, i) => {
              const isActive = i === currentStep;
              const isCompleted = completedSteps.includes(i);
              const isPending = i > currentStep;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                    isCompleted ? 'bg-emerald-500/10 border-emerald-500/30' :
                    isActive ? 'bg-blue-600/10 border-blue-500/30 scale-[1.02]' :
                    'bg-white/5 border-white/10 opacity-40'
                  }`}
                  style={isActive ? { animation: 'fade-slide-in 0.4s ease-out' } : {}}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-500/20' : isActive ? 'bg-blue-600/20' : 'bg-white/5'
                  }`}>
                    <span className={`material-symbols-outlined ${
                      isCompleted ? 'text-emerald-400' : isActive ? 'text-blue-400 animate-pulse' : 'text-white/30'
                    }`}>
                      {isCompleted ? 'check_circle' : step.icon}
                    </span>
                  </div>
                  <span className={`flex-1 font-medium ${isPending ? 'text-white/30' : 'text-white'}`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  )}
                  {isCompleted && (
                    <span className="text-emerald-400 text-sm font-mono">Done</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Progress</span>
              <span>{Math.round((completedSteps.length / SIMULATION_STEPS.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / SIMULATION_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ======================== RESULTS ========================
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 h-14 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">B</div>
          <span className="font-bold text-gray-900">BHAVORA</span>
          <span className="text-gray-400 text-xs">/ Simulation Results</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Simulation Complete
          </span>
          <button onClick={() => { setPhase('landing'); setShowRecommendations(false); }} className="text-sm text-blue-600 hover:underline font-medium">
            ← Run Again
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Karnataka EV 2035 — Simulation Results</h1>
          <p className="text-gray-500">What happens if Karnataka reaches 80% EV adoption by 2035?</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {DEMO_RESULTS.metrics.map((m, i) => (
            <div
              key={m.label}
              className={`${m.bg} rounded-2xl p-5 border border-transparent hover:border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1`}
              style={{ animation: `fade-slide-in 0.5s ease-out ${i * 100}ms both` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`material-symbols-outlined ${m.color} text-[20px]`}>{m.icon}</span>
              </div>
              <div className={`text-2xl font-bold ${m.color} mb-1`}>{m.value}</div>
              <div className="text-xs text-gray-500 font-medium">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline Slider */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Future Timeline</h3>
              <p className="text-sm text-gray-500">Drag the slider to see Bengaluru evolve</p>
            </div>
            <span className="text-3xl font-bold text-blue-600">{currentTimeline.year}</span>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <input
              type="range"
              min="0"
              max="3"
              value={timelineIndex}
              onChange={e => setTimelineIndex(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2 font-mono">
              {DEMO_RESULTS.timeline.map(t => (
                <span key={t.year} className={t.year === currentTimeline.year ? 'text-blue-600 font-bold' : ''}>{t.year}</span>
              ))}
            </div>
          </div>

          {/* Timeline Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Energy Load</div>
              <div className="text-2xl font-bold text-gray-900">{currentTimeline.energy} GW</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">EV Penetration</div>
              <div className="text-2xl font-bold text-blue-600">{currentTimeline.evPenetration}%</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Population</div>
              <div className="text-2xl font-bold text-gray-900">{currentTimeline.population}M</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Congestion Index</div>
              <div className="text-2xl font-bold text-emerald-600">{currentTimeline.congestion}</div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        {showRecommendations && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-blue-600">psychology</span>
              <h3 className="text-lg font-bold text-gray-900">AI Strategic Recommendations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEMO_RESULTS.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{ animation: `fade-slide-in 0.5s ease-out ${i * 150}ms both` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      rec.severity === 'critical' ? 'bg-red-100' :
                      rec.severity === 'high' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      <span className={`material-symbols-outlined text-[20px] ${
                        rec.severity === 'critical' ? 'text-red-600' :
                        rec.severity === 'high' ? 'text-amber-600' : 'text-blue-600'
                      }`}>{rec.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{rec.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          rec.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          rec.severity === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>{rec.severity}</span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{rec.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* District Intelligence */}
        {showRecommendations && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8" style={{ animation: 'fade-slide-in 0.5s ease-out 0.6s both' }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-blue-600">location_city</span>
              <h3 className="text-lg font-bold text-gray-900">District Intelligence — Bengaluru</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Whitefield", pop: "2.5L", energy: 95, traffic: 85, growth: 12 },
                { name: "Electronic City", pop: "1.8L", energy: 85, traffic: 75, growth: 15 },
                { name: "Koramangala", pop: "1.5L", energy: 75, traffic: 92, growth: 5 },
                { name: "HSR Layout", pop: "1.4L", energy: 78, traffic: 80, growth: 8 },
                { name: "Hebbal", pop: "1.2L", energy: 60, traffic: 65, growth: 18 },
                { name: "Indiranagar", pop: "1.1L", energy: 70, traffic: 88, growth: 4 },
                { name: "Yelahanka", pop: "1.6L", energy: 55, traffic: 55, growth: 22 },
                { name: "Jayanagar", pop: "2.0L", energy: 65, traffic: 70, growth: 3 },
              ].map((d, i) => (
                <div key={d.name} className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all cursor-pointer group">
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-600 mb-2">{d.name}</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-gray-400">Population</span><span className="font-mono font-bold">{d.pop}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Energy</span><span className="font-mono font-bold">{d.energy}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Traffic</span><span className="font-mono font-bold">{d.traffic}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Growth</span><span className="font-mono font-bold text-emerald-600">+{d.growth}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-8">
          <Link href="/scenario-builder">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-600/20">
              Build Your Own Scenario →
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
