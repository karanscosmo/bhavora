import React from 'react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-32 px-8 max-w-4xl mx-auto bg-white">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
          Engineering the Future of Governance
        </h1>
        <div className="w-24 border-b-4 border-[var(--accent-primary)] mb-8"></div>
        
        <div className="prose prose-slate max-w-none text-[var(--text-secondary)] leading-relaxed text-lg">
          <p className="mb-8 font-medium text-[var(--text-primary)] text-xl">
            Bhavora was founded with a singular directive: transition municipal governance from reactive dashboards to proactive, cyber-physical intelligence systems.
          </p>
          <p className="mb-6">
            Traditional smart city platforms fail because they are siloed. Traffic data does not talk to grid data. Emergency response does not talk to zoning.
          </p>
          <p className="mb-6">
            We built the Bhavora Urban OS to create a unified data fabric. By ingesting all telemetry into a single simulation engine, we allow leaders to see cascading impacts across their entire infrastructure.
          </p>
          <p className="mb-6">
            Our headquarters is located in San Francisco, with deployment teams embedded in cities worldwide. We hire ex-Palantir, ex-Defense, and former municipal strategists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[var(--border-subtle)] pt-12">
        <div className="p-8 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-subtle)]">
          <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">Mission Architecture</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            To provide governments with the highest fidelity simulation and action environment possible, ensuring policy and capital are deployed with mathematical precision.
          </p>
        </div>
        <div className="p-8 bg-[var(--bg-surface-2)] rounded-lg border border-[var(--border-subtle)]">
          <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">Security Posture</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Operating at the highest levels of clearance. SOC2 Type II, FedRAMP compliant architecture, with on-premise air-gapping capabilities for national defense.
          </p>
        </div>
      </div>
    </div>
  );
}
