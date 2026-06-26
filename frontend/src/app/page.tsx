"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  useEffect(() => {
    // Simple parallax on scroll for hero
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
    <div className="bg-background text-on-background min-h-screen font-body-md selection:bg-primary/20">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-surface/80 dark:bg-surface-container-highest/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-8">
          <span className="font-display-sm text-display-sm font-bold tracking-tight text-primary dark:text-primary-fixed-dim">BHAVORA</span>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/overview" className="text-primary font-bold border-b-2 border-primary py-2 font-label-md text-label-md">Dashboard</Link>
            <Link href="#" className="text-on-surface-variant font-medium hover:bg-surface-container-high/50 transition-all duration-150 ease-in-out px-3 py-2 rounded-lg font-label-md text-label-md">Platform</Link>
            <Link href="#" className="text-on-surface-variant font-medium hover:bg-surface-container-high/50 transition-all duration-150 ease-in-out px-3 py-2 rounded-lg font-label-md text-label-md">Cities</Link>
            <Link href="#" className="text-on-surface-variant font-medium hover:bg-surface-container-high/50 transition-all duration-150 ease-in-out px-3 py-2 rounded-lg font-label-md text-label-md">Impact</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30 group focus-within:border-primary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-sm font-body-sm w-40 outline-none" placeholder="Search parameters..." type="text" />
          </div>
          <button className="p-2 rounded-full hover:bg-surface-container-high/50 transition-all active:scale-95">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-high/50 transition-all active:scale-95">
            <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
          </button>
        </div>
      </header>

      <main className="relative pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex flex-col items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
            {/* Left: Typography */}
            <div className="lg:col-span-6 space-y-lg">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-md text-label-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Bengaluru Twin Now Live
              </div>
              <h1 className="font-display-lg text-display-lg text-on-background max-w-xl">
                The AI Decision <span className="text-primary italic">Twin</span> For Cities
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
                Simulate the future impact of infrastructure and policy decisions before investing public resources. Leverage hyper-accurate data models for resilient urban planning.
              </p>
              <div className="flex flex-col sm:flex-row gap-md pt-md">
                <Link href="/auth">
                  <button className="px-xl py-md bg-primary text-on-primary rounded-xl font-headline-sm text-headline-sm shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
                    Explore Bengaluru Twin
                  </button>
                </Link>
                <button className="px-xl py-md bg-surface-container-highest/50 backdrop-blur-md border border-outline-variant text-on-surface rounded-xl font-headline-sm text-headline-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Simulation
                </button>
              </div>
              <div className="flex gap-xl pt-xl border-t border-outline-variant/30 mt-xl">
                <div>
                  <div className="font-display-sm text-display-sm text-on-surface">1.2M+</div>
                  <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Data Nodes</div>
                </div>
                <div>
                  <div className="font-display-sm text-display-sm text-on-surface">99.8%</div>
                  <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Sim Accuracy</div>
                </div>
              </div>
            </div>

            {/* Right: Visual Identity */}
            <div id="hero-visual" className="lg:col-span-6 relative h-[600px] flex items-center justify-center transition-transform duration-75">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/50">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB82AMsV0y5iFxw8vhyEgiPxfo_p3S-3C1uTDlelygUfB_33WAngO32N1gSxgHugfa883yqHkEBvyi8wrZo7DkUg4WSeOmwp8YQQ9dDujWWrehDElVUwAIv2OtIIyBfdqAeXn7tKswc9EMzlDKPrhIfD49k7Hr0H7KXqsk0icerXiGwiv7a_cM4rsTWFUNhydKFR4o8rRKsDwYXOLCAgv3otIZs3XHeqp1tC8r3WScYA3MhcZ5MOJO4opeJMSzW-cKzp69gM6oFZI8" alt="Bengaluru Skyline"/>
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
                
                <div className="absolute top-12 left-8 glass-card p-4 rounded-xl w-64 animate-float">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">Traffic Density</span>
                    <span className="material-symbols-outlined text-secondary text-[20px]">traffic</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="w-2 h-8 bg-primary/20 rounded-t-sm"></div>
                    <div className="w-2 h-12 bg-primary/40 rounded-t-sm"></div>
                    <div className="w-2 h-16 bg-primary rounded-t-sm"></div>
                    <div className="w-2 h-10 bg-primary/60 rounded-t-sm"></div>
                    <div className="w-2 h-14 bg-primary/80 rounded-t-sm"></div>
                  </div>
                  <div className="mt-2 text-primary font-mono-label text-mono-label">+12% Congestion Delta</div>
                </div>

                <div className="absolute bottom-20 right-8 glass-card p-4 rounded-xl w-56 animate-float-delayed">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">Energy Load</span>
                    <span className="material-symbols-outlined text-tertiary text-[20px]">bolt</span>
                  </div>
                  <div className="text-headline-lg text-on-surface font-bold">4.2 GW</div>
                  <div className="w-full bg-outline-variant/30 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-tertiary h-full w-2/3"></div>
                  </div>
                  <div className="mt-2 text-on-surface-variant font-label-md text-label-md">Peak Projection: 14:00</div>
                </div>
                <div className="absolute top-1/2 left-1/3">
                  <div className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-secondary/20 border border-secondary flex items-center justify-center">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-3xl max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-2xl space-y-md">
            <h2 className="font-display-sm text-display-sm text-on-background">Engineered for Urban Complexity</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Move from reactive planning to proactive governance with a multi-layered simulation environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg h-[800px]">
            <div className="md:col-span-8 bg-surface-container-low rounded-3xl p-xl border border-outline-variant/20 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="font-headline-lg text-headline-lg mb-md">Scenario Builder</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Toggle parameters for population growth, climate events, and infrastructure changes to see real-time ripple effects across the city.
                </p>
              </div>
              <div className="relative h-64 mt-lg rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5RNdRyaCFgPt2CzuxYWaYs7dp7gpNsKExThNlrrYPiuq2RP9b1oWFMle-ngH5tAo3VSQsqRkpDjdqE_COcW-rAJbUU2R-ZQv0TMuTNg3ZGAe4tzPMZ2EmgnR6ZVTxvRyHW94YlVMUr7kem49nUNDnoxpgaOT-dhAL3w1ft0ek3NGhjJya7kVwGZIpzi3MvjmBTbSMdffA0Ac4AjIexkcKvF7U9JdUDsOXFuDtFic_1BpFnTOJ5EDmtDIVpiSneRi0TlQvhel1gVw" alt="UI Mockup"/>
              </div>
            </div>
            
            <div className="md:col-span-4 bg-primary text-on-primary rounded-3xl p-xl flex flex-col justify-end relative overflow-hidden group">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-[48px] mb-lg" style={{fontVariationSettings: "'FILL' 1"}}>vital_signs</span>
                <h3 className="font-headline-lg text-headline-lg mb-md">Vitality Index</h3>
                <p className="font-body-sm text-body-sm opacity-80">
                  Predict socio-economic outcomes with our proprietary AI-driven Vitality Index.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bg-surface-container-highest/30 backdrop-blur-md border border-outline-variant/30 rounded-3xl p-xl flex flex-col">
              <h3 className="font-headline-sm text-headline-sm mb-md">Live Telemetry</h3>
              <div className="space-y-md flex-grow">
                <div className="flex items-center justify-between p-md bg-white/50 rounded-xl">
                  <span className="font-label-md text-label-md uppercase">Air Quality</span>
                  <span className="text-tertiary font-bold">Good (42 AQI)</span>
                </div>
                <div className="flex items-center justify-between p-md bg-white/50 rounded-xl">
                  <span className="font-label-md text-label-md uppercase">Water Pressure</span>
                  <span className="text-on-surface-variant font-bold">Stable</span>
                </div>
                <div className="flex items-center justify-between p-md bg-white/50 rounded-xl">
                  <span className="font-label-md text-label-md uppercase">Waste Efficiency</span>
                  <span className="text-primary font-bold">89%</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 bg-surface-container rounded-3xl p-xl border border-outline-variant/20 flex items-center justify-between relative overflow-hidden">
              <div className="max-w-xs relative z-10">
                <h3 className="font-headline-lg text-headline-lg mb-md">Departmental Bridge</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Break silos. Allow departments to collaborate on a single source of truth for unified urban strategy.
                </p>
              </div>
              <div className="relative flex -space-x-4">
                <div className="w-16 h-16 rounded-full border-4 border-surface bg-primary-fixed flex items-center justify-center font-bold">TC</div>
                <div className="w-16 h-16 rounded-full border-4 border-surface bg-secondary-fixed flex items-center justify-center font-bold">PW</div>
                <div className="w-16 h-16 rounded-full border-4 border-surface bg-tertiary-fixed flex items-center justify-center font-bold">ENV</div>
                <div className="w-16 h-16 rounded-full border-4 border-surface bg-surface-dim flex items-center justify-center">
                  <span className="material-symbols-outlined">add</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-3xl bg-background relative overflow-hidden border-t border-outline-variant/20">
          <div className="max-w-[1440px] mx-auto px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-xl">
              <h2 className="font-display-lg text-display-lg">The Future of Bengaluru is Digital.</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Join 24 institutional partners already using BHAVORA to de-risk over $14B in planned infrastructure investments.
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center">
                <Link href="/auth">
                  <button className="px-3xl py-lg bg-primary text-on-primary rounded-full font-headline-sm text-headline-sm hover:scale-105 transition-transform active:scale-95 shadow-xl">
                    Request Demo Access
                  </button>
                </Link>
                <button className="px-3xl py-lg bg-white border border-outline-variant text-on-surface rounded-full font-headline-sm text-headline-sm hover:bg-surface-container transition-colors">
                  View Case Studies
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-xl border-t border-outline-variant/10 bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-lg">
          <div className="flex items-center gap-4">
            <span className="font-display-sm text-display-sm font-bold text-primary">BHAVORA</span>
            <span className="text-on-surface-variant/40">|</span>
            <span className="text-on-surface-variant font-label-md text-label-md">© 2024 Urban Decision Systems.</span>
          </div>
          <div className="flex gap-xl">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md uppercase tracking-wider" href="#">Privacy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md uppercase tracking-wider" href="#">Security</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md uppercase tracking-wider" href="#">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
