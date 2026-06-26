import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { AICopilot } from '@/components/ui/AICopilot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <TopNav />
      <Sidebar />
      <main className="ml-64 mt-16 min-h-[calc(100vh-64px)] relative">
        {children}
        <AICopilot />
      </main>
    </div>
  );
}
