"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ArrowRight, Terminal, Send, X, Zap, Activity, Clock, Crosshair, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  actions?: { label: string; onClick: () => void }[];
  status?: 'pending' | 'success' | 'error';
}

export function OperationsAgent() {
  const router = useRouter();
  const store = useSimulationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Proactive Agent Logic
  useEffect(() => {
    // Generate an intelligent, context-aware greeting based on CURRENT store metrics
    const { metrics, popGrowth } = store;
    
    let proactiveMessage = "SYS_INIT_SUCCESS. COMMAND NODE ONLINE. WAITING FOR DIRECTIVE...";
    let actions: { label: string; onClick: () => void }[] = [];

    if (metrics.trafficCongestion > 15) {
      proactiveMessage = `CRITICAL ALERT: SECTOR 4 CONGESTION ANOMALY DETECTED.\nProjected increase: ${Math.round(metrics.trafficCongestion)}% (Driven by ${popGrowth}% pop influx).\n\nRECOMMENDED COUNTERMEASURES:\n> Adjust ORR signal cycle timing (+8%)\n> Mobilize rapid transit reserves (4 units)\n> Expedite Metro Phase 3 funding authorization`;
      actions = [
        { label: "EXECUTE: METRO_EXPANSION_PROTOCOL", onClick: () => { store.setInputs({ metroExpansion: 10 }); store.runSimulation(); } }
      ];
    } else if (metrics.energyDemand > 20) {
      proactiveMessage = `CRITICAL ALERT: GRID LOAD EXCEEDING SAFE PARAMETERS.\nSubstation Beta capacity at 94%.\n\nRECOMMENDED COUNTERMEASURES:\n> Initiate smart-grid load shedding\n> Reroute 400MW from Solar Node Alpha\n> Broadcast emergency conservation directive`;
      actions = [
        { label: "EXECUTE: GRID_BALANCING_PROTOCOL", onClick: () => { store.setInputs({ renewableGrowth: 50 }); store.runSimulation(); } }
      ];
    } else if (metrics.waterDemand > 15) {
      proactiveMessage = `WARNING: RESOURCE DEPLETION VECTOR ACCELERATED.\nCauvery Stage V supply insufficient for projected growth phase.\n\nRECOMMENDED COUNTERMEASURES:\n> Mandate STP water reclamation\n> Throttle industrial quota (-5%)\n> Deploy automated pressure valving`;
      actions = [
        { label: "EXECUTE: RESOURCE_CONSERVATION_PROTOCOL", onClick: () => { store.setInputs({ indExpansion: -5 }); store.runSimulation(); } }
      ];
    }

    const timer = setTimeout(() => {
      setMessages([
        {
          id: 'init',
          role: 'agent',
          content: proactiveMessage,
          timestamp: new Date().toISOString(),
          actions
        }
      ]);
    }, 500);
    return () => clearTimeout(timer);
  }, [store.metrics, store.popGrowth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Live LLM RAG response for demo purposes
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: "QUERY RECEIVED. CROSS-REFERENCING BBMP DPR ARCHIVES.\n\nANALYSIS COMPLETE. Implementation requires council authorization (30-day holds). Would you like to draft the operational proposal?",
        timestamp: new Date().toISOString()
      }]);
    }, 1200);
  };

  return (
    <>
      {/* Drawer Toggle Button */}
      <motion.button
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[9990] bg-[var(--slate-900)] border border-[var(--slate-700)] border-r-0 py-4 px-2 rounded-l-lg shadow-lg flex flex-col items-center gap-2 cursor-pointer transition-colors hover:bg-[var(--slate-800)]"
      >
        <Terminal size={16} className="text-[var(--accent-teal)]" />
        <span className="text-[9px] font-mono font-bold text-[var(--slate-400)]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          COMMAND CONSOLE
        </span>
        {isOpen ? <ChevronRight size={14} className="text-[var(--slate-500)] mt-2" /> : <div className="w-2 h-2 rounded-full bg-[var(--accent-red)] animate-pulse mt-2" />}
      </motion.button>

      {/* Side Drawer Console */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-[9980] lg:hidden"
            />
            
            {/* Console Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[420px] bg-[var(--slate-900)] border-l border-[var(--slate-700)] z-[9990] flex flex-col shadow-2xl font-mono text-sm"
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--slate-700)] bg-[var(--slate-800)] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--slate-900)] border border-[var(--slate-700)]">
                    <Crosshair size={18} className="text-[var(--accent-teal)]" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white tracking-widest">TACTICAL COPILOT</h2>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--accent-teal)] mt-1">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-teal)] animate-pulse" /> LINK ESTABLISHED
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[var(--slate-400)] hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-[#0f141e]">
                <div className="text-[10px] text-[var(--slate-500)] text-center mb-4 tracking-widest border-b border-[var(--slate-800)] pb-2">
                  SECURE CONNECTION // ENCRYPTION LEVEL ALPHA
                </div>

                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-[var(--slate-500)] mb-1">
                        {msg.role === 'agent' ? <><Terminal size={10} className="text-[var(--accent-teal)]"/> SYSTEM</> : <>OPERATOR <UserIcon/></>}
                        <span className="text-[var(--slate-600)]">[{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                      </div>
                      
                      <div className={`max-w-[90%] p-3 text-xs leading-relaxed border ${
                        msg.role === 'user' 
                          ? 'bg-[var(--slate-800)] border-[var(--slate-700)] text-[var(--slate-200)]' 
                          : 'bg-[#15202b] border-[var(--accent-teal)]/30 text-[var(--accent-teal)] shadow-[0_0_15px_rgba(20,184,166,0.05)]'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-[var(--accent-teal)]/20 flex flex-col gap-2">
                            {msg.actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={action.onClick}
                                className="text-left px-3 py-2 bg-[var(--accent-teal)]/10 hover:bg-[var(--accent-teal)]/20 border border-[var(--accent-teal)]/40 text-[10px] font-bold tracking-wider text-[var(--accent-teal)] flex items-center justify-between transition-colors uppercase"
                              >
                                <span>{action.label}</span>
                                <ArrowRight size={12} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Console */}
              <div className="p-4 border-t border-[var(--slate-700)] bg-[var(--slate-800)] shrink-0">
                <form onSubmit={handleSend} className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent-teal)] font-bold">{'>'}</div>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="ENTER DIRECTIVE..."
                      className="w-full bg-[var(--slate-900)] border border-[var(--slate-600)] pl-8 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--accent-teal)] transition-colors placeholder-[var(--slate-600)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className={`px-4 flex items-center justify-center border transition-colors ${
                      input.trim() 
                        ? 'bg-[var(--accent-teal)]/10 border-[var(--accent-teal)] text-[var(--accent-teal)] hover:bg-[var(--accent-teal)]/20' 
                        : 'bg-[var(--slate-800)] border-[var(--slate-700)] text-[var(--slate-600)]'
                    }`}
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function UserIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
