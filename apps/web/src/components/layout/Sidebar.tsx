"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoIcon } from '@/components/ui/Logo';
import { LayoutDashboard, Map, AlertTriangle, Cpu, TrendingUp, Hexagon, Brain, BarChart3, FileText, FolderSync, Info, Settings, Play } from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { name: 'Command Center', path: '/overview', icon: LayoutDashboard },
      { name: 'City Twin GIS', path: '/cities', icon: Map },
      { name: 'Disaster Response', path: '/disaster', icon: AlertTriangle },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'Decision Twin', path: '/decision-twin', icon: Cpu },
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
      { name: 'Scenario Vault', path: '/scenarios', icon: FolderSync },
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

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[256px] bg-[var(--slate-900)] border-r border-[var(--slate-800)] flex flex-col z-40">
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-[var(--slate-800)] flex-shrink-0 bg-[var(--slate-950)]">
        <LogoIcon size={20} className="text-[var(--accent-blue)]" />
        <div className="flex flex-col justify-center">
          <div className="text-[13px] font-bold text-white tracking-tight leading-none mb-[3px]">BHAVORA</div>
          <div className="text-[8px] text-[var(--accent-teal)] font-bold tracking-[0.15em] uppercase leading-none">Intelligence OS</div>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-4 custom-scrollbar">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[var(--slate-500)] px-2 mb-1.5">
              {group.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-3 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 group ${
                      isActive 
                        ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]' 
                        : 'text-[var(--slate-400)] hover:bg-[var(--slate-800)] hover:text-[var(--slate-200)]'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-[var(--accent-blue)]' : 'text-[var(--slate-500)] group-hover:text-[var(--slate-300)] transition-colors'} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Simulation Engine CTA */}
      <div className="p-3 border-t border-[var(--slate-800)] bg-[var(--slate-900)]">
        <Link href="/decision-twin" className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-[var(--slate-800)] to-[var(--slate-900)] border border-[var(--slate-700)] hover:border-[var(--accent-blue)]/50 transition-colors group">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-[var(--accent-blue)]" />
            <span className="text-[11px] font-bold text-[var(--slate-200)]">Simulator</span>
          </div>
          <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--accent-blue)] text-white group-hover:bg-[var(--accent-blue-hover)] transition-colors">
            <Play size={10} fill="currentColor" />
          </div>
        </Link>
      </div>
    </aside>
  );
}
