"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UrbanCanvas } from '@/components/ui/UrbanCanvas';
import { LogoDark, LogoIcon } from '@/components/ui/Logo';

// ========= LIVE METRICS STRIP DATA =========
interface LiveMetric {
  label: string;
  value: string;
  unit: string;
  status: 'nominal' | 'warning' | 'critical';
  icon: string;
}

function useLiveMetrics() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    { label: 'Congestion Index', value: '67', unit: '%', status: 'warning', icon: '🚦' },
    { label: 'Air Quality (AQI)', value: '142', unit: 'AQI', status: 'warning', icon: '🌫️' },
    { label: 'Grid Load', value: '4.1', unit: 'GW', status: 'nominal', icon: '⚡' },
    { label: 'Water Demand', value: '1.24', unit: 'BLD', status: 'nominal', icon: '💧' },
    { label: 'Active Incidents', value: '3', unit: '', status: 'critical', icon: '🚨' },
    { label: 'Metro Punctuality', value: '91', unit: '%', status: 'nominal', icon: '🚇' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map((m, i) => ({
        ...m,
        value: i === 0 ? String(Math.round(60 + Math.sin(Date.now() / 15000) * 12)) :
               i === 1 ? String(Math.round(135 + Math.cos(Date.now() / 20000) * 15)) :
               i === 2 ? (4.0 + Math.sin(Date.now() / 12000) * 0.3).toFixed(1) :
               i === 3 ? (1.2 + Math.cos(Date.now() / 18000) * 0.08).toFixed(2) :
               i === 4 ? String(Math.round(2 + Math.abs(Math.sin(Date.now() / 25000)) * 4)) :
               String(Math.round(88 + Math.sin(Date.now() / 10000) * 5))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
}

// ========= PLATFORM CAPABILITIES =========
const CAPABILITIES = [
  {
    icon: '🏙️',
    title: 'City Digital Twin',
    desc: 'Real-time 3D model of Bengaluru with live GIS layers — metro, hospitals, substations, lakes, and 10+ infrastructure categories.',
    href: '/cities',
    accent: '#00D4FF',
  },
  {
    icon: '🤖',
    title: 'AI Decision Engine',
    desc: 'Multi-agent AI system with Traffic, Water, Energy, and Disaster specialists collaborating to surface optimal policy decisions.',
    href: '/decision-twin',
    accent: '#7C3AED',
  },
  {
    icon: '🚨',
    title: 'Disaster Response',
    desc: 'Real-time incident command center with protocol execution, resource allocation, and automated response timeline generation.',
    href: '/disaster',
    accent: '#EF4444',
  },
  {
    icon: '📊',
    title: 'Urban Analytics',
    desc: 'Deep-dive forecasting with 6 chart types: Radar, Scatter, Heatmap, Choropleth, Temporal Forecast, and District Comparison.',
    href: '/analytics',
    accent: '#10B981',
  },
  {
    icon: '⚙️',
    title: 'Policy Simulation',
    desc: 'Adjust 6 policy levers and see cascading effects across traffic, emissions, energy, water, and economic output in real time.',
    href: '/decision-twin',
    accent: '#F59E0B',
  },
  {
    icon: '🧠',
    title: 'AI Insights Feed',
    desc: 'Proactive recommendations surfaced by AI agents, ranked by confidence, with cited evidence from government datasets.',
    href: '/insights',
    accent: '#7C3AED',
  },
];

// ========= HOW IT WORKS =========
const STEPS = [
  { n: '01', title: 'Ingest Data', desc: 'Real GIS feeds from OSM, BMRCL, BMTC, and government datasets flow into the platform continuously.' },
  { n: '02', title: 'Model the City', desc: 'The Digital Twin engine builds a dependency graph linking population, traffic, energy, water, and economy.' },
  { n: '03', title: 'Run Simulations', desc: 'Policy sliders cascade through the dependency graph in real time — see exact impact before spending a rupee.' },
  { n: '04', title: 'Act with Confidence', desc: 'AI agents surface ranked recommendations with impact forecasts. Activate policies from within the platform.' },
];

// ========= SYSTEM STATUS =========
const DATA_SOURCES = [
  { name: 'OpenStreetMap', status: 'live' as const, updated: '2m ago' },
  { name: 'BMRCL Metro Data', status: 'live' as const, updated: '15m ago' },
  { name: 'Air Quality Feed', status: 'live' as const, updated: '5m ago' },
  { name: 'Weather API', status: 'live' as const, updated: '10m ago' },
  { name: 'Energy Grid Feed', status: 'warning' as const, updated: '28m ago' },
  { name: 'BBMP Traffic', status: 'live' as const, updated: '3m ago' },
];

// ========= ANIMATED NUMBER =========
function AnimatedNumber({ value, unit }: { value: string; unit: string }) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setDisplayed(value);
      prevRef.current = value;
    }
  }, [value]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={displayed}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.35 }}
        className="data-value font-bold"
      >
        {displayed}{unit}
      </motion.span>
    </AnimatePresence>
  );
}

