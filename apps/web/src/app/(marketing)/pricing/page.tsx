import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'MUNICIPAL',
      desc: 'For cities under 500k population.',
      price: '$4k',
      period: '/mo',
      features: [
        'City Twin GIS (Standard Res)',
        '3 Active AI Agents',
        'Basic Scenario Vault (5 branches)',
        'Standard Support'
      ],
      primary: false
    },
    {
      name: 'METROPOLITAN',
      desc: 'Full Cyber-Physical Intelligence.',
      price: '$12k',
      period: '/mo',
      features: [
        'Sub-meter GIS Infrastructure',
        'Unlimited AI Agents',
        'Decision Twin Simulations',
        'Disaster Intel Command',
        '24/7 Priority Support'
      ],
      primary: true
    },
    {
      name: 'NATION-STATE',
      desc: 'Regional and national deployments.',
      price: 'Custom',
      period: '',
      features: [
        'Multi-city Federation',
        'On-Premise Deployment (Air-gapped)',
        'Classified Data Clearance',
        'Dedicated Deployment Engineers'
      ],
      primary: false
    }
  ];

  return (
    <div className="pt-24 pb-32 px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-[var(--accent-teal)] text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--accent-teal)]" /> 
          DEPLOYMENT SCALES
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-serif">
          Procurement & Licensing
        </h1>
        <p className="max-w-2xl mx-auto text-[var(--slate-400)] text-sm font-mono leading-relaxed">
          &gt; Select an appropriate deployment scale. All instances run in secure, SOC2 compliant environments with optional air-gapping for defense applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier, i) => (
          <div key={i} className={`p-8 border ${tier.primary ? 'bg-[#0f141e] border-[var(--accent-blue)] shadow-[inset_0_0_40px_rgba(0,102,255,0.1)]' : 'bg-[var(--slate-900)] border-[var(--slate-800)]'}`}>
            <h3 className="text-[12px] font-bold text-[var(--slate-300)] uppercase tracking-widest mb-2 font-mono">{tier.name}</h3>
            <p className="text-sm text-[var(--slate-500)] mb-6 h-10">{tier.desc}</p>
            <div className="mb-8">
              <span className="text-4xl font-bold font-serif">{tier.price}</span>
              <span className="text-[var(--slate-500)] text-sm">{tier.period}</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 ${tier.primary ? 'text-[var(--accent-blue)]' : 'text-[var(--slate-500)]'}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-sm text-[var(--slate-300)]">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/contact-sales" className={`block text-center text-[10px] uppercase tracking-widest font-bold py-3 transition-all ${
              tier.primary 
                ? 'bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue-hover)] shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                : 'bg-[var(--slate-800)] text-[var(--slate-300)] hover:bg-[var(--slate-700)]'
            }`}>
              {tier.primary ? 'Initialize Deployment' : 'Request Clearance'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
