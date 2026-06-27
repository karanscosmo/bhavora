"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/ui/Logo';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[var(--text-primary)]">
      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 transition-all duration-300 ${
          navScrolled ? 'bg-white/95 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-sm' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <Link href="/">
            <LogoIcon size={24} />
          </Link>
          <Link href="/" className="font-bold text-lg tracking-tight font-sans">Bhavora</Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
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

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <LogoIcon size={20} />
            <span className="font-bold text-[var(--text-primary)]">Bhavora OS</span>
          </div>
          <div>&copy; 2026 Bhavora Technologies. SOC2 Type II Certified.</div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-[var(--accent-primary)] transition-colors">About</Link>
            <a href="#" className="hover:text-[var(--accent-primary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--accent-primary)] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
