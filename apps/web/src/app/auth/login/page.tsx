"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoLight } from '@/components/ui/Logo';
import { useAppStore } from '@/stores';
import { UrbanCanvas } from '@/components/ui/UrbanCanvas';
import { ShieldCheck, Lock, Activity } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { addNotification } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'initial' | 'verifying' | 'success'>('initial');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingUser = localStorage.getItem('bhavoraUser');
      if (existingUser) {
        router.push('/overview');
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStep('verifying');

    setTimeout(() => {
      setAuthStep('success');
      
      const loggedUser = {
        name: "Authorized Operator",
        email: email || "operator@agency.gov",
        department: "Urban Command",
        role: "Chief Urban Planner",
        joined: new Date().toLocaleDateString()
      };
      
      localStorage.setItem('bhavoraUser', JSON.stringify(loggedUser));
      addNotification({ title: 'Clearance Granted', message: `Secure session established`, severity: 'success' });
      
      setTimeout(() => {
        router.push('/overview');
      }, 500);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#0a0e14] text-white">
      
      {/* Left side: Cyber-physical visual */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 border-r border-[var(--slate-800)]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <UrbanCanvas />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/50 to-transparent z-10" />
        
        <div className="relative z-20 max-w-lg">
          <LogoLight size={32} />
          <h2 className="mt-8 text-3xl font-bold font-serif leading-tight">
            Terminal Access Restricted
          </h2>
          <p className="mt-4 text-[var(--slate-400)] text-sm font-mono leading-relaxed">
            &gt; WARNING: You are attempting to access a Level 4 restricted government asset. All actions are logged and audited by the Department of Urban Intelligence.
          </p>
          
          <div className="mt-12 flex gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[var(--accent-teal)]" size={20} />
              <span className="text-[10px] font-mono text-[var(--slate-500)] uppercase tracking-widest">SOC2 Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="text-[var(--accent-blue)]" size={20} />
              <span className="text-[10px] font-mono text-[var(--slate-500)] uppercase tracking-widest">E2E Encrypted</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="text-[var(--accent-teal)]" size={20} />
              <span className="text-[10px] font-mono text-[var(--slate-500)] uppercase tracking-widest">Live Telemetry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a0e14]">
        <div className="w-full max-w-md bg-[#0f141e] border border-[var(--slate-800)] p-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
          <div className="mb-10 text-center">
            <span className="text-[var(--accent-blue)] text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-[var(--accent-blue)]" /> 
              AUTHORIZATION REQUIRED
            </span>
            <h1 className="text-2xl font-bold font-serif mb-2">Establish Connection</h1>
            <p className="text-xs text-[var(--slate-500)] font-mono">
              Provide credentials to sync with the central node.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest mb-2 font-mono">Agency Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="operator@city.gov"
                className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono disabled:opacity-50" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-[var(--slate-500)] uppercase tracking-widest font-mono">Clearance Key</label>
                <a href="#" className="text-[10px] text-[var(--accent-blue)] hover:text-[var(--accent-blue-light)] font-mono uppercase tracking-widest">Forgot?</a>
              </div>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••••••"
                className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--accent-blue)] transition-colors font-mono disabled:opacity-50" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full text-[11px] uppercase tracking-widest font-bold py-4 transition-colors flex items-center justify-center gap-2 ${
                authStep === 'success' ? 'bg-[var(--accent-teal)] text-white' :
                'bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
              }`}
            >
              {authStep === 'verifying' && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {authStep === 'initial' ? 'Authenticate' : authStep === 'verifying' ? 'Verifying...' : 'Access Granted'}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--slate-800)]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-mono">
                <span className="px-4 bg-[#0f141e] text-[var(--slate-500)]">Enterprise SSO</span>
              </div>
            </div>

            <button 
              type="button" 
              disabled={isLoading}
              className="w-full bg-[var(--slate-900)] border border-[var(--slate-700)] hover:bg-[var(--slate-800)] text-white text-[11px] uppercase tracking-widest font-bold py-4 transition-colors disabled:opacity-50"
            >
              SSO Login
            </button>
          </form>

          <p className="mt-8 text-center text-[9px] text-[var(--slate-600)] font-mono max-w-xs mx-auto">
            Not authorized for platform access? Contact your department administrator to request clearance.
          </p>
        </div>
      </div>

    </div>
  );
}
