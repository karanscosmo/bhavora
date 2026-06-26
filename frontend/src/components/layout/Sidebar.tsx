"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/overview', icon: 'dashboard' },
    { name: 'Platform Info', path: '/platform', icon: 'hub' },
    { name: 'Cities Twin', path: '/cities', icon: 'location_city' },
    { name: 'Decision Twin', path: '/decision-twin', icon: 'account_tree' },
    { name: 'Impact Analysis', path: '/impact', icon: 'donut_large' },
    { name: 'Saved Scenarios', path: '/scenarios', icon: 'folder_open' },
    { name: 'Simulation Results', path: '/simulation-results', icon: 'vital_signs' },
    { name: 'Disaster Mode', path: '/disaster', icon: 'warning' },
    { name: 'AI Insights', path: '/insights', icon: 'insights' },
    { name: 'Reports', path: '/reports', icon: 'description' },
    { name: 'Analytics', path: '/analytics', icon: 'bar_chart' },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 flex flex-col p-4 bg-surface border-r border-outline-variant/20 shadow-lg select-none">
      <div className="mb-4 px-2">
        <h2 className="text-on-surface font-headline-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">location_city</span>
          Decision Twin
        </h2>
        <p className="font-label-md text-on-surface-variant mt-1 opacity-70">Bengaluru Urban</p>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-1 pr-1 pb-4">
        {navItems.map((item) => {
          // Check active state
          const isActive = pathname === item.path || 
            (item.path === '/cities' && pathname === '/twin') ||
            (item.path === '/decision-twin' && pathname === '/scenario-builder');
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-[13px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-2 border-t border-outline-variant/10">
        <div className="p-3 bg-primary rounded-xl text-on-primary">
          <p className="font-label-md mb-1 text-[11px] font-semibold uppercase tracking-wider">Simulation Engine</p>
          <p className="text-[10px] opacity-80 mb-3 leading-snug">Run urban growth models for 2035 predictions.</p>
          <Link href="/decision-twin">
            <button className="w-full bg-white text-primary font-bold py-1.5 px-3 rounded-lg text-xs hover:bg-white/95 active:scale-95 transition-all">
              Run Simulation
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}

