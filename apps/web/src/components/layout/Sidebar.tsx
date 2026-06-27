"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoIcon } from '@/components/ui/Logo';
import { BrandHeader } from '@/components/ui/BrandHeader';
import { LayoutDashboard, Map, AlertTriangle, Cpu, TrendingUp, Hexagon, Brain, BarChart3, FileText, FolderSync, Info, Settings, Play, LogOut, ShieldAlert, Activity } from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { name: 'Mayor Mode', path: '/mayor', icon: LayoutDashboard },
      { name: 'Command Center', path: '/overview', icon: Activity },
      { name: 'City Twin GIS', path: '/cities', icon: Map },
      { name: 'Disaster Response', path: '/disaster', icon: AlertTriangle },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'Decision Twin', path: '/decision-twin', icon: Cpu },
      { name: 'Safety Intelligence', path: '/safety', icon: ShieldAlert },
      { name: 'Simulation Results', path: '/simulation-results', icon: TrendingUp },
      { name: 'Impact Analysis', path: '/impact', icon: Hexagon },
      { name: 'AI Insights', path: '/insights', icon: Brain },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Analytics Suite', path: '/analytics', icon: BarChart3 },
      { name: 'Reports', path: '/reports', icon: FileText },
      { name: 'Policy War Room', path: '/war-room', icon: FolderSync },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Platform Info', path: '/platform', icon: Info },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bhavoraUser');
    }
    router.push('/auth/login');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-[var(--bg-surface-1)] border-r border-[var(--border-subtle)] flex flex-col z-40">
      <BrandHeader />

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div className="text-[10px] font-bold tracking-wider uppercase text-[var(--text-muted)] px-2 mb-2">
              {group.label}
            </div>
            <div className="flex flex-col gap-1">
              {group.items.map(item => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                      isActive 
                        ? 'bg-[var(--accent-primary-bg)] text-[var(--accent-primary)]' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Minimal CTA */}
      <div className="p-4 border-t border-[var(--border-subtle)] flex flex-col gap-2">
        <Link href="/scenario-builder" className="flex items-center justify-between p-3 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors group shadow-md mt-2">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-white" />
            <span className="text-[12px] font-bold tracking-wide">Launch Simulator</span>
          </div>
          <Play size={12} className="text-white group-hover:scale-110 transition-transform" />
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[#EF4444] transition-colors w-full text-left"
        >
          <LogOut size={14} />
          <span className="text-[12px] font-bold tracking-wide">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
