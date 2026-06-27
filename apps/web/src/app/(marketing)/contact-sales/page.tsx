import React from 'react';
import Link from 'next/link';

export default function ContactSalesPage() {
  return (
    <div className="pt-24 pb-32 px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-[var(--accent-blue)] text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-[var(--accent-blue)]" /> 
          SECURE CHANNEL
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-serif">
          Request Deployment Briefing
        </h1>
        <p className="max-w-2xl mx-auto text-[var(--slate-400)] text-sm font-mono leading-relaxed">
          &gt; Engage with our deployment engineers to assess feasibility, architecture integrations, and security clearances for your municipality or agency.
        </p>
      </div>

      <div className="bg-[#0f141e] border border-[var(--slate-800)] p-8 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono">Operator Name</label>
              <input type="text" className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono">Government / Corporate Email</label>
              <input type="email" className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono">Agency / Jurisdiction</label>
              <input type="text" className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono">Population / Scale</label>
              <select className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-[var(--slate-300)] text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono appearance-none">
                <option>&lt; 100k</option>
                <option>100k - 500k</option>
                <option>500k - 2M</option>
                <option>&gt; 2M</option>
                <option>Federal / National</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono">Mission Objectives (Optional)</label>
            <textarea rows={4} className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono resize-none"></textarea>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[var(--slate-800)]">
            <p className="text-[10px] text-[var(--slate-500)] font-mono max-w-xs">
              By transmitting this form, you acknowledge our classified data handling protocols and terms of service.
            </p>
            <button type="button" className="bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white text-[11px] uppercase tracking-widest font-bold px-8 py-4 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Transmit Briefing Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
