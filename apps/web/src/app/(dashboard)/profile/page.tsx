"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, LogOut, User, Shield, ShieldAlert, History, Key, BarChart3, Database } from 'lucide-react';
import { useAppStore } from '@/stores';

interface UserProfile {
  name: string;
  email: string;
  department: string;
  role: string;
  joined: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'rbac' | 'audit' | 'session' | 'credits' | 'security'>('profile');

  const [user] = useState<UserProfile>(() => {
    const defaultAdmin = {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@bbmp.gov.in",
      department: "BBMP / Urban Development Cell",
      role: "Chief Urban Planner",
      joined: "October 2024"
    };
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('bhavoraUser');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.setItem('bhavoraUser', JSON.stringify(defaultAdmin));
    }
    return defaultAdmin;
  });

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bhavoraUser');
    }
    addNotification({ title: 'Signed Out', message: 'You have been securely signed out of Bhavora', severity: 'info' });
    router.push('/auth');
  };

  if (!user) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div>
        <nav style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
          <span>Identity Center</span>
          <ChevronRight style={{ display: 'inline', width: '12px', height: '12px', verticalAlign: 'middle', margin: '0 4px' }} />
          <span style={{ color: '#00D4FF', fontWeight: 600 }}>User Profile</span>
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>Identity Center</h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
          Manage user profiles, permission tiers, audit logs, and security groups.
        </p>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px', alignItems: 'start' }}>
        
        {/* Left Side: Avatar Card & Tab Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Avatar Card */}
          <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 700, color: '#050A14', marginBottom: '12px'
            }}>
              RK
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>{user.name}</h3>
            <span style={{ fontSize: '10px', color: '#00D4FF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{user.role}</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{user.department}</span>

            <button
              onClick={handleLogout}
              style={{
                marginTop: '16px', width: '100%', padding: '8px', borderRadius: '6px', border: 'none',
                background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '12px', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Navigation Menu (6 Tabs) */}
          <div className="glass-card" style={{ padding: '8px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {[
              { id: 'profile', label: 'Account Profile', icon: <User size={14} /> },
              { id: 'rbac', label: 'Roles & Permissions', icon: <Shield size={14} /> },
              { id: 'audit', label: 'Audit Log', icon: <History size={14} /> },
              { id: 'session', label: 'Active Session', icon: <Key size={14} /> },
              { id: 'credits', label: 'Sim Credit Usage', icon: <BarChart3 size={14} /> },
              { id: 'security', label: 'Security Groups', icon: <Database size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px',
                  border: 'none', cursor: 'pointer', fontSize: '12px', textAlign: 'left',
                  background: activeTab === tab.id ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                  color: activeTab === tab.id ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  transition: 'all 120ms',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Tab Panel Content */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', minHeight: '360px', background: 'rgba(10,22,40,0.85)' }}>
          
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', margin: 0 }}>
                Account Profile Settings
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Name', value: user.name },
                  { label: 'Email', value: user.email },
                  { label: 'Department', value: user.department },
                  { label: 'Joined', value: user.joined },
                ].map(item => (
                  <div key={item.label} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '3px' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rbac' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', margin: 0 }}>
                Role Based Access Control (RBAC)
              </h3>
              <div style={{ padding: '14px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '18px' }}>🛡</span>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  Your account is assigned the <strong style={{ color: '#10B981' }}>Administrator Level (Root Node)</strong> permission tier.
                </div>
              </div>
              
              {/* Permission Matrix */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { label: 'Simulation execution', granted: true },
                  { label: 'Scenario saving & export', granted: true },
                  { label: 'Disaster command override', granted: true },
                  { label: 'Platform configuration editing', granted: false },
                ].map(p => (
                  <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '12px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{p.label}</span>
                    <span style={{ color: p.granted ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                      {p.granted ? '✓ Granted' : '× Denied'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', margin: 0 }}>
                Recent Security Audit Logs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { time: 'Today, 10:14', action: 'Executed Simulation Policy Adjustment', details: 'Metro +20%, EV +15%' },
                  { time: 'Yesterday, 16:42', action: 'Saved Scenario to Vault', details: 'Title: "ECity Smart Grid 2030"' },
                  { time: 'Yesterday, 14:05', action: 'Activated Emergency Flood Protocol', details: 'Bellandur Basin Zone' },
                  { time: 'Oct 24, 2024', action: 'Account Created', details: 'Welcome to Bhavora OS' },
                ].map((log, idx) => (
                  <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{log.action}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{log.details}</div>
                    </div>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'session' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', margin: 0 }}>
                Active Session Specifications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Session Token Status', value: 'Active', color: '#10B981' },
                  { label: 'Token Lifespan Remaining', value: '18h 42m', color: '#fff' },
                  { label: 'Browser Session ID', value: 'sess_rk_948192a838bc', color: 'rgba(255,255,255,0.5)' },
                  { label: 'Client IP Address', value: '122.167.92.14', color: '#fff' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: item.color, marginTop: '3px', fontFamily: 'monospace' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'credits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', margin: 0 }}>
                Sim Credit Usage Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center' }}>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Credits remaining</span>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#10B981', marginTop: '6px', fontFamily: 'monospace' }}>UNLIMITED</div>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Simulations Run (Current billing)</span>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#00D4FF', marginTop: '6px', fontFamily: 'monospace' }}>142 / 500</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', margin: 0 }}>
                Assigned Security Groups
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>
                These are authorization groups that grant write or read rights to municipal systems:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  'BBMP-Wards-Write',
                  'Smart-City-Taskforce-Override',
                  'Simulation-Model-Write-Root',
                  'BESCOM-Substation-Telemetry-Read',
                  'Traffic-Signal-Controller-Write'
                ].map(group => (
                  <span key={group} style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', fontSize: '10px', color: '#00D4FF', fontWeight: 600 }}>
                    {group}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
