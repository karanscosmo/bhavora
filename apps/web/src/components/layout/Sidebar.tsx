"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoIcon } from '@/components/ui/Logo';

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { name: 'Command Center', path: '/overview', emoji: '⊞' },
      { name: 'City Twin GIS', path: '/cities', emoji: '🏙' },
      { name: 'Disaster Response', path: '/disaster', emoji: '⚠' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'Decision Twin', path: '/decision-twin', emoji: '⚙' },
      { name: 'Simulation Results', path: '/simulation-results', emoji: '📈' },
      { name: 'Impact Analysis', path: '/impact', emoji: '⬡' },
      { name: 'AI Insights', path: '/insights', emoji: '🧠' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Analytics Suite', path: '/analytics', emoji: '◈' },
      { name: 'Reports', path: '/reports', emoji: '📄' },
      { name: 'Scenario Vault', path: '/scenarios', emoji: '📁' },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Platform Info', path: '/platform', emoji: 'ℹ' },
      { name: 'Settings', path: '/settings', emoji: '◎' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: '64px',
        height: 'calc(100vh - 64px)',
        width: collapsed ? '56px' : '256px',
        background: 'var(--bg-surface-2)',
        borderRight: '1px solid var(--border-subtle)',
        backdropFilter: 'none',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 200ms ease',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minHeight: '52px',
        overflow: 'hidden',
      }}>
        <LogoIcon size={28} />
        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>BHAVORA</div>
            <div style={{ fontSize: '8px', color: 'var(--accent-blue)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Urban Intelligence OS</div>
          </div>
        )}
      </div>

      {/* Nav Groups */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <div style={{
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                padding: '0 6px',
                marginBottom: '3px',
              }}>
                {group.label}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {group.items.map(item => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    title={collapsed ? item.name : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: collapsed ? '8px 14px' : '7px 9px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 120ms ease',
                      background: isActive ? 'var(--accent-navy-light)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--accent-navy)' : '2px solid transparent',
                      color: isActive ? 'var(--accent-navy)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '13px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontSize: '14px', flexShrink: 0, width: '18px', textAlign: 'center', opacity: isActive ? 1 : 0.7 }}>
                      {item.emoji}
                    </span>
                    {!collapsed && (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Simulation CTA */}
      {!collapsed && (
        <div style={{ padding: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <Link href="/decision-twin" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--accent-navy-light)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-navy)', marginBottom: '3px' }}>
                Simulation Engine
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '8px' }}>
                Run urban growth models
              </div>
              <div style={{
                padding: '5px 10px',
                background: 'var(--accent-navy)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '4px',
                textAlign: 'center',
              }}>
                Run Simulation
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          position: 'absolute',
          top: '70px',
          right: '-11px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-normal)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          cursor: 'pointer',
          zIndex: 50,
          transition: 'all 150ms',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '›' : '‹'}
      </button>
    </aside>
  );
}
