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
    <div className="bg-[var(--bg-base)] min-h-screen relative flex">
      {/* Sidebar - fixed left full height */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col lg:pl-[256px]">
        {/* Top Navigation Bar */}
        <TopNav />

        {/* Main content area */}
        <main
          className="flex-1 relative z-1 lg:mt-[64px] mt-[56px]"
        >
          {children}
        </main>
      </div>

      {/* AI Agent Hub FAB — portal renders on all pages */}
      <AgentHub />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}
