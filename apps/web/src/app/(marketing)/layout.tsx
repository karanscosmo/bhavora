"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogoLight } from '@/components/ui/Logo';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0e14] text-white selection:bg-[var(--accent-blue)] selection:text-white font-sans flex flex-col">
      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 transition-all duration-300 ${
          navScrolled ? 'bg-[#0a0e14]/90 backdrop-blur-md border-b border-[var(--slate-800)]' : 'bg-transparent'
        }`}
      >
        <Link href="/">
          <LogoLight size={28} />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-[10px] uppercase tracking-widest font-bold text-[var(--slate-400)] hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-[10px] uppercase tracking-widest font-bold text-[var(--slate-400)] hover:text-white transition-colors">
            About
          </Link>
          <Link href="/auth/login" className="text-[10px] uppercase tracking-widest font-bold text-[var(--slate-400)] hover:text-white transition-colors">
            Terminal Access
          </Link>
          <Link href="/contact-sales" className="text-[10px] uppercase tracking-widest font-bold text-[var(--slate-300)] border border-[var(--slate-700)] bg-[var(--slate-900)] hover:bg-[var(--slate-800)] px-4 py-2 rounded-sm transition-all">
            Contact Sales
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 px-8 py-8 bg-[#0a0e14] border-t border-[var(--slate-900)]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <LogoLight size={20} />
          <p className="text-[10px] uppercase tracking-widest text-[var(--slate-600)] font-mono">
            &copy; 2026 Bhavora Technologies.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security'].map(item => (
              <span key={item} className="text-[10px] uppercase tracking-widest text-[var(--slate-600)] hover:text-[var(--slate-400)] cursor-pointer transition-colors font-mono">
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
