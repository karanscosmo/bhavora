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
            background: '#0A1628',
            border: `1px solid ${
              toast.severity === 'critical' ? 'rgba(239,68,68,0.4)' :
              toast.severity === 'warning' ? 'rgba(245,158,11,0.4)' :
              toast.severity === 'success' ? 'rgba(16,185,129,0.4)' :
              'rgba(0,212,255,0.2)'
            }`,
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
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
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                {toast.message}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
