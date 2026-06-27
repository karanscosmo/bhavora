import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { UrbanCanvas } from '@/components/ui/UrbanCanvas';
import { AgentHub } from '@/components/ui/AgentHub';
import { Toast } from '@/components/ui/Toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: '#050A14', minHeight: '100vh', position: 'relative' }}>
      {/* 5-layer animated canvas background */}
      <UrbanCanvas />

      {/* Top Navigation Bar */}
      <TopNav />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main
        style={{
          marginLeft: '224px',
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
