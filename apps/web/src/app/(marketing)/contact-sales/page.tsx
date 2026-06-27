import React from 'react';
import Link from 'next/link';

export default function ContactSalesPage() {
  return (
    <div className="pt-24 pb-32 px-8 max-w-4xl mx-auto bg-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Contact Enterprise Sales
        </h1>
        <p className="max-w-2xl mx-auto text-[var(--text-secondary)] text-lg leading-relaxed">
          Engage with our deployment engineers to assess feasibility, architecture integrations, and security clearances for your municipality or agency.
        </p>
      </div>

      <div className="bg-white border border-[var(--border-subtle)] rounded-xl p-8 shadow-lg max-w-3xl mx-auto">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Full Name</label>
              <input type="text" className="form-input" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Government / Corporate Email</label>
              <input type="email" className="form-input" placeholder="jane.doe@city.gov" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Agency / Jurisdiction</label>
              <input type="text" className="form-input" placeholder="Department of Transportation" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Population / Scale</label>
              <select className="form-input appearance-none">
                <option>&lt; 100k</option>
                <option>100k - 500k</option>
                <option>500k - 2M</option>
                <option>&gt; 2M</option>
                <option>Federal / National</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Mission Objectives (Optional)</label>
            <textarea rows={4} className="form-input resize-none" placeholder="Briefly describe your primary use cases..."></textarea>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[var(--border-subtle)] gap-4">
            <p className="text-xs text-[var(--text-muted)] max-w-xs text-center sm:text-left">
              By submitting this form, you acknowledge our data handling protocols and privacy policy.
            </p>
            <button type="button" className="btn btn-primary w-full sm:w-auto px-8 py-3 text-sm">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
