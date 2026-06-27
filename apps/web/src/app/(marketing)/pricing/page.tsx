import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'MUNICIPAL',
      desc: 'For cities under 500k population.',
      price: '$4,000',
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
      price: '$12,000',
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
    <div className="pt-24 pb-32 px-8 max-w-6xl mx-auto bg-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Enterprise Licensing
        </h1>
        <p className="max-w-2xl mx-auto text-[var(--text-secondary)] text-lg leading-relaxed">
          Select an appropriate deployment scale. All instances run in secure, SOC2 compliant environments with optional air-gapping for defense applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <div key={i} className={`p-8 rounded-xl border ${tier.primary ? 'border-[var(--accent-primary)] shadow-md relative' : 'border-[var(--border-subtle)] shadow-sm bg-white'}`}>
            {tier.primary && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--accent-primary)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </div>
            )}
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{tier.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6 h-10">{tier.desc}</p>
            <div className="mb-8">
              <span className="text-4xl font-bold font-mono">{tier.price}</span>
              <span className="text-[var(--text-muted)] text-sm">{tier.period}</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 ${tier.primary ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)] font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/contact-sales" className={`block w-full text-center text-sm font-semibold py-3 rounded-lg transition-colors ${
              tier.primary 
                ? 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]' 
                : 'bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)]'
            }`}>
              {tier.primary ? 'Start Deployment' : 'Contact Sales'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
