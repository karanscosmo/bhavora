"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

/* ────────────────── Floating Particles Component ────────────────── */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-600/10"
          style={{
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particle-drift ${8 + Math.random() * 12}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────── Animated Counter ────────────────── */
function AnimatedNumber({ target, suffix = '', prefix = '' }: { target: string; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(prefix + '0' + suffix);

  useEffect(() => {
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) { setDisplay(prefix + target + suffix); return; }
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (num * eased).toFixed(target.includes('.') ? 1 : 0);
      setDisplay(prefix + current + (target.includes('+') && progress === 1 ? '+' : '') + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, suffix, prefix]);

  return <span>{display}</span>;
}

/* ────────────────── Floating Data Card ────────────────── */
function DataCard({ label, value, icon, color, delay, className = '' }: {
  label: string; value: string; icon: string; color: string; delay: string; className?: string;
}) {
  return (
    <div className={`bg-white/85 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 w-52 opacity-0 animate-scale-in ${delay} ${className}`}
         style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
        <span className={`material-symbols-outlined text-[18px] ${color}`}>{icon}</span>
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="w-full h-1 bg-gray-200/60 rounded-full mt-2 overflow-hidden">
        <div 
          className="h-full rounded-full bg-primary"
          style={{ width: '0%', animation: 'fade-in 0.3s ease-out forwards', animationDelay: '1.5s' }}
          ref={(el) => { 
            if (el) {
              setTimeout(() => { 
                el.style.width = `${40 + Math.random() * 50}%`; 
                el.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1)'; 
              }, 1600); 
            }
          }}
        />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'twin' | 'twin-module' | 'impact'>('twin');

  useEffect(() => {
    setLoaded(true);
    const handleScroll = () => {
      const s = window.pageYOffset;
      const v = document.getElementById('hero-visual');
      if (v) v.style.transform = `translateY(${s * 0.06}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#f7f8ff] text-gray-900 min-h-screen overflow-x-hidden selection:bg-primary/10">
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/30 h-16 shadow-sm">
        <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-600/25 group-hover:shadow-blue-600/40 transition-shadow">B</div>
              <span className="text-[19px] font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">BHAVORA</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/overview" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Dashboard</Link>
              <Link href="/platform" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Platform</Link>
              <Link href="/cities" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Cities Twin</Link>
              <Link href="/decision-twin" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Decision Twin</Link>
              <Link href="/impact" className="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/80 px-4 py-2 rounded-xl transition-all font-semibold">Impact</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-[12px] text-emerald-600 bg-emerald-50 border border-emerald-500/20 px-3 py-1.5 rounded-full font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 text-emerald-500"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Engine Online
            </div>
            <Link href="/demo">
              <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-[13px] font-bold hover:from-blue-500 hover:to-blue-600 transition-all active:scale-95 shadow-md shadow-blue-600/20 cursor-pointer">
                Run Bengaluru 2035
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative pt-16">
        
        {/* Hero Section */}
        <section className="relative min-h-[95vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(247,248,255,0.8)_100%)] z-0" />
          <Particles />

          {/* SVG Grid Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" viewBox="0 0 1440 900">
            <path d="M200,450 Q400,300 700,420 T1200,380" fill="none" stroke="#004ac6" strokeWidth="1.5" strokeDasharray="8 6" />
            <path d="M100,600 Q500,500 900,550 T1400,480" fill="none" stroke="#00687a" strokeWidth="1" strokeDasharray="6 8" />
            <circle cx="700" cy="420" r="4" fill="#004ac6" className="animate-pulse" />
            <circle cx="450" cy="360" r="3" fill="#00687a" className="animate-pulse" />
          </svg>

          <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Typo */}
            <div className="lg:col-span-5 space-y-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[12px] text-blue-700 font-bold opacity-0 ${loaded ? 'animate-fade-up' : ''}`}
                   style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Bengaluru Decision Twin • Live Node
              </div>

              <h1 className={`text-[3rem] md:text-[3.5rem] leading-[1.08] font-extrabold tracking-tight text-gray-900 opacity-0 ${loaded ? 'animate-fade-up' : ''}`}
                  style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                The AI Decision{' '}
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent italic">Twin</span>{' '}
                For Cities
              </h1>

              <p className={`text-[16px] text-gray-500 leading-relaxed max-w-[460px] opacity-0 ${loaded ? 'animate-fade-up' : ''}`}
                 style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                Simulate infrastructure, climate, mobility, energy, and policy decisions before spending billions in the real world.
              </p>

              <div className={`flex flex-wrap gap-3 pt-1 opacity-0 ${loaded ? 'animate-fade-up' : ''}`}
                   style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
                <Link href="/demo">
                  <button className="group flex items-center gap-2.5 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl text-[14px] font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 hover:scale-[1.02] transition-all active:scale-[0.97] cursor-pointer">
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">play_arrow</span>
                    Run Bengaluru 2035 Demo
                  </button>
                </Link>
                <Link href="/cities">
                  <button className="flex items-center gap-2 px-6 py-4 bg-white border border-outline-variant/30 hover:bg-white/80 text-gray-700 rounded-2xl text-[14px] font-bold transition-all hover:scale-[1.02] active:scale-[0.97] shadow-sm cursor-pointer">
                    <span className="material-symbols-outlined text-blue-600 text-lg">location_city</span>
                    Explore City Twin
                  </button>
                </Link>
              </div>

              {/* Metrics strip */}
              <div className={`flex gap-10 pt-6 border-t border-gray-200/60 opacity-0 ${loaded ? 'animate-fade-up' : ''}`}
                   style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}>
                <div>
                  <div className="text-[26px] font-extrabold text-gray-900"><AnimatedNumber target="1.2" suffix="M+" /></div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mt-0.5">GIS Data Points</div>
                </div>
                <div>
                  <div className="text-[26px] font-extrabold text-gray-900"><AnimatedNumber target="99.8" suffix="%" /></div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mt-0.5">Accuracy Rating</div>
                </div>
                <div>
                  <div className="text-[26px] font-extrabold text-gray-900"><AnimatedNumber target="50" suffix="+" /></div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mt-0.5">Parameters</div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Layout */}
            <div id="hero-visual" className="lg:col-span-7 relative flex items-center justify-center" style={{ minHeight: '520px' }}>
              <div className={`relative w-full max-w-[550px] h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-white/50 opacity-0 ${loaded ? 'animate-scale-in' : ''}`}
                   style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB82AMsV0y5iFxw8vhyEgiPxfo_p3S-3C1uTDlelygUfB_33WAngO32N1gSxgHugfa883yqHkEBvyi8wrZo7DkUg4WSeOmwp8YQQ9dDujWWrehDElVUwAIv2OtIIyBfdqAeXn7tKswc9EMzlDKPrhIfD49k7Hr0H7KXqsk0icerXiGwiv7a_cM4rsTWFUNhydKFR4o8rRKsDwYXOLCAgv3otIZs3XHeqp1tC8r3WScYA3MhcZ5MOJO4opeJMSzW-cKzp69gM6oFZI8" alt="Bengaluru Digital Twin" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f7f8ff]/30 via-transparent to-transparent"></div>
                <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-xl rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/10">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span></span>
                  <span className="text-white/95 text-[11px] font-mono font-bold tracking-wider">BENGALURU • TWIN</span>
                </div>
              </div>

              {/* Floating indicators */}
              <div className="absolute -top-2 right-8 animate-float-slow">
                <DataCard label="Traffic Delta" value="-12%" icon="traffic" color="text-blue-600" delay="delay-700" />
              </div>
              <div className="absolute top-28 -left-8 animate-float-medium">
                <DataCard label="Energy Load" value="4.2 GW" icon="bolt" color="text-amber-600" delay="delay-1000" />
              </div>
              <div className="absolute bottom-28 -left-4 animate-float-fast">
                <DataCard label="Water Stress" value="Critical" icon="water_drop" color="text-cyan-600" delay="delay-1200" />
              </div>
              <div className="absolute bottom-8 right-4 animate-float-medium">
                <DataCard label="Carbon Delta" value="-18%" icon="co2" color="text-emerald-600" delay="delay-1500" />
              </div>
            </div>
          </div>
        </section>

        {/* Why Bhavora Section */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 border-t border-outline-variant/20 relative z-10 bg-white/50">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Why Choose Bhavora?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm">
              An institutional-grade architecture built to simplify multi-departmental city decision making.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">monetization_on</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">De-risk Municipal Expenditure</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Validate public utilities expansions, arterial metro paths, and grid integrations inside simulation zones before deploying capital in the physical world.
              </p>
            </div>
            <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">hub</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-Sector Co-dependencies</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ensure planning changes in EV charging stations directly calibrate energy demand, water supply shifts, and carbon footprints, keeping sectors synchronized.
              </p>
            </div>
            <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-primary text-4xl mb-4">psychology</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Proactive Governance</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Break municipal silos. AI-driven anomaly algorithms scan simulated timelines to notify developers of supply gaps and transit bottlenecks years in advance.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 border-t border-outline-variant/20 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm">
              Four streamlined steps to configure, simulate, and formulate policies with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Acquire Data feeds", text: "Aggregate BBMP, BESCOM, Census India datasets into localized spatial zones." },
              { step: "02", title: "Model Baseline Twins", text: "Plot digital infrastructure clones matching actual parameters and network nodes." },
              { step: "03", title: "Configure Scenarios", text: "Toggle development rates (EV, population, metro expansion) using customized slider panels." },
              { step: "04", title: "Formulate Policy", text: "Generate comparative variance graphs and compile strategic executive PDF briefs." }
            ].map(item => (
              <div key={item.step} className="bg-white/60 border border-outline-variant/20 rounded-3xl p-6 relative">
                <div className="text-4xl font-black text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Previews Module Tab Panel */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 border-t border-outline-variant/20 bg-white/40">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Explore the Platform Modules</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-2 text-sm">Explore interactive previews of our core functional screens.</p>
          </div>

          {/* Tabs header */}
          <div className="flex justify-center mb-8 bg-surface-container rounded-2xl p-1.5 max-w-md mx-auto border border-outline-variant/20">
            <button 
              onClick={() => setActivePreviewTab('twin')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activePreviewTab === 'twin' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Bengaluru Twin
            </button>
            <button 
              onClick={() => setActivePreviewTab('twin-module')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activePreviewTab === 'twin-module' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Decision Twin
            </button>
            <button 
              onClick={() => setActivePreviewTab('impact')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activePreviewTab === 'impact' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Impact analysis
            </button>
          </div>

          {/* Tab content area */}
          <div className="bg-white border border-outline-variant/30 rounded-3xl p-8 shadow-sm max-w-4xl mx-auto min-h-[350px] flex flex-col justify-between">
            {activePreviewTab === 'twin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Cities Twin</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Plot digital district boundaries across Bangalore. Select specific telemetry nodes to overlay real-time traffic indexes, grid stress parameters, and water levels.
                  </p>
                  <Link href="/cities">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-md cursor-pointer">
                      Launch Cities Twin Module
                    </button>
                  </Link>
                </div>
                <div className="rounded-2xl overflow-hidden border border-outline-variant/20 h-48 bg-[#cbdbf5] relative">
                  <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBWCLJjzLm5_6cIlTrbUeZPKB3j1yMbf6uipdGKwXlKMht67rfwpTVHYAKI6h2KSj0a2dwWoJrRD8_4r2IX1Kly5-9t7m-4EHhChkRwSjOT4pubCBKxGoqrYYpqYEdHxrYef_i7hl_bexnk6TmVzQmEKXICwaeOJM4w3pen0ytDIsH1TZAQdG0hX9zzA37AkWJmsqebSJDVyp_FunaoQsmdJnwis0K6hZXCAz2X0X75K-236MgvioH8bg2BnEEllz2FUNX-IsR9uDY')" }}></div>
                </div>
              </div>
            )}

            {activePreviewTab === 'twin-module' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Scenarios Configurator</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Slide values for EV adoption targets, infrastructure grid mixes, population shifts, and metro paths to run high-fidelity simulations.
                  </p>
                  <Link href="/decision-twin">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-md cursor-pointer">
                      Open Decision Twin
                    </button>
                  </Link>
                </div>
                <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/20 space-y-3">
                  <div className="h-2 bg-outline-variant/40 rounded w-1/3"></div>
                  <div className="h-1 bg-primary rounded w-full"></div>
                  <div className="h-2 bg-outline-variant/40 rounded w-1/2"></div>
                  <div className="h-1 bg-primary rounded w-full"></div>
                </div>
              </div>
            )}

            {activePreviewTab === 'impact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Impact Analysis Matrix</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Analyze Before vs After comparative metrics detailing grid loading stresses, jobs created, and carbon emissions deviations.
                  </p>
                  <Link href="/impact">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-md cursor-pointer">
                      Launch Impact Module
                    </button>
                  </Link>
                </div>
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/20 space-y-4">
                  <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-400">Baseline</span><span className="text-gray-400">Simulated</span></div>
                  <div className="h-6 bg-white border border-outline-variant/20 rounded-xl flex items-center justify-between px-3 text-[10px] font-bold"><span className="text-gray-900">Traffic Index</span><span className="text-emerald-600">-12% Delta</span></div>
                  <div className="h-6 bg-white border border-outline-variant/20 rounded-xl flex items-center justify-between px-3 text-[10px] font-bold"><span className="text-gray-900">Carbon Level</span><span className="text-emerald-600">-18% Drop</span></div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Call To Action */}
        <section className="py-24 bg-gradient-to-b from-gray-900 via-[#0a1628] to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 city-grid-bg opacity-[0.03]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]"></div>
          <div className="max-w-[1440px] mx-auto px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                The Future of Bengaluru<br/>is <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Digital.</span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xl mx-auto">
                Join institutional planners and city developers using Bhavora to model future urban strategies.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link href="/demo">
                  <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-sm font-bold hover:from-blue-400 hover:to-blue-500 transition-all hover:scale-[1.03] active:scale-95 shadow-2xl shadow-blue-600/20 flex items-center gap-2 cursor-pointer">
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-0.5 transition-transform">play_arrow</span>
                    Run Bengaluru 2035 Demo
                  </button>
                </Link>
                <Link href="/decision-twin">
                  <button className="px-8 py-4 border border-white/15 text-white/80 rounded-2xl text-sm font-medium hover:bg-white/5 hover:border-white/25 transition-all cursor-pointer">
                    Build Custom Scenario
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-blue-400 text-sm">BHAVORA</span>
            <span className="text-gray-700">|</span>
            <span className="text-gray-500 text-[12px]">© 2025 Bugs2Bucks. Built for SIH 2025.</span>
          </div>
          <div className="flex gap-8">
            <span className="text-gray-500 hover:text-blue-400 transition-colors text-[12px] cursor-pointer">Privacy</span>
            <span className="text-gray-500 hover:text-blue-400 transition-colors text-[12px] cursor-pointer">Security</span>
            <span className="text-gray-500 hover:text-blue-400 transition-colors text-[12px] cursor-pointer">System Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
