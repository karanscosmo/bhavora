'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { useUIStore } from '@/stores';
import { DemoProvider, useDemo } from '@/lib/demo/DemoContext';

const BhavishyavaniPanel = dynamic(() => import('@/components/ui/BhavishyavaniPanel').then(m => ({ default: m.BhavishyavaniPanel })));
const Toast = dynamic(() => import('@/components/ui/Toast').then(m => ({ default: m.Toast })));
const DemoOverlay = dynamic(() => import('@/components/demo/DemoOverlay').then(m => ({ default: m.DemoOverlay })), { ssr: false });
const DemoModal = dynamic(() => import('@/components/demo/DemoModal').then(m => ({ default: m.DemoModal })), { ssr: false });

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { isBhavishyavaniOpen } = useUIStore();
  const { state: demoState } = useDemo();
  const isDemoMode = demoState.status !== 'idle';

  return (
    <div className="bg-[var(--bg-base)] min-h-screen relative flex overflow-hidden">
      {/* Sidebar - fixed left full height */}
      <div className="hidden lg:block w-[280px] shrink-0">
        <Sidebar />
      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isBhavishyavaniOpen ? 'lg:pr-[400px]' : ''}`}>
        {/* Top Navigation Bar */}
        <TopNav />

        {/* Main content area — pb-20 prevents demo bar overlap */}
        <main className={`flex-1 relative z-1 mt-[64px] overflow-auto ${isDemoMode ? 'pb-20' : ''}`}>
          {children}
        </main>
      </div>

      {/* Bhavishyavani AI Copilot — persistent right side */}
      <BhavishyavaniPanel />

      {/* Toast Notifications */}
      <Toast />

      {/* Demo System */}
      <DemoModal />
      <DemoOverlay />
    </div>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoProvider>
      <DashboardInner>
        {children}
      </DashboardInner>
    </DemoProvider>
  );
}