// ========= MAIN PAGE =========
export default function HomePage() {
  const metrics = useLiveMetrics();
  const [sectionsVisible, setSectionsVisible] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setSectionsVisible(prev => ({ ...prev, [e.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#050A14' }}>
      {/* === ANIMATED CANVAS BACKGROUND === */}
      <UrbanCanvas />

      {/* === NAVIGATION === */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16" style={{ position: 'fixed' }}>
        <LogoDark size={28} />
        <div className="hidden md:flex items-center gap-8">
          {['City Twin', 'Decision Twin', 'Disaster', 'Analytics', 'Reports'].map(item => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium transition-colors"
              style={{ color: 'rgba(255,255,255,0.55)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00D4FF')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            >
              {item}
            </Link>
          ))}
        </div>
        <Link href="/overview" className="btn-primary text-sm px-5 py-2.5">
          Launch Platform
        </Link>
      </nav>

      {/* === HERO SECTION === */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6" style={{ paddingTop: '80px' }}>
        {/* Hero radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <div style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        <div className="relative" style={{ zIndex: 2 }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex justify-center mb-8"
          >
            <LogoIcon size={80} variant="dark" />
          </motion.div>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="badge badge-green live-dot">Bengaluru Pilot — Live</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-bold leading-tight mb-4"
            style={{ fontSize: 'clamp(36px, 5vw, 58px)', color: '#fff', letterSpacing: '-0.025em' }}
          >
            The Urban Intelligence<br />
            <span className="text-gradient-cyan">Operating System</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mb-10 max-w-2xl mx-auto"
            style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}
          >
            Real-time city simulation. AI-driven decisions.
            Built for governments, planners, and the cities of tomorrow.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Link href="/overview" className="btn-primary px-8 py-4 text-base">
              Enter Platform
            </Link>
            <Link href="/cities" className="btn-ghost px-8 py-4 text-base">
              Explore City Twin →
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="flex flex-wrap items-center justify-center gap-8"
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            <span className="flex items-center gap-2">
              <span style={{ color: '#10B981' }}>●</span> Bengaluru Pilot
            </span>
            <span className="flex items-center gap-2">
              <span style={{ color: '#00D4FF' }}>●</span> Real-time Data
            </span>
            <span className="flex items-center gap-2">
              <span style={{ color: '#7C3AED' }}>●</span> AI-Powered
            </span>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            <span style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === LIVE METRICS STRIP === */}
      <section style={{ background: 'rgba(10,22,40,0.9)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 2, marginTop: '60px' }}>
        <div className="px-8 py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <span className="live-dot text-[10px] font-bold uppercase tracking-widest" style={{ color: '#10B981' }}>Live City Metrics</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Updates every 15s</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col gap-0.5"
              >
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {m.icon} {m.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <AnimatedNumber value={m.value} unit={m.unit} />
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: m.status === 'nominal' ? '#10B981' : m.status === 'warning' ? '#F59E0B' : '#EF4444',
                    flexShrink: 0,
                  }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === PLATFORM CAPABILITIES === */}
      <section
        id="capabilities"
        ref={el => { sectionRefs.current['capabilities'] = el; }}
        className="relative py-24 px-8 max-w-[1440px] mx-auto"
        style={{ zIndex: 2 }}
      >
        <div className="text-center mb-16">
          <span className="micro-label" style={{ color: '#00D4FF' }}>Platform Modules</span>
          <h2 className="mt-3 font-bold" style={{ fontSize: '36px', color: '#fff', letterSpacing: '-0.02em' }}>
            Everything a Smart City Needs
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1.6 }}>
            Six integrated modules covering the full spectrum of urban intelligence — from real-time GIS to AI-powered policy decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              animate={sectionsVisible['capabilities'] ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={cap.href} className="block glass-card p-6 rounded-xl h-full group" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{cap.icon}</div>
                  <div>
                    <h3 className="font-bold text-base mb-2" style={{ color: '#fff' }}>{cap.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}>{cap.desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5" style={{ color: cap.accent, fontSize: '13px', fontWeight: 600 }}>
                  <span>Explore</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section
        id="how-it-works"
        ref={el => { sectionRefs.current['how-it-works'] = el; }}
        className="relative py-24 px-8"
        style={{ background: 'rgba(10,22,40,0.5)', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <span className="micro-label" style={{ color: '#7C3AED' }}>Methodology</span>
            <h2 className="mt-3 font-bold" style={{ fontSize: '36px', color: '#fff', letterSpacing: '-0.02em' }}>
              How Bhavora Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                animate={sectionsVisible['how-it-works'] ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 right-0 left-full w-full h-px" style={{ background: 'rgba(0,212,255,0.15)', zIndex: -1 }} />
                )}
                <div className="glass-card p-6 rounded-xl">
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-jetbrains, monospace)', color: '#00D4FF', fontWeight: 600 }}>{step.n}</span>
                  <h3 className="font-bold mt-2 mb-2 text-base" style={{ color: '#fff' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === SYSTEM STATUS === */}
      <section
        id="status"
        ref={el => { sectionRefs.current['status'] = el; }}
        className="relative py-24 px-8 max-w-[1440px] mx-auto"
        style={{ zIndex: 2 }}
      >
        <div className="text-center mb-12">
          <span className="micro-label" style={{ color: '#10B981' }}>System Status</span>
          <h2 className="mt-3 font-bold" style={{ fontSize: '32px', color: '#fff', letterSpacing: '-0.02em' }}>
            Live Data Connections
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DATA_SOURCES.map((src, i) => (
            <motion.div
              key={src.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={sectionsVisible['status'] ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 rounded-xl text-center"
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: src.status === 'live' ? '#10B981' : '#F59E0B',
                margin: '0 auto 8px',
                boxShadow: src.status === 'live' ? '0 0 8px rgba(16,185,129,0.5)' : '0 0 8px rgba(245,158,11,0.5)',
              }} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{src.name}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>Updated {src.updated}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === CTA FOOTER === */}
      <section
        className="relative py-24 px-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(124,58,237,0.06) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          zIndex: 2,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <LogoIcon size={56} variant="dark" />
          <h2 className="mt-6 font-bold" style={{ fontSize: '36px', color: '#fff', letterSpacing: '-0.02em' }}>
            Built for Urban Intelligence.<br />Ready for Government.
          </h2>
          <p className="mt-4 mb-8" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '17px', lineHeight: 1.7 }}>
            Production-grade architecture with real GIS data, multi-agent AI, and enterprise security hardening.
            Designed for BBMP, BMRCL, Smart City Programs, and Urban Planning Departments.
          </p>
          <Link href="/overview" className="btn-primary px-10 py-4 text-base inline-flex" style={{ fontSize: '15px' }}>
            Request Demo Access
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-8 py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 2 }}>
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <LogoDark size={22} />
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            © 2025 Bhavora Technologies. Urban Intelligence OS. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security', 'Contact'].map(item => (
              <span key={item} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
