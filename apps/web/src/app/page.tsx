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
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--slate-900)] selection:bg-[var(--accent-blue)] selection:text-white">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <UrbanCanvas />
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(0,102,255,0.05),transparent_50%)]" />

      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 transition-all duration-300 ${
          navScrolled ? 'bg-[var(--slate-900)]/90 backdrop-blur-md border-b border-[var(--slate-800)]' : 'bg-transparent'
        }`}
      >
        <LogoLight size={28} />
        <div className="flex items-center gap-4">
          <Link href="/platform" className="btn-primary text-sm px-5 py-2.5 shadow-[0_0_15px_rgba(0,102,255,0.3)]">
            Launch Platform
          </Link>
          <button onClick={scrollToDemo} className="btn-ghost text-sm px-5 py-2.5 !border-[var(--slate-700)] !text-[var(--slate-200)] hover:!bg-[var(--slate-800)]">
            Contact Sales
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6 pt-32 pb-16">
        <div className="relative max-w-5xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 text-[var(--accent-blue-light)] text-xs font-semibold tracking-wider uppercase"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-pulse" />
            Bhavora OS v5.0 Available
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-bold leading-[1.1] mb-6 text-white tracking-tight"
            style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}
          >
            Urban Intelligence<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)]">
              Operating System
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10 max-w-3xl mx-auto text-[var(--slate-300)] text-lg md:text-xl leading-relaxed"
          >
            The comprehensive platform for city governments and infrastructure operators. 
            Integrate geospatial data, run policy simulations, and deploy AI agents to manage urban operations in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-20"
          >
            <Link href="/platform" className="btn-primary px-8 py-4 text-base font-semibold tracking-wide">
              Launch Platform
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <button onClick={scrollToDemo} className="btn-ghost px-8 py-4 text-base font-semibold tracking-wide !border-[var(--slate-700)] !text-[var(--slate-300)] hover:!bg-[var(--slate-800)]">
              Request Demo
            </button>
          </motion.div>

          {/* LIVE METRICS PREVIEW ON HERO */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-6 gap-4 p-6 rounded-2xl border border-[var(--slate-800)] bg-[var(--slate-900)]/80 backdrop-blur-xl shadow-2xl"
          >
            {metricItems.map((m, i) => (
              <div key={m.label} className="flex flex-col gap-1 items-start text-left border-l border-[var(--slate-700)] pl-4 first:border-0 first:pl-0">
                <span className="text-[10px] font-semibold text-[var(--slate-400)] uppercase tracking-wider">{m.label}</span>
                <div className="text-[var(--slate-50)]">
                  <AnimatedCounter value={m.value} suffix={m.suffix} />
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* CORE CAPABILITIES (Palantir style cards) */}
      <section className="relative z-10 py-32 px-8 bg-[var(--slate-50)] text-[var(--slate-900)] border-t border-[var(--slate-200)]">
        <div className="max-w-[1440px] mx-auto">
          <FadeUp className="mb-16 md:flex justify-between items-end">
            <div className="max-w-2xl">
              <span className="text-[var(--accent-blue)] text-xs font-bold tracking-widest uppercase mb-2 block">Platform Capabilities</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--slate-900)]">
                Command Your City
              </h2>
            </div>
            <p className="mt-4 md:mt-0 max-w-md text-[var(--slate-600)] text-lg leading-relaxed">
              A unified environment replacing fragmented dashboards. Built for mayors, planners, and emergency responders.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Map, title: 'City Twin GIS', desc: 'Real-time 3D geospatial engine with live infrastructure layers.', href: '/cities' },
              { icon: Sliders, title: 'Decision Twin', desc: 'Simulate policy impacts before committing public funds.', href: '/decision-twin' },
              { icon: Shield, title: 'Disaster Intel', desc: 'Incident command system with automated response workflows.', href: '/disaster' },
              { icon: Lightbulb, title: 'AI Insights', desc: 'Proactive explainable intelligence surfacing critical anomalies.', href: '/insights' },
              { icon: BarChart3, title: 'Executive Analytics', desc: 'Boardroom-ready data visualizations and predictive forecasting.', href: '/analytics' },
              { icon: Network, title: 'Scenario Vault', desc: 'Save, compare, and version-control urban planning missions.', href: '/scenarios' }
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
              <FadeUp key={cap.title} delay={i * 0.1}>
                <Link href={cap.href} className="group block h-full bg-white border border-[var(--slate-200)] p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-[var(--accent-blue)]/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[var(--slate-100)] text-[var(--accent-blue)] flex items-center justify-center mb-6 group-hover:bg-[var(--accent-blue)] group-hover:text-white transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--slate-900)] mb-3">{cap.title}</h3>
                  <p className="text-[var(--slate-600)] leading-relaxed mb-6">{cap.desc}</p>
                  <div className="flex items-center text-[var(--accent-blue)] font-semibold text-sm">
                    Explore Module <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE SECTION */}
      <section className="relative z-10 py-32 px-8 bg-[var(--slate-900)] text-white border-y border-[var(--slate-800)]">
        <div className="max-w-[1440px] mx-auto text-center">
          <FadeUp>
            <span className="text-[var(--accent-teal)] text-xs font-bold tracking-widest uppercase mb-2 block">System Architecture</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              How Bhavora Works
            </h2>
            <p className="max-w-3xl mx-auto text-[var(--slate-400)] text-lg mb-20">
              Bhavora ingest massive civic datasets, processes them through our proprietary simulation engine, and outputs explainable intelligence via an intuitive OS.
            </p>
          </FadeUp>

          <FadeUp delay={0.2} className="relative">
            {/* Visual Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto relative">
              {/* Lines connecting them (hidden on mobile) */}
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[var(--slate-700)] via-[var(--accent-blue)] to-[var(--accent-teal)] -translate-y-1/2 z-0" />
              
              {/* Stage 1 */}
              <div className="bg-[var(--slate-800)] border border-[var(--slate-700)] p-8 rounded-2xl relative z-10">
                <Database size={40} className="text-[var(--slate-400)] mb-4 mx-auto" />
                <h3 className="font-bold text-xl mb-2">1. Ingest</h3>
                <p className="text-sm text-[var(--slate-400)]">Connects to IoT sensors, transit APIs, GIS servers, and legacy databases.</p>
              </div>

              {/* Stage 2 */}
              <div className="bg-[var(--slate-800)] border border-[var(--accent-blue)] p-8 rounded-2xl relative z-10 shadow-[0_0_30px_rgba(0,102,255,0.2)]">
                <Cpu size={40} className="text-[var(--accent-blue)] mb-4 mx-auto" />
                <h3 className="font-bold text-xl mb-2">2. Simulate</h3>
                <p className="text-sm text-[var(--slate-400)]">Runs multi-agent physics and economic models to project cascading impacts.</p>
              </div>

              {/* Stage 3 */}
              <div className="bg-[var(--slate-800)] border border-[var(--accent-teal)] p-8 rounded-2xl relative z-10 shadow-[0_0_30px_rgba(13,148,136,0.2)]">
                <Activity size={40} className="text-[var(--accent-teal)] mb-4 mx-auto" />
                <h3 className="font-bold text-xl mb-2">3. Act</h3>
                <p className="text-sm text-[var(--slate-400)]">Surfaces explainable insights, automated reports, and tactical workflows.</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* WHY BHAVORA (Differentiation) */}
      <section className="relative z-10 py-32 px-8 bg-[var(--slate-50)] text-[var(--slate-900)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                Why governments choose Bhavora
              </h2>
              <ul className="space-y-6">
                {[
                  { title: 'Not a dashboard. An Operating System.', desc: 'Dashboards show you what happened. Bhavora shows you what will happen next, and what to do about it.' },
                  { title: 'Explainable AI', desc: 'Government requires accountability. Every AI insight provides citation chains back to the source municipal data.' },
                  { title: 'Cascading Impact Analysis', desc: 'Understanding that a change in zoning laws affects traffic, which affects emissions, which affects grid load.' },
                  { title: 'Enterprise Security', desc: 'On-prem deployment ready, SOC 2 Type II, and strict role-based access control.' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] flex items-center justify-center flex-shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[var(--slate-900)]">{item.title}</h4>
                      <p className="text-[var(--slate-600)] mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </FadeUp>

            <FadeUp delay={0.2} className="relative">
              {/* Decision Twin Preview Mockup */}
              <div className="bg-white rounded-2xl border border-[var(--slate-200)] shadow-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-teal)]" />
                <h3 className="font-bold text-lg mb-4">Decision Twin: Metro Expansion Phase 3</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-[var(--slate-50)] border border-[var(--slate-200)]">
                    <div className="text-xs font-bold text-[var(--slate-500)] uppercase mb-1">Before</div>
                    <div className="text-2xl font-bold">142 AQI</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30">
                    <div className="text-xs font-bold text-[var(--accent-teal)] uppercase mb-1">After (Projected)</div>
                    <div className="text-2xl font-bold text-[var(--accent-teal)]">98 AQI</div>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="var(--border-subtle)" />
                      <PolarAngleAxis dataKey="system" tick={{ fill: 'var(--slate-600)', fontSize: 11 }} />
                      <Radar name="Current" dataKey="current" stroke="var(--slate-400)" fill="var(--slate-200)" fillOpacity={0.5} strokeWidth={2} />
                      <Radar name="Projected" dataKey="projected" stroke="var(--accent-teal)" fill="var(--accent-teal)" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section ref={demoRef} className="relative z-10 py-32 px-8 bg-[var(--slate-900)] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to modernize your city?
            </h2>
            <p className="text-[var(--slate-400)] text-lg mb-10">
              Contact our deployment team for a technical deep-dive and customized demonstration of the Bhavora platform.
            </p>
          </FadeUp>

          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--slate-800)] border border-[var(--accent-teal)] p-8 rounded-2xl text-center">
              <Check size={48} className="text-[var(--accent-teal)] mx-auto mb-4" />
              <h3 className="font-bold text-2xl mb-2">Request Received</h3>
              <p className="text-[var(--slate-400)]">Our engineering team will contact you shortly.</p>
            </motion.div>
          ) : (
            <FadeUp delay={0.2}>
              <form onSubmit={handleSubmit} className="bg-[var(--slate-800)] border border-[var(--slate-700)] p-8 rounded-2xl text-left space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[var(--slate-400)] uppercase mb-2">Full Name</label>
                    <input
                      type="text" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-[var(--slate-900)] border border-[var(--slate-600)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-blue)]"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--slate-400)] uppercase mb-2">Work Email</label>
                    <input
                      type="email" required
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[var(--slate-900)] border border-[var(--slate-600)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-blue)]"
                      placeholder="jane@city.gov"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--slate-400)] uppercase mb-2">Organization / City</label>
                  <input
                    type="text" required
                    value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                    className="w-full bg-[var(--slate-900)] border border-[var(--slate-600)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-blue)]"
                    placeholder="Department of Urban Planning"
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-lg font-bold">
                  Submit Request
                </button>
              </form>
            </FadeUp>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-8 py-12 bg-[var(--slate-950)] border-t border-[var(--slate-800)]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <LogoLight size={24} />
          <p className="text-sm text-[var(--slate-500)]">
            &copy; 2026 Bhavora Technologies. Urban Intelligence OS.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Trust Center'].map(item => (
              <span key={item} className="text-sm text-[var(--slate-500)] hover:text-[var(--slate-300)] cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
