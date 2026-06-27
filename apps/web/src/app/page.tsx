"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UrbanCanvas } from '@/components/ui/UrbanCanvas';
import { LogoLight, LogoDark } from '@/components/ui/Logo';
import { useCityDataStore } from '@/stores';
import {
  Brain, BarChart3, Shield, Map, Sliders, Lightbulb,
  ArrowRight, ChevronRight, Check,
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
      style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', color: 'var(--text-primary)' }}
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

// ========= CAPABILITIES DATA =========
const CAPABILITIES = [
  { icon: <Map size={20} />, title: 'City Twin GIS', desc: 'Real-time 3D model with live GIS layers — metro, hospitals, substations, lakes, and 10+ infrastructure categories.', href: '/cities' },
  { icon: <Brain size={20} />, title: 'AI Decision Engine', desc: 'Multi-agent AI system with Traffic, Water, Energy, and Disaster specialists collaborating to surface optimal policy decisions.', href: '/decision-twin' },
  { icon: <Shield size={20} />, title: 'Disaster Response', desc: 'Real-time incident command center with protocol execution, resource allocation, and automated response timeline generation.', href: '/disaster' },
  { icon: <BarChart3 size={20} />, title: 'Urban Analytics', desc: 'Deep-dive forecasting with 6 chart types — Radar, Scatter, Heatmap, Choropleth, Temporal Forecast, and District Comparison.', href: '/analytics' },
  { icon: <Sliders size={20} />, title: 'Policy Simulation', desc: 'Adjust 6 policy levers and see cascading effects across traffic, emissions, energy, water, and economic output in real time.', href: '/decision-twin' },
  { icon: <Lightbulb size={20} />, title: 'AI Insights', desc: 'Proactive recommendations surfaced by AI agents, ranked by confidence, with cited evidence from government datasets.', href: '/insights' },
];

// ========= RADAR CHART DATA =========
const RADAR_DATA = [
  { system: 'Traffic', current: 67, projected: 84 },
  { system: 'Emissions', current: 45, projected: 78 },
  { system: 'Energy', current: 73, projected: 86 },
  { system: 'Water', current: 58, projected: 76 },
  { system: 'Economy', current: 62, projected: 79 },
  { system: 'Transit', current: 71, projected: 88 },
];

// ========= MAIN PAGE =========
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
    <div className="relative min-h-screen overflow-x-hidden">
      {/* === FIXED CANVAS BACKGROUND === */}
      <UrbanCanvas />

      {/* === NAVIGATION === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 transition-all duration-300 ${
          navScrolled ? 'glass-nav' : ''
        }`}
        style={navScrolled ? {} : { background: 'transparent' }}
      >
        {navScrolled ? <LogoLight size={28} /> : <LogoDark size={28} />}
        <div className="flex items-center gap-4">
          <Link
            href="/overview"
            className="btn-primary text-sm px-5 py-2.5"
          >
            Launch Platform
          </Link>
          <button
            onClick={scrollToDemo}
            className={`btn-ghost text-sm px-5 py-2.5 ${navScrolled ? '' : '!border-white/30 !text-white hover:!bg-white/10'}`}
          >
            Request Demo
          </button>
        </div>
      </nav>

      {/* === HERO SECTION (Dark) === */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center px-6 pt-20"
        style={{ background: 'linear-gradient(180deg, rgba(5,10,20,0.92) 0%, rgba(5,10,20,0.6) 70%, rgba(5,10,20,0.2) 100%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)',
            borderRadius: '50%',
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="glass" style={{ padding: '12px 20px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <LogoLight size={36} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="badge badge-green live-dot" style={{ fontSize: '11px', padding: '4px 12px' }}>Bengaluru Pilot — Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="font-bold leading-tight mb-5"
            style={{ fontSize: 'clamp(36px, 5.5vw, 64px)', color: '#fff', letterSpacing: '-0.03em' }}
          >
            Urban Intelligence<br />
            <span className="text-gradient-cyan">Operating System</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-10 max-w-2xl mx-auto"
            style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}
          >
            AI-powered city management platform for real-time simulation, multi-agent decision intelligence,
            and enterprise-grade urban planning — purpose-built for government operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Link href="/overview" className="btn-primary px-8 py-4 text-base" style={{ fontSize: '15px', padding: '14px 32px' }}>
              Launch Platform
              <ArrowRight size={16} />
            </Link>
            <button onClick={scrollToDemo} className="btn-ghost px-8 py-4 text-base !border-white/25 !text-white/80 hover:!bg-white/10 hover:!border-white/50" style={{ fontSize: '15px', padding: '14px 32px' }}>
              Request Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6"
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            {['Bengaluru Pilot', 'Real-time Data', 'AI-Powered', 'Enterprise Grade'].map(t => (
              <span key={t} className="flex items-center gap-2">
                <Check size={10} style={{ color: '#10B981' }} />
                {t}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronRight size={12} style={{ transform: 'rotate(90deg)' }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === LIGHT THEME CONTENT (overlays dark canvas) === */}
      <div style={{ background: 'var(--bg-base)', position: 'relative', zIndex: 10 }}>

        {/* === LIVE METRICS STRIP === */}
        <section style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="px-8 py-5 max-w-[1440px] mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="live-dot text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-teal)' }}>Live City Metrics</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Updates every 6s</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {metricItems.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col gap-0.5"
                >
                  <span className="micro-label" style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                  <div className="flex items-center gap-2">
                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: m.value > 80 && m.label !== 'City Health Score' && m.label !== 'Metro Punctuality'
                        ? 'var(--accent-red)'
                        : m.value > 60 && m.label !== 'City Health Score' && m.label !== 'Metro Punctuality'
                          ? 'var(--accent-amber)'
                          : 'var(--accent-teal)',
                      flexShrink: 0,
                    }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* === CAPABILITIES GRID === */}
        <section className="relative py-24 px-8 max-w-[1440px] mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="micro-label" style={{ color: 'var(--accent-navy)' }}>Platform Modules</span>
            <h2 className="mt-3 font-bold" style={{ fontSize: 'clamp(28px, 3vw, 36px)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Everything a Smart City Needs
            </h2>
            <p className="mt-3 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
              Six integrated modules covering the full spectrum of urban intelligence — from real-time GIS
              to AI-powered policy decisions.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, i) => (
              <FadeUp key={cap.title} delay={i * 0.05}>
                <Link href={cap.href} className="glass-card p-6 h-full flex flex-col group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center rounded-xl"
                      style={{
                        width: 44, height: 44,
                        background: 'var(--accent-navy-light)',
                        color: 'var(--accent-navy)',
                        flexShrink: 0,
                      }}
                    >
                      {cap.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{cap.title}</h3>
                      <p className="mt-1" style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.65 }}>{cap.desc}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--accent-navy)' }}>
                    <span>Learn more</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* === SIMULATION SHOWCASE === */}
        <section className="relative py-24 px-8"
          style={{ background: 'var(--bg-surface-2)' }}
        >
          <div className="max-w-[1440px] mx-auto">
            <FadeUp className="text-center mb-16">
              <span className="micro-label" style={{ color: 'var(--accent-violet)' }}>Decision Twin</span>
              <h2 className="mt-3 font-bold" style={{ fontSize: 'clamp(28px, 3vw, 36px)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Simulation &amp; Impact Modeling
              </h2>
              <p className="mt-3 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
                Adjust policy levers and see cascading effects across every urban system — before committing public resources.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Radar Chart */}
              <FadeUp>
                <div className="glass-card p-8">
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Urban Systems Radar</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Current vs. projected performance across key urban systems</p>
                  <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                      <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="72%">
                        <PolarGrid stroke="var(--border-subtle)" />
                        <PolarAngleAxis dataKey="system" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                        <Radar name="Current" dataKey="current" stroke="var(--accent-navy)" fill="var(--accent-navy)" fillOpacity={0.12} strokeWidth={2} />
                        <Radar name="Projected" dataKey="projected" stroke="var(--accent-teal)" fill="var(--accent-teal)" fillOpacity={0.12} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-8 mt-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-navy)', display: 'inline-block' }} />
                      Current Baseline
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-teal)', display: 'inline-block' }} />
                      Projected Impact
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* Stats + Cascading Effects */}
              <FadeUp delay={0.1} className="flex flex-col gap-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '7', label: 'Urban Systems Modeled' },
                    { value: '25-Year', label: 'Projections' },
                    { value: '94%', label: 'Avg Confidence' },
                  ].map((stat, i) => (
                    <div key={stat.label} className="glass-card p-5 text-center">
                      <div className="data-value font-bold" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', color: 'var(--accent-navy)' }}>
                        {stat.value}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Cascading effects tree */}
                <div className="glass-card p-6">
                  <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Cascading Effects Tree</h3>
                  <div className="space-y-3">
                    {[
                      { action: '↑ Congestion Pricing +25%', effects: ['Traffic -18%', 'Emissions -12%', 'Transit Ridership +22%', 'Revenue +₹2.4B/yr'], color: 'var(--accent-navy)' },
                      { action: '↑ Green Zone Expansion', effects: ['AQI -22 points', 'Property Value +8%', 'Green Cover +14%'], color: 'var(--accent-teal)' },
                    ].map((item) => (
                      <div key={item.action}>
                        <div className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: item.color }}>
                          <ChevronRight size={14} />
                          {item.action}
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                          {item.effects.map((effect) => (
                            <span key={effect} className="badge-navy inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                              style={{ background: 'var(--accent-navy-light)', color: 'var(--accent-navy)' }}
                            >
                              {effect}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* === GOVERNMENT READINESS === */}
        <section className="relative py-24 px-8 max-w-[1440px] mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="micro-label" style={{ color: 'var(--accent-teal)' }}>Enterprise Trust</span>
            <h2 className="mt-3 font-bold" style={{ fontSize: 'clamp(28px, 3vw, 36px)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Trusted by Urban Planning Departments
            </h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
              Enterprise-grade security and compliance for government infrastructure.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <FadeUp>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🔒', title: 'SOC 2 Type II', desc: 'Enterprise security controls audited annually by independent firms.' },
                  { icon: '🛡️', title: 'GDPR Compliant', desc: 'Full data protection compliance for EU urban planning partners.' },
                  { icon: '🏛️', title: 'BBMP Integrated', desc: 'Direct integration with Bengaluru civic body data pipelines.' },
                  { icon: '🌐', title: 'Real-time GIS', desc: 'Live OSM, BMRCL, BMTC, and government geospatial feeds.' },
                ].map((item) => (
                  <div key={item.title} className="glass-card p-5 text-left">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="glass-card p-8">
                <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Data Security &amp; Sovereignty</h3>
                <ul className="space-y-4">
                  {[
                    'All city data encrypted at rest and in transit (AES-256 / TLS 1.3)',
                    'Role-based access control with granular permission policies',
                    'On-premise deployment available for sensitive government operations',
                    'Real-time audit logging with full query traceability',
                    'Automated backup with 99.99% uptime SLA',
                    'Dedicated security incident response team',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-teal)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* === REQUEST DEMO === */}
        <section
          ref={demoRef}
          className="relative py-24 px-8 text-center"
          style={{
            background: 'linear-gradient(135deg, var(--accent-navy-light) 0%, var(--bg-surface-2) 100%)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div className="max-w-lg mx-auto">
            <FadeUp>
              <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3vw, 36px)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Request a Demo
              </h2>
              <p className="mt-3 mb-8" style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
                See how Bhavora can transform your city&apos;s planning operations.
              </p>
            </FadeUp>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8"
              >
                <div className="text-3xl mb-3">
                  <Check size={32} style={{ color: 'var(--accent-teal)', margin: '0 auto' }} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Thank You!</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>We&apos;ll be in touch within 24 hours to schedule your personalized demo.</p>
              </motion.div>
            ) : (
              <FadeUp>
                <form onSubmit={handleSubmit} className="glass-card p-8 text-left space-y-5">
                  <div>
                    <label className="micro-label block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="input-dark w-full"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="micro-label block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Work Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="input-dark w-full"
                      placeholder="jane@citygov.org"
                    />
                  </div>
                  <div>
                    <label className="micro-label block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Organization</label>
                    <input
                      type="text"
                      required
                      value={form.organization}
                      onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                      className="input-dark w-full"
                      placeholder="Bengaluru Smart City Ltd."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
                    Submit Request
                    <ArrowRight size={14} />
                  </button>
                </form>
              </FadeUp>
            )}
          </div>
        </section>

        {/* === ENTERPRISE FOOTER === */}
        <footer className="px-8 py-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <LogoLight size={22} />
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              &copy; 2025 Bhavora Technologies. Urban Intelligence OS. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Security', 'Contact'].map(item => (
                <span key={item} style={{ fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>{item}</span>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}


