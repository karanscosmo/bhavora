"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogoDark } from '@/components/ui/Logo';
import { useAppStore, useCityDataStore, useSimulationStore } from '@/stores';

const SEARCH_ITEMS = [
  { name: 'Command Center Dashboard', type: 'Page', path: '/overview' },
  { name: 'City Twin GIS Map', type: 'Page', path: '/cities' },
  { name: 'Decision Twin Simulator', type: 'Page', path: '/decision-twin' },
  { name: 'Disaster Response Command', type: 'Page', path: '/disaster' },
  { name: 'Impact Analysis Matrix', type: 'Page', path: '/impact' },
  { name: 'AI Insights Feed', type: 'Page', path: '/insights' },
  { name: 'Analytics Suite', type: 'Page', path: '/analytics' },
  { name: 'Simulation Results', type: 'Page', path: '/simulation-results' },
  { name: 'Reports Center', type: 'Page', path: '/reports' },
  { name: 'Whitefield District', type: 'Zone', path: '/cities' },
  { name: 'Electronic City', type: 'Zone', path: '/cities' },
  { name: 'Koramangala', type: 'Zone', path: '/cities' },
  { name: 'Indiranagar', type: 'Zone', path: '/cities' },
  { name: 'Hebbal', type: 'Zone', path: '/cities' },
];

function numberFlip(value: number, unit: string): string {
  return `${value}${unit}`;
}

export function TopNav() {
  const router = useRouter();
  const { notifications, unreadCount, markRead } = useAppStore();
  const cityData = useCityDataStore();
  const sim = useSimulationStore();

  const [searchQ, setSearchQ] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [lastUpdatedSecs, setLastUpdatedSecs] = useState(0);

  // Live clock
  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  // "Updated Xs ago" counter
  useEffect(() => {
    const t = setInterval(() => {
      const diff = Math.floor((Date.now() - cityData.metrics.lastUpdated.getTime()) / 1000);
      setLastUpdatedSecs(diff);
    }, 1000);
    return () => clearInterval(t);
  }, [cityData.metrics.lastUpdated]);

  // Refresh metrics every 15s
  useEffect(() => {
    const t = setInterval(() => cityData.refreshMetrics(), 15000);
    return () => clearInterval(t);
  }, []);

  const filteredSearch = useMemo(() => {
    if (!searchQ.trim()) return [];
    const q = searchQ.toLowerCase();
    return SEARCH_ITEMS.filter(i => i.name.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQ]);

  const cityHealth = cityData.metrics.cityHealthScore;
  const healthColor = cityHealth >= 75 ? '#10B981' : cityHealth >= 55 ? '#F59E0B' : '#EF4444';
  const alertCount = unreadCount();

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      zIndex: 50,
      background: 'rgba(5,10,20,0.93)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'stretch',
    }}>
      {/* Logo zone (width matches sidebar) */}
      <div style={{
        width: '224px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '16px',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <LogoDark size={24} />
        </Link>
      </div>

      {/* Main header content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', gap: '16px' }}>

        {/* City Health Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 6px rgba(16,185,129,0.6)',
              display: 'inline-block',
              animation: 'live-pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#10B981' }}>Live</span>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginLeft: '4px' }}>{currentTime}</span>
          </div>

          {/* City Health Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>City Health</span>
            <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, color: healthColor }}>{cityHealth}/100</span>
          </div>

          {/* Key metrics in header */}
          <div style={{ display: 'flex', gap: '14px' }}>
            {[
              { label: 'AQI', value: cityData.metrics.aqi, unit: '' },
              { label: 'Traffic', value: cityData.metrics.congestionIndex, unit: '%' },
              { label: 'Grid', value: cityData.metrics.gridLoad.toFixed(1), unit: 'GW' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 600, color: '#00D4FF' }}>{m.value}{m.unit}</span>
              </div>
            ))}
          </div>

          {/* Updated X ago */}
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
            Updated {lastUpdatedSecs}s ago
          </span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flexShrink: 0, width: '280px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            padding: '7px 12px',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>⌕</span>
            <input
              value={searchQ}
              onChange={e => { setSearchQ(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 150)}
              placeholder="Search pages, districts..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'rgba(255,255,255,0.85)', fontSize: '12px', width: '100%',
              }}
            />
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em', flexShrink: 0 }}>⌘K</span>
          </div>
          {showSearch && filteredSearch.length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              background: '#0A1628', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', zIndex: 100,
            }}>
              {filteredSearch.map((item, i) => (
                <div
                  key={i}
                  onClick={() => { setSearchQ(''); setShowSearch(false); router.push(item.path); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', cursor: 'pointer', fontSize: '12px', color: 'rgba(255,255,255,0.8)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 100ms',
                  }}
                  className="hover:bg-[rgba(0,212,255,0.05)]"
                >
                  <span>{item.name}</span>
                  <span style={{ fontSize: '9px', color: '#00D4FF', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Alert count badge */}
          {alertCount > 0 && (
            <button
              onClick={() => setShowNotif(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px', borderRadius: '20px',
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                color: '#F59E0B', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              ⚠ {alertCount} Alerts
            </button>
          )}

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotif(v => !v)}
              style={{
                padding: '8px', borderRadius: '6px', background: 'transparent',
                border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                fontSize: '16px', transition: 'all 150ms', position: 'relative',
              }}
            >
              🔔
              {alertCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: '#EF4444', color: '#fff', fontSize: '8px',
                  fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #050A14',
                }}>{alertCount}</span>
              )}
            </button>
            {showNotif && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: '340px', background: '#0A1628',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', zIndex: 100,
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Alerts</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>City Intelligence</span>
                </div>
                {notifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    onClick={() => { markRead(n.id); setShowNotif(false); if (n.path) router.push(n.path); }}
                    style={{
                      padding: '11px 16px', cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      display: 'flex', gap: '10px', alignItems: 'flex-start',
                      background: !n.read ? 'rgba(0,212,255,0.02)' : 'transparent',
                    }}
                  >
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>
                      {n.severity === 'critical' ? '🔴' : n.severity === 'warning' ? '🟡' : n.severity === 'success' ? '✅' : '🔵'}
                    </span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: n.read ? 400 : 600, color: n.read ? 'rgba(255,255,255,0.5)' : '#fff' }}>{n.title}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{n.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfile(v => !v)}
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                border: 'none', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 700, color: '#050A14',
              }}
              aria-label="Profile menu"
            >
              R
            </button>
            {showProfile && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: '200px', background: '#0A1628',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', zIndex: 100,
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Rajesh Kumar</div>
                  <div style={{ fontSize: '11px', color: '#00D4FF', fontWeight: 500 }}>City Administrator</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>BBMP · Admin Role</div>
                </div>
                {[
                  { label: 'Profile Center', path: '/profile' },
                  { label: 'Saved Scenarios', path: '/scenarios' },
                  { label: 'Settings', path: '/settings' },
                  { label: 'Platform Info', path: '/platform' },
                ].map(item => (
                  <Link
                    key={item.label}
                    href={item.path}
                    onClick={() => setShowProfile(false)}
                    style={{
                      display: 'block', padding: '10px 16px', fontSize: '13px',
                      color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'all 120ms',
                    }}
                    className="hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => router.push('/auth')}
                  style={{
                    display: 'block', width: '100%', padding: '10px 16px',
                    fontSize: '13px', color: '#EF4444', textAlign: 'left',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                  }}
                  className="hover:bg-[rgba(239,68,68,0.06)]"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
