"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoIcon } from '@/components/ui/Logo';
import { useAppStore, useAgentStore } from '@/stores';

export default function LoginPage() {
  const router = useRouter();
  const { addNotification } = useAppStore();
  const { clearAllConversations } = useAgentStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    setTimeout(() => {
      const loggedUser = {
        name: "Authorized Operator",
        email: email || "operator@agency.gov",
        department: "Urban Command",
        role: "Chief Urban Planner",
        joined: new Date().toLocaleDateString()
      };
      
      localStorage.setItem('bhavoraUser', JSON.stringify(loggedUser));
      clearAllConversations();
      addNotification({ title: 'Authentication Successful', message: `Welcome back, ${loggedUser.name}`, severity: 'success' });
      
      router.push('/overview');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-surface-2)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <LogoIcon size={40} />
          </Link>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-[var(--text-primary)]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
          Or{' '}
          <Link href="/auth/signup" className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]">
            start your 14-day free trial
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[var(--border-subtle)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@agency.gov"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] border-[var(--border-subtle)] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--text-secondary)]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-subtle)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[var(--text-muted)]">
                  Enterprise Access
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-[var(--border-subtle)] rounded-md shadow-sm bg-white text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]">
                <span className="sr-only">Sign in with SSO</span>
                Sign in with SSO (SAML)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
