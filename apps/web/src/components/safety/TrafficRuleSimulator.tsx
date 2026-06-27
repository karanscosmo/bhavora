import React, { useState } from 'react';
import { Play, TrendingDown, TrendingUp, AlertCircle, Ban, Clock, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '@/stores';

const RULES = [
  { id: 'odd-even', name: 'Odd-Even Scheme', icon: <Car size={16}/>, description: 'Alternate day driving based on license plate.' },
  { id: 'truck-ban', name: 'Peak Hour Truck Ban', icon: <Ban size={16}/>, description: 'Restrict heavy vehicles during 8AM-11AM & 5PM-8PM.' },
  { id: 'congestion-pricing', name: 'CBD Congestion Pricing', icon: <AlertCircle size={16}/>, description: '₹50 toll for entering Central Business District.' },
  { id: 'school-zones', name: 'School Zone Speed Limits', icon: <Clock size={16}/>, description: 'Strict 20km/h limits around all schools.' }
];

export function TrafficRuleSimulator() {
  const { activeTrafficRule, setActiveTrafficRule } = useSimulationStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSimulate = (ruleId: string) => {
    setActiveTrafficRule(ruleId);
    setIsSimulating(true);
    setResults(null);

    // Mock simulation delay
    setTimeout(() => {
      setIsSimulating(false);
      
      // Generate deterministic mock results based on rule ID
      if (ruleId === 'odd-even') {
        setResults({ traffic: -18, pollution: -12, backlash: 85, revenue: -2 });
      } else if (ruleId === 'truck-ban') {
        setResults({ traffic: -8, pollution: -5, backlash: 30, revenue: -15 });
      } else if (ruleId === 'congestion-pricing') {
        setResults({ traffic: -25, pollution: -18, backlash: 95, revenue: 450 });
      } else {
        setResults({ traffic: -2, pollution: -1, backlash: 15, revenue: 0 });
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      
      <div className="space-y-3">
        {RULES.map(rule => (
          <div 
            key={rule.id}
            onClick={() => !isSimulating && handleSimulate(rule.id)}
            className={`p-4 border rounded-xl cursor-pointer transition-all ${
              activeTrafficRule === rule.id 
                ? 'bg-[#2563EB]/10 border-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                : 'bg-white border-[var(--border-subtle)] hover:border-[#2563EB]/50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                <div className={`p-1.5 rounded-lg ${activeTrafficRule === rule.id ? 'bg-[#2563EB] text-white' : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)]'}`}>
                  {rule.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{rule.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{rule.description}</p>
                </div>
              </div>
              
              {activeTrafficRule === rule.id && isSimulating && (
                <div className="mt-3 flex items-center justify-center py-2 bg-[var(--slate-100)] rounded text-[10px] text-[var(--slate-500)] font-bold tracking-widest uppercase">
                  <span className="animate-pulse flex items-center gap-2">
                    <Play size={10} /> Simulating AI Impacts...
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] ml-9">{rule.description}</p>
          </div>
        ))}
      </div>

      {results && !isSimulating && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-[var(--bg-surface-2)] rounded-xl border border-[var(--border-subtle)]"
        >
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Simulation Results (1-Year Horizon)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase block mb-1">Traffic Volume</span>
              <div className="flex items-center gap-1.5 font-bold text-[#10B981]">
                <TrendingDown size={16} /> {results.traffic}%
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase block mb-1">Pollution (AQI)</span>
              <div className="flex items-center gap-1.5 font-bold text-[#10B981]">
                <TrendingDown size={16} /> {results.pollution}%
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase block mb-1">Public Backlash Risk</span>
              <div className={`flex items-center gap-1.5 font-bold ${results.backlash > 70 ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                <AlertCircle size={16} /> {results.backlash}%
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase block mb-1">Economic Impact</span>
              <div className={`flex items-center gap-1.5 font-bold ${results.revenue > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {results.revenue > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {results.revenue > 0 ? `+₹${results.revenue}Cr` : `${results.revenue}%`}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
