import React from 'react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-32 px-8 max-w-4xl mx-auto">
      <div className="mb-16">
        <span className="text-[var(--accent-teal)] text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--accent-teal)]" /> 
          AGENCY ORIGINS
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-serif">
          Engineering the<br/>Future of Governance
        </h1>
        <div className="w-24 border-b border-[var(--accent-blue)] mb-8"></div>
        
        <div className="prose prose-invert prose-slate max-w-none font-mono text-[var(--slate-300)] leading-relaxed">
          <p className="text-lg text-[var(--slate-400)] mb-8 font-sans">
            Bhavora was founded with a singular directive: transition municipal governance from reactive dashboards to proactive, cyber-physical intelligence systems.
          </p>
          <p className="mb-6">
            &gt; TRADITIONAL SMART CITY PLATFORMS FAIL BECAUSE THEY ARE SILOED. TRAFFIC DATA DOES NOT TALK TO GRID DATA. EMERGENCY RESPONSE DOES NOT TALK TO ZONING.
          </p>
          <p className="mb-6">
            &gt; WE BUILT THE BHAVORA URBAN OS TO CREATE A UNIFIED DATA FABRIC. BY INGESTING ALL TELEMETRY INTO A SINGLE SIMULATION ENGINE, WE ALLOW LEADERS TO SEE CASCADING IMPACTS ACROSS THEIR ENTIRE INFRASTRUCTURE.
          </p>
          <p className="mb-6">
            &gt; OUR HEADQUARTERS IS LOCATED IN SAN FRANCISCO, WITH DEPLOYMENT TEAMS EMBEDDED IN CITIES WORLDWIDE. WE HIRE EX-PALANTIR, EX-DEFENSE, AND FORMER MUNICIPAL STRATEGISTS.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[var(--slate-800)] pt-12">
        <div className="bg-[#0f141e] border border-[var(--slate-800)] p-8">
          <h3 className="font-bold text-[12px] uppercase tracking-widest font-mono mb-4 text-[var(--accent-blue)]">Mission Architecture</h3>
          <p className="text-sm text-[var(--slate-400)] leading-relaxed">
            To provide governments with the highest fidelity simulation and action environment possible, ensuring policy and capital are deployed with mathematical precision.
          </p>
        </div>
        <div className="bg-[#0f141e] border border-[var(--slate-800)] p-8">
          <h3 className="font-bold text-[12px] uppercase tracking-widest font-mono mb-4 text-[var(--accent-teal)]">Security Posture</h3>
          <p className="text-sm text-[var(--slate-400)] leading-relaxed">
            Operating at the highest levels of clearance. SOC2 Type II, FedRAMP compliant architecture, with on-premise air-gapping capabilities for national defense.
          </p>
        </div>
      </div>
    </div>
  );
}
