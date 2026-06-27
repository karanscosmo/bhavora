"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type AuthMode = 'signin' | 'signup' | 'forgot';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('BBMP / Urban Development Cell');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // If already logged in, route to dashboard overview
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
    setMessage('');

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signin') {
        const loggedUser = {
          name: name || "Karan Sharma",
          email: email || "karan.sharma@bbmp.gov.in",
          department: department,
          role: "Chief Urban Planner",
          joined: "June 2026"
        };
        localStorage.setItem('bhavoraUser', JSON.stringify(loggedUser));
        router.push('/overview');
      } else if (mode === 'signup') {
        const newUser = {
          name: name || "New Urban Planner",
          email: email,
          department: department,
          role: "Planner Node Admin",
          joined: "June 2026"
        };
        localStorage.setItem('bhavoraUser', JSON.stringify(newUser));
        router.push('/overview');
      } else {
        setMessage("Password reset instructions dispatched. Check your BBMP inbox.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center px-6 relative select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 animate-scale-in">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md">B</div>
            <span className="text-xl font-extrabold tracking-tight">BHAVORA</span>
          </Link>
          <p className="text-xs text-white/40 font-medium">Bhavishya City Intelligence Twin Portal</p>
        </div>

        {/* Status messages */}
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-2.5 rounded-xl text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign Up and Sign In Live name helper) */}
          {(mode === 'signup' || mode === 'signin') && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Account Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Karan Sharma"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-white/20"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Departmental Email</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="karan.sharma@bbmp.gov.in"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-white/20"
            />
          </div>

          {/* Department Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Municipal Department</label>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#131929] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none cursor-pointer text-white/80"
              >
                <option value="BBMP / Urban Development Cell">BBMP / Urban Dev</option>
                <option value="BESCOM / Grid Operations">BESCOM / Grid Ops</option>
                <option value="BWSSB / Water Management">BWSSB / Water Dev</option>
              </select>
            </div>
          )}

          {/* Password Field (Sign In and Sign Up) */}
          {mode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Secure Password</label>
                {mode === 'signin' && (
                  <span 
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </span>
                )}
              </div>
              <input 
                type="password" 
                required
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-white/20"
              />
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/25 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {mode === 'signin' ? 'Sign In to Node' : mode === 'signup' ? 'Create Administrator Account' : 'Dispatch Recovery Link'}
          </button>
        </form>

        {/* Footer toggles */}
        <div className="text-center text-xs text-white/40 font-medium">
          {mode === 'signin' ? (
            <p>
              Requesting new admin access?{" "}
              <span onClick={() => setMode('signup')} className="text-blue-400 font-bold hover:underline cursor-pointer">Register Node</span>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <span onClick={() => setMode('signin')} className="text-blue-400 font-bold hover:underline cursor-pointer">Sign In</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
