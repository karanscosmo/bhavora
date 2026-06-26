"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/overview', icon: 'dashboard' },
    { name: 'Bengaluru Twin', path: '/twin', icon: 'location_city' },
    { name: 'Scenario Builder', path: '/scenario-builder', icon: 'account_tree' },
    { name: 'Simulations', path: '/simulation-results', icon: 'vital_signs' },
    { name: 'Disaster Mode', path: '/disaster', icon: 'warning' },
    { name: 'Insights', path: '/insights', icon: 'insights' },
    { name: 'Reports', path: '/reports', icon: 'analytics' }
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 flex flex-col p-4 bg-surface border-r border-outline-variant/20 shadow-lg">
      <div className="mb-8 px-2">
        <h2 className="text-on-surface font-headline-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">location_city</span>
          Decision Twin
        </h2>
        <p className="font-label-md text-on-surface-variant mt-1 opacity-70">Bengaluru Urban</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 bg-primary rounded-xl text-on-primary">
        <p className="font-label-md mb-2">Simulation Engine</p>
        <p className="text-[11px] opacity-80 mb-4">Run urban growth models for 2030 predictions.</p>
        <Link href="/scenario-builder">
          <button className="w-full bg-white text-primary font-bold py-2 px-4 rounded-lg text-sm active:scale-95 transition-transform">
            Run Simulation
          </button>
        </Link>
      </div>
    </aside>
  );
}
