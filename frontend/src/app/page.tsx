"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroVisual = document.getElementById('hero-visual');
      if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#f8f9ff] text-gray-900 min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">B</div>
            <span className="text-xl font-bold tracking-tight text-gray-900">BHAVORA</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/overview" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-2 rounded-lg text-sm font-medium">Dashboard</Link>
            <Link href="/demo" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-2 rounded-lg text-sm font-medium">Demo</Link>
            <Link href="/scenario-builder" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-2 rounded-lg text-sm font-medium">Simulate</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/demo">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition-all active:scale-95 shadow-sm">
              Run Demo
            </button>
          </Link>
        </div>
      </header>

      <main className="relative pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
          <div className="relative z-10 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Typography */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Bengaluru Twin Now Live
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                The AI Decision <span className="text-blue-600 italic">Twin</span> For Cities
              </h1>
              <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                Simulate the future impact of infrastructure and policy decisions before investing public resources. Leverage hyper-accurate data models for resilient urban planning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/demo">
                  <button className="group px-8 py-4 bg-blue-600 text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-0.5 transition-transform">play_arrow</span>
                    Run Bengaluru 2035 Demo
                  </button>
                </Link>
                <Link href="/overview">
                  <button className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    Explore Dashboard
                  </button>
                </Link>
              </div>
              <div className="flex gap-12 pt-8 border-t border-gray-200/60 mt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">1.2M+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Data Nodes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">99.8%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Sim Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">LIVE</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Engine Status</div>
                </div>
              </div>
            </div>

            {/* Right: Visual Identity */}
            <div id="hero-visual" className="lg:col-span-6 relative h-[540px] flex items-center justify-center transition-transform duration-75">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/50">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB82AMsV0y5iFxw8vhyEgiPxfo_p3S-3C1uTDlelygUfB_33WAngO32N1gSxgHugfa883yqHkEBvyi8wrZo7DkUg4WSeOmwp8YQQ9dDujWWrehDElVUwAIv2OtIIyBfdqAeXn7tKswc9EMzlDKPrhIfD49k7Hr0H7KXqsk0icerXiGwiv7a_cM4rsTWFUNhydKFR4o8rRKsDwYXOLCAgv3otIZs3XHeqp1tC8r3WScYA3MhcZ5MOJO4opeJMSzW-cKzp69gM6oFZI8" alt="Bengaluru Skyline"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9ff]/40 to-transparent"></div>
                
                <div className="absolute top-8 left-6 glass-card p-4 rounded-xl w-56 animate-float">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 uppercase font-medium">Traffic Density</span>
                    <span className="material-symbols-outlined text-blue-600 text-[18px]">traffic</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12">
                    <div className="w-2 flex-1 bg-blue-200 rounded-t-sm h-[40%]"></div>
                    <div className="w-2 flex-1 bg-blue-300 rounded-t-sm h-[55%]"></div>
                    <div className="w-2 flex-1 bg-blue-500 rounded-t-sm h-[80%]"></div>
                    <div className="w-2 flex-1 bg-blue-400 rounded-t-sm h-[60%]"></div>
                    <div className="w-2 flex-1 bg-blue-600 rounded-t-sm h-[90%]"></div>
                  </div>
                  <div className="mt-2 text-blue-600 text-xs font-mono font-bold">+12% Congestion Delta</div>
                </div>

                <div className="absolute bottom-16 right-6 glass-card p-4 rounded-xl w-48 animate-float-delayed">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase font-medium">Energy Load</span>
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">bolt</span>
                  </div>
                  <div className="text-2xl text-gray-900 font-bold">4.2 GW</div>
                  <div className="w-full bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-2/3 rounded-full"></div>
                  </div>
                  <div className="mt-2 text-gray-500 text-xs">Peak Projection: 14:00</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-20 max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Engineered for Urban Complexity</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Move from reactive planning to proactive governance with a multi-layered simulation environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-gray-200/50 flex flex-col justify-between overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">Scenario Builder</h3>
                <p className="text-gray-500 max-w-md">
                  Toggle parameters for population growth, climate events, and infrastructure changes to see real-time ripple effects across the city.
                </p>
              </div>
              <div className="relative h-48 mt-6 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5RNdRyaCFgPt2CzuxYWaYs7dp7gpNsKExThNlrrYPiuq2RP9b1oWFMle-ngH5tAo3VSQsqRkpDjdqE_COcW-rAJbUU2R-ZQv0TMuTNg3ZGAe4tzPMZ2EmgnR6ZVTxvRyHW94YlVMUr7kem49nUNDnoxpgaOT-dhAL3w1ft0ek3NGhjJya7kVwGZIpzi3MvjmBTbSMdffA0Ac4AjIexkcKvF7U9JdUDsOXFuDtFic_1BpFnTOJ5EDmtDIVpiSneRi0TlQvhel1gVw" alt="UI Mockup"/>
              </div>
            </div>
            
            <div className="md:col-span-4 bg-blue-600 text-white rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <span className="material-symbols-outlined text-5xl mb-6 opacity-80" style={{fontVariationSettings: "'FILL' 1"}}>vital_signs</span>
                <h3 className="text-2xl font-bold mb-3">Vitality Index</h3>
                <p className="text-blue-100/80 text-sm">
                  Predict socio-economic outcomes with our proprietary AI-driven Vitality Index.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bg-white rounded-3xl p-8 border border-gray-200/50 flex flex-col shadow-sm">
              <h3 className="text-xl font-bold mb-4">Live Telemetry</h3>
              <div className="space-y-3 flex-grow">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 uppercase font-medium">Air Quality</span>
                  <span className="text-emerald-600 font-bold text-sm">Good (42 AQI)</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 uppercase font-medium">Water Pressure</span>
                  <span className="text-gray-700 font-bold text-sm">Stable</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 uppercase font-medium">Waste Efficiency</span>
                  <span className="text-blue-600 font-bold text-sm">89%</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-gray-200/50 flex items-center justify-between relative overflow-hidden shadow-sm">
              <div className="max-w-xs relative z-10">
                <h3 className="text-2xl font-bold mb-3">Departmental Bridge</h3>
                <p className="text-gray-500">
                  Break silos. Allow departments to collaborate on a single source of truth for unified urban strategy.
                </p>
              </div>
              <div className="relative flex -space-x-4">
                <div className="w-14 h-14 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center font-bold text-sm text-blue-800">TC</div>
                <div className="w-14 h-14 rounded-full border-4 border-white bg-cyan-100 flex items-center justify-center font-bold text-sm text-cyan-800">PW</div>
                <div className="w-14 h-14 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center font-bold text-sm text-emerald-800">ENV</div>
                <div className="w-14 h-14 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-500 text-lg">add</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="max-w-[1440px] mx-auto px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white">The Future of Bengaluru is Digital.</h2>
              <p className="text-lg text-gray-400">
                Join 24 institutional partners already using BHAVORA to de-risk over $14B in planned infrastructure investments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-lg font-bold hover:scale-[1.03] transition-transform active:scale-95 shadow-xl shadow-blue-600/30">
                    Run Live Demo
                  </button>
                </Link>
                <Link href="/scenario-builder">
                  <button className="px-10 py-4 bg-white/10 border border-white/20 text-white rounded-2xl text-lg font-medium hover:bg-white/20 transition-colors">
                    Build Scenario
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200/50 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-blue-600">BHAVORA</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400 text-sm">© 2025 Bugs2Bucks. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <a className="text-gray-400 hover:text-blue-600 transition-colors text-sm" href="#">Privacy</a>
            <a className="text-gray-400 hover:text-blue-600 transition-colors text-sm" href="#">Security</a>
            <a className="text-gray-400 hover:text-blue-600 transition-colors text-sm" href="#">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
