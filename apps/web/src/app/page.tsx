"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UrbanCanvas } from '@/components/ui/UrbanCanvas';
import { LogoLight, LogoDark } from '@/components/ui/Logo';
import { useCityDataStore } from '@/stores';
import {
  Brain, BarChart3, Shield, Map, Sliders, Lightbulb,
  ArrowRight, ChevronRight, Check, Activity, Database, Network, Cpu
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
} from 'recharts';

// ========= ANIMATED COUNTER =========
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setDisplay(value);
      prevRef.current = value;
    }
  }, [value]);

  return (
    <motion.span
      key={display}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="data-value font-bold"
      style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'inherit' }}
    >
      {display}{suffix}
    </motion.span>
  );
}

// ========= FADE UP ON SCROLL =========
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ========= RADAR CHART DATA =========
const RADAR_DATA = [
  { system: 'Traffic', current: 67, projected: 84 },
  { system: 'Emissions', current: 45, projected: 78 },
  { system: 'Energy', current: 73, projected: 86 },
  { system: 'Water', current: 58, projected: 76 },
  { system: 'Economy', current: 62, projected: 79 },
  { system: 'Transit', current: 71, projected: 88 },
];

export default function HomePage() {
  const demoRef = useRef<HTMLDivElement>(null);
  const { metrics, refreshMetrics } = useCityDataStore();
  const [form, setForm] = useState({ name: '', email: '', organization: '' });
  const [submitted, setSubmitted] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 6000);
    return () => clearInterval(interval);
  }, [refreshMetrics]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const metricItems = [
    { label: 'Congestion Index', value: metrics.congestionIndex, suffix: '%' },
    { label: 'AQI', value: metrics.aqi, suffix: '' },
    { label: 'Grid Load', value: Number(metrics.gridLoad.toFixed(1)), suffix: 'GW' },
    { label: 'City Health Score', value: metrics.cityHealthScore, suffix: '' },
    { label: 'Active Incidents', value: metrics.activeIncidents, suffix: '' },
    { label: 'Metro Punctuality', value: metrics.metroPunctuality, suffix: '%' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0e14] text-white selection:bg-[var(--accent-blue)] selection:text-white font-sans">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <UrbanCanvas />
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(0,102,255,0.08),transparent_60%)]" />

      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 transition-all duration-300 ${
          navScrolled ? 'bg-[#0a0e14]/90 backdrop-blur-md border-b border-[var(--slate-800)]' : 'bg-transparent'
        }`}
      >
        <LogoLight size={28} />
        <div className="flex items-center gap-4">
          <Link href="/platform" className="text-[10px] uppercase tracking-widest font-bold text-white bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] px-5 py-2.5 rounded-sm transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            Launch Platform
          </Link>
          <button onClick={scrollToDemo} className="text-[10px] uppercase tracking-widest font-bold text-[var(--slate-300)] border border-[var(--slate-700)] bg-transparent hover:bg-[var(--slate-800)] px-5 py-2.5 rounded-sm transition-all">
            Contact Sales
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6 pt-32 pb-16">
        <div className="relative max-w-6xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 border border-[var(--accent-teal)]/30 bg-[var(--accent-teal)]/10 text-[var(--accent-teal)] text-[9px] font-bold tracking-widest uppercase rounded-sm"
          >
            <div className="w-1.5 h-1.5 bg-[var(--accent-teal)] animate-pulse shadow-[0_0_8px_var(--accent-teal)]" />
            Bhavora OS v6.0 Core Online
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-bold leading-[1.05] mb-6 text-white tracking-tight font-serif"
            style={{ fontSize: 'clamp(54px, 7vw, 96px)' }}
          >
            Command Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)]">
              Urban Infrastructure
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 max-w-3xl mx-auto text-[var(--slate-400)] text-lg md:text-xl leading-relaxed"
          >
            The world's most advanced Cyber-Physical Intelligence system for city governments.
            Fuse geospatial telemetry, run multi-agent policy simulations, and preempt disasters before they strike.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-24"
          >
            <Link href="/platform" className="group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] px-8 py-4 rounded-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Initialize Platform
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button onClick={scrollToDemo} className="text-xs uppercase tracking-widest font-bold text-[var(--slate-300)] border border-[var(--slate-700)] bg-[var(--slate-900)]/50 hover:bg-[var(--slate-800)] px-8 py-4 rounded-sm transition-all">
              Request Classified Briefing
            </button>
          </motion.div>

          {/* LIVE METRICS PREVIEW ON HERO */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-6 gap-0 border border-[var(--slate-800)] bg-[#0f141e]/80 backdrop-blur-xl shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"
          >
            {metricItems.map((m, i) => (
              <div key={m.label} className="flex flex-col gap-1 items-center text-center p-6 border-b md:border-b-0 md:border-r border-[var(--slate-800)] last:border-0 hover:bg-[var(--slate-800)]/50 transition-colors">
                <span className="text-[9px] font-bold text-[var(--slate-500)] uppercase tracking-widest font-mono">{m.label}</span>
                <div className="text-[var(--slate-200)] text-2xl font-mono mt-2 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  <AnimatedCounter value={m.value} suffix={m.suffix} />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="relative z-10 py-32 px-8 bg-[#0a0e14] border-t border-[var(--slate-800)]">
        <div className="max-w-[1440px] mx-auto">
          <FadeUp className="mb-20 md:flex justify-between items-end">
            <div className="max-w-2xl">
              <span className="text-[var(--accent-blue)] text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[var(--accent-blue)]" /> Core OS Modules</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-serif">
                Full-Spectrum Intelligence
              </h2>
            </div>
            <p className="mt-6 md:mt-0 max-w-md text-[var(--slate-400)] text-sm leading-relaxed font-mono">
              // REPLACING FRAGMENTED DASHBOARDS WITH A UNIFIED DATA FABRIC FOR MAYORS AND STRATEGISTS.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Map, title: 'City Twin GIS', desc: 'Real-time 3D geospatial engine with sub-meter accuracy infrastructure mapping.', href: '/cities' },
              { icon: Sliders, title: 'Decision Twin', desc: 'Simulate policy impacts on traffic, energy, and AQI before committing capital.', href: '/decision-twin' },
              { icon: Shield, title: 'Disaster Intel', desc: 'Automated incident command system orchestrating multi-agency response workflows.', href: '/disaster' },
              { icon: Lightbulb, title: 'AI Insights', desc: 'Proactive explainable intelligence surfacing critical anomalies instantly.', href: '/insights' },
              { icon: BarChart3, title: 'Telemetry Analytics', desc: 'Boardroom-ready data visualizations with continuous live data streaming.', href: '/analytics' },
              { icon: Network, title: 'Scenario Vault', desc: 'Version-controlled urban planning missions with immutable audit logs.', href: '/scenarios' }
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
              <FadeUp key={cap.title} delay={i * 0.1}>
                <Link href={cap.href} className="group block h-full bg-[#0f141e] border border-[var(--slate-800)] p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] hover:border-[var(--accent-blue)]/50 transition-all duration-300">
                  <div className="w-10 h-10 border border-[var(--slate-700)] bg-[var(--slate-900)] text-[var(--accent-blue)] flex items-center justify-center mb-6 group-hover:bg-[var(--accent-blue)] group-hover:text-white transition-colors">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 font-serif">{cap.title}</h3>
                  <p className="text-[var(--slate-400)] text-sm leading-relaxed mb-8 font-mono">{cap.desc}</p>
                  <div className="flex items-center text-[var(--accent-blue)] text-[10px] uppercase font-bold tracking-widest">
                    INITIALIZE MODULE <ArrowRight size={12} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE SECTION */}
      <section className="relative z-10 py-32 px-8 bg-[#0a0e14] border-y border-[var(--slate-800)]">
        <div className="max-w-[1440px] mx-auto text-center">
          <FadeUp>
            <span className="text-[var(--accent-teal)] text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2"><span className="w-1.5 h-1.5 bg-[var(--accent-teal)]" /> OS ARCHITECTURE</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-serif">
              Data to Action
            </h2>
            <p className="max-w-2xl mx-auto text-[var(--slate-400)] text-sm mb-24 font-mono leading-relaxed">
              &gt; Bhavora ingests massive civic datasets, processes them through our proprietary simulation engine, and outputs explainable intelligence via an intuitive OS.
            </p>
          </FadeUp>

          <FadeUp delay={0.2} className="relative">
            {/* Visual Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto relative">
              {/* Lines connecting them */}
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-[var(--slate-800)] via-[var(--accent-blue)] to-[var(--accent-teal)] -translate-y-1/2 z-0" />
              
              {/* Stage 1 */}
              <div className="bg-[#0f141e] border border-[var(--slate-800)] p-10 relative z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                <Database size={32} className="text-[var(--slate-500)] mb-6 mx-auto" />
                <h3 className="font-bold text-[14px] mb-3 uppercase tracking-widest font-mono text-[var(--slate-300)]">1. INGEST</h3>
                <p className="text-[11px] text-[var(--slate-500)] font-mono leading-relaxed">Connects to IoT sensors, transit APIs, GIS servers, and legacy databases.</p>
              </div>

              {/* Stage 2 */}
              <div className="bg-[#0f141e] border border-[var(--accent-blue)]/50 p-10 relative z-10 shadow-[inset_0_0_40px_rgba(0,102,255,0.1)]">
                <Cpu size={32} className="text-[var(--accent-blue)] mb-6 mx-auto" />
                <h3 className="font-bold text-[14px] mb-3 uppercase tracking-widest font-mono text-white">2. COMPUTE</h3>
                <p className="text-[11px] text-[var(--slate-400)] font-mono leading-relaxed">Runs multi-agent physics and economic models to project cascading impacts.</p>
              </div>

              {/* Stage 3 */}
              <div className="bg-[#0f141e] border border-[var(--accent-teal)]/50 p-10 relative z-10 shadow-[inset_0_0_40px_rgba(13,148,136,0.1)]">
                <Activity size={32} className="text-[var(--accent-teal)] mb-6 mx-auto" />
                <h3 className="font-bold text-[14px] mb-3 uppercase tracking-widest font-mono text-white">3. ACTIVATE</h3>
                <p className="text-[11px] text-[var(--slate-400)] font-mono leading-relaxed">Surfaces explainable insights, automated reports, and tactical workflows.</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* WHY BHAVORA (Differentiation) */}
      <section className="relative z-10 py-32 px-8 bg-[#0a0e14] border-b border-[var(--slate-800)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 font-serif">
                Why governments choose Bhavora
              </h2>
              <ul className="space-y-8">
                {[
                  { title: 'Not a dashboard. An Operating System.', desc: 'Dashboards show you what happened. Bhavora shows you what will happen next, and what to do about it.' },
                  { title: 'Explainable AI', desc: 'Government requires accountability. Every AI insight provides citation chains back to the source municipal data.' },
                  { title: 'Cascading Impact Analysis', desc: 'Understanding that a change in zoning laws affects traffic, which affects emissions, which affects grid load.' },
                  { title: 'Enterprise Security', desc: 'On-prem deployment ready, SOC 2 Type II, and strict role-based access control.' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="mt-1 w-5 h-5 bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] border border-[var(--accent-blue)] flex items-center justify-center flex-shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white font-mono uppercase tracking-widest">{item.title}</h4>
                      <p className="text-[var(--slate-400)] mt-2 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </FadeUp>

            <FadeUp delay={0.2} className="relative">
              {/* Decision Twin Preview Mockup */}
              <div className="bg-[#0f141e] border border-[var(--slate-800)] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent-teal)]" />
                <h3 className="font-bold text-sm mb-6 uppercase tracking-widest font-mono text-[var(--slate-300)]">Decision Twin: Metro Phase 3</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-[var(--slate-900)] border border-[var(--slate-800)]">
                    <div className="text-[10px] font-bold text-[var(--slate-500)] uppercase mb-1 tracking-widest font-mono">Current State</div>
                    <div className="text-xl font-bold font-mono">142 AQI</div>
                  </div>
                  <div className="p-4 bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30">
                    <div className="text-[10px] font-bold text-[var(--accent-teal)] uppercase mb-1 tracking-widest font-mono">Projected State</div>
                    <div className="text-xl font-bold text-[var(--accent-teal)] font-mono">98 AQI</div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="75%">
                      <PolarGrid stroke="var(--slate-700)" />
                      <PolarAngleAxis dataKey="system" tick={{ fill: 'var(--slate-400)', fontSize: 10, fontFamily: 'monospace' }} />
                      <Radar name="Current" dataKey="current" stroke="var(--slate-600)" fill="var(--slate-800)" fillOpacity={0.8} strokeWidth={1} />
                      <Radar name="Projected" dataKey="projected" stroke="var(--accent-teal)" fill="var(--accent-teal)" fillOpacity={0.2} strokeWidth={1.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section ref={demoRef} className="relative z-10 py-32 px-8 bg-[#0a0e14] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 font-serif">
              Ready to command your infrastructure?
            </h2>
            <p className="text-[var(--slate-400)] text-sm mb-12 font-mono leading-relaxed">
              &gt; Contact our deployment engineering team for a technical deep-dive and customized demonstration of the Bhavora platform.
            </p>
          </FadeUp>

          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0f141e] border border-[var(--accent-teal)] p-10 text-center shadow-[inset_0_0_30px_rgba(13,148,136,0.1)]">
              <Check size={32} className="text-[var(--accent-teal)] mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2 font-mono uppercase tracking-widest text-[var(--accent-teal)]">Transmission Received</h3>
              <p className="text-[var(--slate-400)] text-sm">Deployment architects will establish contact shortly.</p>
            </motion.div>
          ) : (
            <FadeUp delay={0.2}>
              <form onSubmit={handleSubmit} className="bg-[#0f141e] border border-[var(--slate-800)] p-8 text-left space-y-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono">Full Name</label>
                    <input
                      type="text" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono">Gov/Corp Email</label>
                    <input
                      type="email" required
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono">Agency / Organization</label>
                  <input
                    type="text" required
                    value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                    className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono"
                  />
                </div>
                <button type="submit" className="w-full bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white text-[11px] uppercase tracking-widest font-bold py-4 transition-colors">
                  Submit Clearance Request
                </button>
              </form>
            </FadeUp>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-8 py-8 bg-[#0a0e14] border-t border-[var(--slate-900)]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <LogoLight size={20} />
          <p className="text-[10px] uppercase tracking-widest text-[var(--slate-600)] font-mono">
            &copy; 2026 Bhavora Technologies.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security'].map(item => (
              <span key={item} className="text-[10px] uppercase tracking-widest text-[var(--slate-600)] hover:text-[var(--slate-400)] cursor-pointer transition-colors font-mono">
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
