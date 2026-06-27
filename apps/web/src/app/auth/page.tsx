"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoIcon } from '@/components/ui/Logo';
import { useAppStore } from '@/stores';

type AuthMode = 'signin' | 'signup' | 'forgot';

export default function AuthPage() {
  const router = useRouter();
  const { addNotification } = useAppStore();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('BBMP / Urban Development Cell');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto redirect if already logged in
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
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      
      if (mode === 'forgot') {
        setMessage("Password reset instructions dispatched. Check your BBMP inbox.");
        addNotification({ title: 'Password Reset', message: `Instruction link sent to ${email}`, severity: 'info' });
        return;
      }

      // Basic local validation
      if (mode === 'signin' && email === 'unauthorized@bbmp.gov.in') {
        setErrorMsg("Authentication Failed: Account does not have active clearance.");
        addNotification({ title: 'Auth Failed', message: 'Clearance verification failure', severity: 'critical' });
        return;
      }

      const displayName = name.trim() || (email.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      const loggedUser = {
        name: displayName,
        email: email,
        department: department,
        role: mode === 'signin' ? "Chief Urban Planner" : "Node Planning Specialist",
        joined: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      };
      
      localStorage.setItem('bhavoraUser', JSON.stringify(loggedUser));
      addNotification({ title: 'Session Verified', message: `Welcome back, ${displayName}`, severity: 'success' });
      router.push('/overview');
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050A14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Background neon blobs */}
      <div style={{ position: 'absolute', top: '25%', left: '30%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0, 212, 255, 0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '25%', right: '30%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.04)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Main Glass Auth Card */}
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '32px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        zIndex: 5
      }}>
        
        {/* Brand System Info */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <LogoIcon size={36} />
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>BHAVORA OS</h2>
          <span style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Bhavishya City Intelligence Twin Portal
          </span>
        </div>

        {/* Message notification overlays */}
        {message && (
          <div style={{ padding: '10px 12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', fontSize: '11px', color: '#10B981', textAlign: 'center' }}>
            {message}
          </div>
        )}
        {errorMsg && (
          <div style={{ padding: '10px 12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', fontSize: '11px', color: '#EF4444', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Full Name */}
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Account Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Karan Sharma"
                className="input-dark"
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Departmental Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. planner@bbmp.gov.in"
              className="input-dark"
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          {/* Department Select */}
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Municipal Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-dark"
                style={{ width: '100%', fontSize: '13px', cursor: 'pointer' }}
              >
                <option value="BBMP / Urban Development Cell">BBMP / Urban Development</option>
                <option value="BESCOM / Grid Operations">BESCOM / Grid Operations</option>
                <option value="BWSSB / Water Management">BWSSB / Water Management</option>
                <option value="BMRCL / Mobility Strategy">BMRCL / Mobility Strategy</option>
              </select>
            </div>
          )}

          {/* Password */}
          {mode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Secure Password</label>
                {mode === 'signin' && (
                  <span
                    onClick={() => setMode('forgot')}
                    style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 600, cursor: 'pointer' }}
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
                className="input-dark"
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '10px', width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(135deg, #00D4FF, #0099CC)', color: '#050A14',
              fontSize: '13px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {isLoading ? 'Processing Access Request...' : mode === 'signin' ? 'Verify Clearance' : mode === 'signup' ? 'Request Credentials' : 'Send Instructions'}
          </button>
        </form>

        {/* Mode switcher footer */}
        <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
          {mode === 'signin' && (
            <span>
              New deployment planner?{' '}
              <span onClick={() => setMode('signup')} style={{ color: '#00D4FF', fontWeight: 600, cursor: 'pointer' }}>Request Access</span>
            </span>
          )}
          {mode === 'signup' && (
            <span>
              Already verified clearance?{' '}
              <span onClick={() => setMode('signin')} style={{ color: '#00D4FF', fontWeight: 600, cursor: 'pointer' }}>Verify Credentials</span>
            </span>
          )}
          {mode === 'forgot' && (
            <span onClick={() => setMode('signin')} style={{ color: '#00D4FF', fontWeight: 600, cursor: 'pointer' }}>Return to Sign In</span>
          )}
        </div>
      </div>
    </div>
  );
}
