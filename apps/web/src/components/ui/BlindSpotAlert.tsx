import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Info } from 'lucide-react';
import type { BlindSpot } from '@/lib/simulation';

interface BlindSpotAlertProps {
  blindSpots: BlindSpot[];
}

export function BlindSpotAlert({ blindSpots }: BlindSpotAlertProps) {
  if (!blindSpots || blindSpots.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-bold text-[var(--slate-400)] uppercase tracking-wider flex items-center gap-2">
        <ShieldAlert size={14} className="text-[#F59E0B]" /> Policy Blind Spots Detected
      </h3>
      
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {blindSpots.map((spot, i) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.15 }}
              className="bg-[var(--bg-surface-2)] border border-[#F59E0B]/30 rounded-lg p-4 shadow-[0_4px_20px_rgba(245,158,11,0.05)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#F59E0B]" />
              
              <div className="flex justify-between items-start mb-2 pl-2">
                <h4 className="text-sm font-bold text-[#F59E0B]">{spot.title}</h4>
                <span className="text-[10px] font-bold px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full">
                  {Math.round(spot.probability * 100)}% PROBABILITY
                </span>
              </div>
              
              <p className="text-xs text-[var(--text-secondary)] mb-4 pl-2 leading-relaxed">
                {spot.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pl-2">
                {spot.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded p-2 flex flex-col gap-1">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">{metric.label}</span>
                    <span className={`text-sm font-bold ${metric.isNegative ? 'text-[#EF4444]' : 'text-[var(--text-primary)]'}`}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
