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
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[var(--bg-surface-1)] border-r border-[var(--border-subtle)] flex flex-col z-40">
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-[var(--border-subtle)] flex-shrink-0">
        <LogoIcon size={24} className="text-[var(--accent-primary)]" />
        <div className="flex flex-col justify-center">
          <div className="text-[14px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-[2px]">Bhavora OS</div>
          <div className="text-[9px] text-[var(--text-muted)] font-semibold tracking-wider uppercase leading-none">Command Center</div>
        </div>
      </div>

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
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <Link href="/decision-twin" className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-colors group">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-[var(--text-primary)]" />
            <span className="text-[12px] font-semibold text-[var(--text-primary)]">Simulator</span>
          </div>
          <Play size={12} className="text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
        </Link>
      </div>
    </aside>
  );
}
