import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Building2, Map, Shield } from 'lucide-react';
import { LogoIcon } from '@/components/ui/Logo';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      
      {/* Marketing Header */}
      <header className="h-[76px] bg-white border-b border-[var(--border-subtle)] flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-4">
          <LogoIcon size={42} className="text-[#2563EB]" />
          <div className="flex flex-col justify-center">
            <span className="text-[18px] font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight">BHAVORA</span>
            <span className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.18em] mt-[2px]">Urban Intelligence OS</span>
          </div>
        </Link>
        <div className="flex gap-4">
          <Link href="/auth/login" className="btn btn-secondary">Log In</Link>
          <Link href="/auth/register" className="btn btn-primary">Request Access</Link>
        </div>
      </header>

      {/* Pricing Content */}
      <div className="py-20 px-6 max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">Enterprise Licensing</h1>
          <p className="text-lg text-[var(--text-secondary)]">Predictable, municipal-scale pricing designed for government bodies, planning agencies, and enterprise infrastructure developers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Plan 1 */}
          <div className="card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-secondary)]">
                  <Map size={20} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Departmental</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6">For single-domain municipal departments requiring tactical GIS and analytics.</p>
              
              <div className="mb-8 border-b border-[var(--border-subtle)] pb-8">
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">₹45,000<span className="text-sm font-normal text-[var(--text-muted)]"> / month</span></div>
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Billed Annually</div>
              </div>

              <ul className="space-y-4 mb-8">
                {['Single Urban Domain (e.g., Traffic)', 'Read-only GIS Access', 'Standard Analytical Models', 'Weekly Data Sync', 'Email Support'].map((ft, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{ft}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/auth/register" className="btn w-full justify-center bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-3)] font-semibold border border-[var(--border-subtle)]">Contact Sales</Link>
          </div>

          {/* Plan 2 */}
          <div className="card p-8 flex flex-col justify-between border-2 border-[#2563EB] relative shadow-lg scale-105 bg-white z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Recommended
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                  <Building2 size={20} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">City Council</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Full multi-domain simulation capability for urban planning and policy generation.</p>
              
              <div className="mb-8 border-b border-[var(--border-subtle)] pb-8">
                <div className="text-3xl font-bold text-[#2563EB] mb-1">₹1,85,000<span className="text-sm font-normal text-[var(--text-muted)]"> / month</span></div>
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Billed Annually</div>
              </div>

              <ul className="space-y-4 mb-8">
                {['All 5 Urban Domains', 'Live Decision Twin Simulator', 'Disaster Command Center', 'Predictive AI Intelligence', 'Daily Data Sync', 'Priority Support SLA'].map((ft, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-primary)] font-medium">
                    <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{ft}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/auth/register" className="btn btn-primary w-full justify-center shadow-md">Request Demonstration</Link>
          </div>

          {/* Plan 3 */}
          <div className="card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-secondary)]">
                  <Shield size={20} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">State Enterprise</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Unrestricted statewide deployment with custom data ingestion and dedicated infrastructure.</p>
              
              <div className="mb-8 border-b border-[var(--border-subtle)] pb-8">
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">Custom</div>
                <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Volume Pricing</div>
              </div>

              <ul className="space-y-4 mb-8">
                {['Unlimited Users & Regions', 'Custom API Integrations', 'On-Premise / VPC Hosting', 'Real-time IoT Telemetry', 'White-glove Onboarding', '24/7 Dedicated Engineer'].map((ft, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{ft}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/auth/register" className="btn w-full justify-center bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-3)] font-semibold border border-[var(--border-subtle)]">Contact Sales</Link>
          </div>

        </div>

      </div>
    </div>
  );
}
