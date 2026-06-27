"use client";

import React from 'react';
import { useAppStore } from '@/stores';

export function Toast() {
  const { toasts, dismissToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '360px',
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: 'var(--bg-surface-1)',
            border: `1px solid ${
              toast.severity === 'critical' ? 'var(--accent-red)' :
              toast.severity === 'warning' ? 'var(--accent-amber)' :
              toast.severity === 'success' ? 'var(--accent-teal)' :
              'var(--accent-blue)'
            }`,
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
            animation: 'slide-right 0.3s ease-out',
            cursor: 'pointer',
          }}
          onClick={() => dismissToast(toast.id)}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>
              {toast.severity === 'critical' ? '🔴' :
               toast.severity === 'warning' ? '🟡' :
               toast.severity === 'success' ? '✅' : 'ℹ️'}
            </span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {toast.message}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
