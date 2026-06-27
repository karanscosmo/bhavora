"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/ui/Logo';
import { Server, ShieldCheck, Activity, BarChart, Settings, Database, ArrowRight, CheckCircle2, Globe2, Building2 } from 'lucide-react';

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[var(--text-primary)]">
      
      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 transition-all duration-300 ${
          navScrolled ? 'bg-white/95 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <LogoIcon size={24} />
          <span className="font-bold text-lg tracking-tight font-sans">Bhavora</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#overview" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Platform</Link>
          <Link href="#use-cases" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Solutions</Link>
          <Link href="/pricing" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Pricing</Link>
          <Link href="/about" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Company</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Sign In
          </Link>
          <Link href="/contact-sales" className="btn btn-primary text-sm px-6 py-2">
            Request Demo
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></span>
            Bhavora OS v3.0 is now available
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            The Operating System for Modern Governance.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg leading-relaxed">
            Unify municipal data silos, simulate policy impacts in real-time, and deploy capital with mathematical precision using our enterprise digital twin platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact-sales" className="btn btn-primary text-base px-8 py-3 h-12 w-full sm:w-auto">
              Schedule Briefing <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link href="/auth/login" className="btn btn-secondary text-base px-8 py-3 h-12 w-full sm:w-auto">
              Platform Login
            </Link>
          </div>
          
          <div className="mt-12 flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-3xl font-bold font-mono">15+</span>
              <span className="text-sm text-[var(--text-muted)] font-medium">Cities Deployed</span>
            </div>
            <div className="w-px h-10 bg-[var(--border-subtle)]"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold font-mono">240M</span>
              <span className="text-sm text-[var(--text-muted)] font-medium">Citizens Served</span>
            </div>
            <div className="w-px h-10 bg-[var(--border-subtle)]"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold font-mono">SOC2</span>
              <span className="text-sm text-[var(--text-muted)] font-medium">Type II Certified</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image / Graphic */}
        <div className="relative rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none rounded-lg" />
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            alt="Bhavora Platform Dashboard" 
            className="w-full h-auto rounded shadow-sm border border-[var(--border-subtle)] opacity-90 grayscale"
          />
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface-2)] py-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60 grayscale">
          {['Tyler Technologies Partner', 'GovTech 100', 'AWS Public Sector', 'Smart Cities Council', 'Federal Risk Authorized'].map(partner => (
            <span key={partner} className="font-sans font-bold text-[var(--text-secondary)] text-sm uppercase tracking-wider">{partner}</span>
          ))}
        </div>
      </section>

      {/* PRODUCT OVERVIEW */}
      <section id="overview" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">A Unified Urban Data Fabric</h2>
          <p className="text-[var(--text-secondary)] text-lg">
            Traditional city management relies on disconnected departmental dashboards. Bhavora ingests all municipal telemetry into a single, cohesive GIS simulation engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Database size={24} className="text-[var(--accent-primary)]" />,
              title: "Data Ingestion Engine",
              desc: "Seamlessly integrate with SCADA systems, traffic APIs, census data, and departmental SQL databases."
            },
            {
              icon: <Activity size={24} className="text-[var(--accent-primary)]" />,
              title: "Real-Time Digital Twin",
              desc: "Visualize your entire city's infrastructure state, from bus network latencies to power grid load."
            },
            {
              icon: <Server size={24} className="text-[var(--accent-primary)]" />,
              title: "Predictive Scenarios",
              desc: "Simulate the 15-year impact of rezoning, new transit lines, or climate events before breaking ground."
            }
          ].map((feat, i) => (
            <div key={i} className="card p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary-bg)] flex items-center justify-center mb-6">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS (Timeline) */}
      <section className="py-24 px-8 bg-[var(--bg-surface-2)] border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Deployment Architecture</h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Data Pipeline Integration', desc: 'Our deployment engineers map your existing departmental databases and live sensor networks into the Bhavora schema.' },
                  { step: '02', title: 'Twin Calibration', desc: 'The AI engine calibrates its baseline using 5-10 years of your historical data to ensure accurate predictive models.' },
                  { step: '03', title: 'Command Center Launch', desc: 'Secure SSO access is rolled out to department heads, providing an immediate unified operational picture.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-2xl font-mono font-bold text-[var(--accent-primary)]">{s.step}</span>
                    <div>
                      <h4 className="text-lg font-bold mb-2">{s.title}</h4>
                      <p className="text-[var(--text-secondary)]">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-8 bg-white">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center p-3 bg-[var(--bg-surface-2)] rounded border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-secondary)]">Traffic API Connected</span>
                  <CheckCircle2 size={16} className="text-[var(--accent-success)]" />
                </div>
                <div className="flex justify-between items-center p-3 bg-[var(--bg-surface-2)] rounded border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-secondary)]">Water Grid SCADA Linked</span>
                  <CheckCircle2 size={16} className="text-[var(--accent-success)]" />
                </div>
                <div className="flex justify-between items-center p-3 bg-[var(--bg-surface-2)] rounded border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-secondary)]">Demographic Census Synced</span>
                  <CheckCircle2 size={16} className="text-[var(--accent-success)]" />
                </div>
                <div className="flex justify-between items-center p-3 bg-[var(--accent-primary-bg)] rounded border border-[var(--accent-primary)]">
                  <span className="text-[var(--accent-primary)] font-bold">System Online</span>
                  <Globe2 size={16} className="text-[var(--accent-primary)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI & METRICS */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Proven Municipal ROI</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { metric: '32%', label: 'Reduction in Traffic Congestion' },
            { metric: '$45M', label: 'Infrastructure Savings Identified' },
            { metric: '14min', label: 'Faster Emergency Response' },
            { metric: '100%', label: 'Departmental Data Unification' }
          ].map((item, i) => (
            <div key={i} className="p-6">
              <div className="text-4xl font-bold text-[var(--accent-primary)] mb-2 font-mono">{item.metric}</div>
              <div className="text-[var(--text-secondary)] font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="bg-[var(--slate-900)] text-white py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">Ready to upgrade your city?</h2>
            <p className="text-[var(--slate-400)]">Contact our enterprise sales team for a custom deployment briefing.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/contact-sales" className="btn bg-white text-[var(--slate-900)] hover:bg-[var(--slate-100)] px-8 py-3">
              Request Demo
            </Link>
            <Link href="/pricing" className="btn border border-[var(--slate-700)] hover:bg-[var(--slate-800)] px-8 py-3 text-white">
              View Pricing
            </Link>
          </div>
        </div>
        
        <div className="border-t border-[var(--slate-800)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--slate-500)]">
          <div className="flex items-center gap-2">
            <LogoIcon size={20} />
            <span className="font-bold">Bhavora OS</span>
          </div>
          <div>&copy; 2026 Bhavora Technologies. SOC2 Type II Certified.</div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
