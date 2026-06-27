import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { OperationsAgent } from '@/components/ui/OperationsAgent';
import { BackgroundParticles } from '@/components/ui/BackgroundParticles';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-transparent text-on-surface min-h-screen relative">
      <BackgroundParticles />
      <TopNav />
      <Sidebar />
      <main className="ml-64 mt-16 min-h-[calc(100vh-64px)] relative">
        {children}
        <OperationsAgent />
      </main>
    </div>
  );
}
