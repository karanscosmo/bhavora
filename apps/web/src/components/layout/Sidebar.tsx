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
      <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--slate-800)] flex-shrink-0 bg-[var(--slate-950)]">
        <LogoIcon size={24} className="text-[var(--accent-blue)]" />
        <div className="flex flex-col">
          <div className="text-[14px] font-bold text-white tracking-tight leading-none mb-1">BHAVORA</div>
          <div className="text-[9px] text-[var(--accent-teal)] font-bold tracking-[0.15em] uppercase leading-none">Intelligence OS</div>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-6 custom-scrollbar">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--slate-500)] px-3 mb-2">
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                      isActive 
                        ? 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]' 
                        : 'text-[var(--slate-400)] hover:bg-[var(--slate-800)] hover:text-[var(--slate-200)]'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-[var(--accent-blue)]' : 'text-[var(--slate-500)] group-hover:text-[var(--slate-300)] transition-colors'} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Simulation Engine CTA */}
      <div className="p-4 border-t border-[var(--slate-800)] bg-[var(--slate-900)]">
        <Link href="/decision-twin" className="block p-4 rounded-xl bg-gradient-to-br from-[var(--slate-800)] to-[var(--slate-900)] border border-[var(--slate-700)] hover:border-[var(--accent-blue)]/50 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-[var(--accent-blue)]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--slate-300)]">Simulation Engine</span>
          </div>
          <p className="text-xs text-[var(--slate-500)] mb-3 leading-relaxed">
            Run predictive urban growth and policy models.
          </p>
          <div className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-[var(--accent-blue)] text-white text-[11px] font-bold group-hover:bg-[var(--accent-blue-hover)] transition-colors">
            <Play size={12} fill="currentColor" />
            Launch Simulator
          </div>
        </Link>
      </div>
    </aside>
  );
}
