"use client";

import React from 'react';
import { useSimulationStore } from '@/stores';
import { TrendingUp, Users, DollarSign, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockApprovalData = [
  { month: 'Jan', approval: 45 },
  { month: 'Feb', approval: 47 },
  { month: 'Mar', approval: 52 },
  { month: 'Apr', approval: 48 },
  { month: 'May', approval: 55 },
  { month: 'Jun', approval: 62 },
];

export default function MayorModePage() {
  const store = useSimulationStore();
  const { results } = store;

  const approvalRating = 62 + (results.gdp.delta > 0 ? 5 : -5) + (results.traffic.delta < 0 ? 8 : -8);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b border-[var(--border-subtle)] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Mayor's Executive Dashboard</h1>
          <p className="text-[var(--text-secondary)]">High-level public sentiment and systemic health overview.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/war-room" className="btn btn-secondary">Open Policy War Room</Link>
          <button className="btn btn-primary" onClick={() => window.print()}>Export Briefing</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-4">
            <Users size={32} className="text-[#3B82F6]" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Public Approval</h3>
          <div className="text-5xl font-black text-[var(--text-primary)]">{approvalRating.toFixed(0)}%</div>
          <div className="text-sm text-[#10B981] font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={16}/> +14% since taking office
          </div>
        </div>

        <div className="p-6 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4">
            <Activity size={32} className="text-[#10B981]" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">City Health Index</h3>
          <div className="text-5xl font-black text-[var(--text-primary)]">{results.cityHealth.after.toFixed(0)}/100</div>
          <div className="text-sm text-[var(--text-secondary)] font-medium mt-2">
            Based on Traffic, AQI, Water & Energy
          </div>
        </div>

        <div className="p-6 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mb-4">
            <DollarSign size={32} className="text-[#F59E0B]" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Budget Surplus/Deficit</h3>
          <div className="text-4xl font-black text-[#10B981]">+₹450 Cr</div>
          <div className="text-sm text-[var(--text-secondary)] font-medium mt-2">
            Projected End of Fiscal Year
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Approval Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockApprovalData}>
                <defs>
                  <linearGradient id="colorApproval" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="approval" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorApproval)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Top Citizen Grievances</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <AlertCircle className="text-[#EF4444] shrink-0" />
                <div>
                  <div className="font-bold text-[var(--text-primary)] text-sm">Potholes on ORR (Sector 4)</div>
                  <div className="text-xs text-[var(--text-secondary)]">2,450 active complaints in Sahaya app.</div>
                </div>
              </li>
              <li className="flex gap-4">
                <AlertCircle className="text-[#F59E0B] shrink-0" />
                <div>
                  <div className="font-bold text-[var(--text-primary)] text-sm">Water Shortage in Whitefield</div>
                  <div className="text-xs text-[var(--text-secondary)]">Dependent on tankers; Cauvery Stage V delay cited.</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Key Achievements</h3>
            <ul className="space-y-4">
              <li className="flex gap-4 items-center">
                <CheckCircle2 className="text-[#10B981] shrink-0" />
                <div className="font-bold text-[var(--text-primary)] text-sm">Metro Purple Line Extended</div>
              </li>
              <li className="flex gap-4 items-center">
                <CheckCircle2 className="text-[#10B981] shrink-0" />
                <div className="font-bold text-[var(--text-primary)] text-sm">200 New Electric Buses Deployed</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
