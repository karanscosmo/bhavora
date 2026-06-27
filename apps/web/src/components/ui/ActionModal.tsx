import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, X } from 'lucide-react';


interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: () => void;
  title: string;
  description: string;
  recommendations: string[];
}

export function ActionModal({ isOpen, onClose, onExecute, title, description, recommendations }: ActionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-surface border border-[var(--border-subtle)] shadow-2xl rounded-2xl z-[101] overflow-hidden"
          >
             <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between bg-primary-fixed/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg">
                  <Sparkles />
                </div>
                <div>
                  <h3 className="font-headline-sm text-primary tracking-tight">{title}</h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary/70">AI Policy Intervention</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-on-surface-variant transition-colors">
                <X />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-body-md text-on-surface leading-relaxed">
                {description}
              </p>
              
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Recommended Interventions</h4>
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-surface-container-low">
                    <input type="checkbox" defaultChecked className="mt-1 accent-primary w-4 h-4 cursor-pointer" />
                    <span className="text-sm text-on-surface">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--border-subtle)] bg-surface-container flex justify-end gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-black/5 transition-colors">
                Cancel
              </button>
              <button onClick={onExecute} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 shadow-md transition-all active:scale-95 flex items-center gap-2">
                <Play />
                Execute Scenario
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
