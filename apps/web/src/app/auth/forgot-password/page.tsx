"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setSent(true);
      setIsLoading(false);
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
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
          Or{' '}
          <Link href="/auth/login" className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]">
            return to sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[var(--border-subtle)]">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--accent-success)]/10 mb-4">
                <svg className="h-6 w-6 text-[var(--accent-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[var(--text-primary)]">Check your email</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                We&apos;ve sent a password reset link to your email address.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@agency.gov"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
