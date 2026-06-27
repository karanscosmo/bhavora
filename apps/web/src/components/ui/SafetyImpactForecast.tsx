import React from 'react';
import { ShieldAlert, Activity, AlertTriangle, Car, User } from 'lucide-react';
import type { SafetyMetrics, MetricResult } from '@/lib/simulation';

interface SafetyImpactForecastProps {
  safety: SafetyMetrics;
}

function MetricRow({ label, metric, icon: Icon, inverseGood = false }: { label: string, metric: MetricResult, icon: any, inverseGood?: boolean }) {
  const isGood = inverseGood ? metric.delta <= 0 : metric.delta >= 0;
  const isNeutral = metric.delta === 0;
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-subtle)] bg-white/50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md ${isNeutral ? 'bg-gray-100 text-gray-500' : isGood ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          <Icon size={16} />
        </div>
        <div className="text-sm font-bold text-[var(--text-primary)]">{label}</div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-mono font-bold text-base text-[var(--text-primary)]">
          {metric.after} <span className="text-[10px] text-[var(--text-secondary)] font-sans">{metric.unit}</span>
        </div>
        {!isNeutral && (
          <div className={`text-[10px] font-bold ${isGood ? 'text-green-600' : 'text-red-600'}`}>
            {metric.delta > 0 ? '+' : ''}{metric.delta}
          </div>
        )}
      </div>
    </div>
  );
}

export function SafetyImpactForecast({ safety }: SafetyImpactForecastProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold text-[var(--slate-400)] uppercase tracking-wider flex items-center gap-2">
        <ShieldAlert size={14} /> Safety Impact Forecast
      </h3>
      <div className="flex flex-col gap-2">
        <MetricRow 
          label="Predicted Accidents" 
          metric={safety.accidentsPerYear} 
          icon={Car} 
          inverseGood 
        />
        <MetricRow 
          label="Response Time" 
          metric={safety.emergencyResponseTime} 
          icon={Activity} 
          inverseGood 
        />
        <MetricRow 
          label="Pedestrian Safety" 
          metric={safety.pedestrianSafetyScore} 
          icon={User} 
        />
        <MetricRow 
          label="Intersection Risk" 
          metric={safety.intersectionRiskScore} 
          icon={AlertTriangle} 
          inverseGood 
        />
      </div>
    </div>
  );
}
