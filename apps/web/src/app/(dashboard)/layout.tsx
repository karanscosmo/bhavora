"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { useUIStore } from '@/stores';

const BhavishyavaniPanel = dynamic(() => import('@/components/ui/BhavishyavaniPanel').then(m => ({ default: m.BhavishyavaniPanel })));
const Toast = dynamic(() => import('@/components/ui/Toast').then(m => ({ default: m.Toast })));

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isBhavishyavaniOpen } = useUIStore();

  return (
    <div className="bg-[var(--bg-base)] min-h-screen relative flex overflow-hidden">
      {/* Sidebar - fixed left full height */}
      <div className="hidden lg:block w-[280px] shrink-0">
        <Sidebar />
      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isBhavishyavaniOpen ? 'lg:pr-[400px]' : ''}`}>
        {/* Top Navigation Bar */}
        <TopNav />

        {/* Main content area */}
        <main
          className="flex-1 relative z-1 mt-[64px] overflow-auto"
        >
          {children}
        </main>
      </div>

      {/* Bhavishyavani AI Copilot — persistent right side */}
      <BhavishyavaniPanel />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}
