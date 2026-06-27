import React from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';

const AgentHub = dynamic(() => import('@/components/ui/AgentHub').then(m => ({ default: m.AgentHub })));
const Toast = dynamic(() => import('@/components/ui/Toast').then(m => ({ default: m.Toast })));

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', position: 'relative' }}>
      {/* Top Navigation Bar */}
      <TopNav />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main
        style={{
          marginLeft: '256px',
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </main>

      {/* AI Agent Hub FAB — portal renders on all pages */}
      <AgentHub />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}
