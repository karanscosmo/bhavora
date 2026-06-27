"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/ui/Logo';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Dummy submit
    setTimeout(() => {
      window.location.href = '/overview';
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
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[var(--border-subtle)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Full name
              </label>
              <input
                type="text"
                required
                className="form-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Organization Email
              </label>
              <input
                type="email"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="form-input"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
