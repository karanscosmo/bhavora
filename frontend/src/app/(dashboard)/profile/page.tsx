"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  department: string;
  role: string;
  joined: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user] = useState<UserProfile>(() => {
    const defaultAdmin = {
      name: "Karan Sharma",
      email: "karan.sharma@bbmp.gov.in",
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
      // Simulate session expiry
      sessionStorage.removeItem('simulationResults');
    }
    router.push('/auth');
  };

  if (!user) return null;

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-on-surface-variant text-label-md mb-2">
          <span>Identity Center</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">User Profile</span>
        </nav>
        <h1 className="font-display-sm text-display-sm text-on-surface">Member Profile</h1>
        <p className="text-on-surface-variant font-body-md max-w-xl">
          Account details, permissions tiers, and authentication configurations.
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[320px]">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center border-4 border-white shadow-md text-primary font-bold text-4xl mb-4 select-none">
              KS
            </div>
            <h2 className="text-lg font-bold text-on-surface">{user.name}</h2>
            <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">{user.role}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{user.department}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-6 w-full py-2.5 bg-error text-white rounded-xl text-xs font-bold hover:bg-error/95 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-error/10"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out
          </button>
        </div>

        <div className="lg:col-span-8 bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/10 pb-3">Account Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Email Address</p>
              <p className="font-semibold text-on-surface text-sm">{user.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Date Joined</p>
              <p className="font-semibold text-on-surface text-sm">{user.joined}</p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Node Permissions Tier</p>
              <p className="font-semibold text-on-surface text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                Administrator Level (Root Node)
              </p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Subscribed Node Limits</p>
              <p className="font-semibold text-on-surface text-sm">Unlimited Sim Credits</p>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/10">
            <h4 className="font-bold text-on-surface text-xs mb-3">Assigned Security Groups</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-semibold uppercase">BBMP-Wards</span>
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-semibold uppercase">Smart-City-Task-Force</span>
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-semibold uppercase">Simulation-Lead-Write</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
