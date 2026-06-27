"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/stores';
import { ArrowRight, Terminal, Send, X, Crosshair, ChevronRight, Mic, MicOff, Volume2 } from 'lucide-react';

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
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleCommand(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const speak = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text.replace(/SYS_INIT_SUCCESS|COMMAND NODE ONLINE|WARNING|CRITICAL ALERT/g, ''));
    utterance.rate = 1.05;
    utterance.pitch = 0.9;
    window.speechSynthesis.cancel(); // clear queue
    window.speechSynthesis.speak(utterance);
  };

  const addAgentResponse = (content: string, actions?: any[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'agent',
      content,
      timestamp: new Date().toISOString(),
      actions
    }]);
    speak(content);
  };

  const handleCommand = (cmd: string) => {
    const text = cmd.toLowerCase();
    
    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: cmd,
      timestamp: new Date().toISOString()
    }]);
    
    setInput('');
    
    setTimeout(() => {
      // Action Execution Logic (The "Brain")
      if (text.includes("safety") || text.includes("accident") || text.includes("blackspot")) {
        addAgentResponse("Accessing Urban Safety Intelligence layer. Navigating to Safety Module.");
        router.push('/safety');
      } else if (text.includes("flood") || text.includes("bellandur")) {
        addAgentResponse("Initializing flood simulation protocols for Bellandur catchment area. Deploying Disaster Response module.");
        router.push('/disaster');
      } else if (text.includes("metro") || text.includes("demand") || text.includes("consequence")) {
        addAgentResponse("Evaluating cascading effects of Metro expansion on population migration and water stress.", [
          { label: 'EXECUTE: METRO_EXPANSION', onClick: () => store.setPolicy({ metroExpansion: 100 }) }
        ]);
        router.push('/decision-twin');
      } else if (text.includes("report") || text.includes("executive")) {
        addAgentResponse("Generating board-ready executive briefing based on current telemetry. Moving to Analytics Suite.");
        router.push('/analytics');
      } else if (text.includes("compare") || text.includes("scenario") || text.includes("war room")) {
        addAgentResponse("Initializing Policy War Room. Comparing multi-domain impact of current policies.");
        router.push('/scenarios');
      } else {
        addAgentResponse("DIRECTIVE UNCLEAR. Cross-referencing bbmp archives. Please specify module (Safety, Disaster, Twin, Analytics).");
      }
    }, 800);
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setIsOpen(true);
    }
  };

  // Proactive Agent Logic
  useEffect(() => {
    const { results, activePolicy } = store;
    
    let proactiveMessage = "SYS_INIT_SUCCESS. COMMAND NODE ONLINE. WAITING FOR DIRECTIVE...";
    let actions: { label: string; onClick: () => void }[] = [];

    if (results.traffic.delta > 5) {
      proactiveMessage = `CRITICAL ALERT: SECTOR 4 CONGESTION ANOMALY DETECTED.\nProjected increase: +${Math.round(results.traffic.delta)}%.\n\nRECOMMENDED COUNTERMEASURES:\n> Adjust ORR signal cycle timing (+8%)\n> Mobilize rapid transit reserves (4 units)\n> Expedite Metro Phase 3 funding authorization`;
      actions = [
        { label: "EXECUTE: METRO_EXPANSION_PROTOCOL", onClick: () => { store.setPolicy({ metroExpansion: Math.min(100, activePolicy.metroExpansion + 20) }); } }
      ];
    } else if (activePolicy.renewableShare < 20) {
      proactiveMessage = `CRITICAL ALERT: GRID EMISSIONS EXCEEDING SAFE PARAMETERS.\nFossil fuel dependency critically high.\n\nRECOMMENDED COUNTERMEASURES:\n> Initiate smart-grid load shedding\n> Reroute 400MW from Solar Node Alpha\n> Broadcast emergency conservation directive`;
      actions = [
        { label: "EXECUTE: GRID_BALANCING_PROTOCOL", onClick: () => { store.setPolicy({ renewableShare: 50 }); } }
      ];
    } else if (activePolicy.waterInfrastructure < 15) {
      proactiveMessage = `WARNING: RESOURCE DEPLETION VECTOR ACCELERATED.\nCauvery Stage V supply insufficient for projected growth phase.\n\nRECOMMENDED COUNTERMEASURES:\n> Mandate STP water reclamation\n> Throttle industrial quota (-5%)\n> Deploy automated pressure valving`;
      actions = [
        { label: "EXECUTE: RESOURCE_CONSERVATION_PROTOCOL", onClick: () => { store.setPolicy({ waterInfrastructure: 30 }); } }
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
  }, [store.results, store.activePolicy]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  return (
    <>
      <motion.button
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[9990] bg-[var(--slate-900)] border border-[var(--slate-700)] border-r-0 py-4 px-2 rounded-l-lg shadow-lg flex flex-col items-center gap-2 cursor-pointer transition-colors hover:bg-[var(--slate-800)]"
      >
        <Terminal size={16} className="text-[var(--accent-teal)]" />
        <span className="text-[9px] font-mono font-bold text-[var(--slate-400)]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          BHAVISHYAVANI
        </span>
        {isOpen ? <ChevronRight size={14} className="text-[var(--slate-500)] mt-2" /> : <div className="w-2 h-2 rounded-full bg-[var(--accent-red)] animate-pulse mt-2" />}
      </motion.button>

      {/* Voice Floating Action Button (Always available) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={toggleListen}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-[9995] shadow-2xl transition-colors ${
            isListening ? 'bg-[#EF4444] animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
          }`}
        >
          <Mic size={24} className="text-white" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-[9980] lg:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[420px] bg-[var(--slate-900)] border-l border-[var(--slate-700)] z-[9990] flex flex-col shadow-2xl font-mono text-sm"
            >
              <div className="p-4 border-b border-[var(--slate-700)] bg-[var(--slate-800)] flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--slate-900)] border border-[var(--slate-700)]">
                    <Crosshair size={18} className="text-[var(--accent-teal)]" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white tracking-widest">BHAVISHYAVANI COPILOT</h2>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--accent-teal)] mt-1">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-teal)] animate-pulse" /> VOICE MODULE ACTIVE
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-2 transition-colors ${voiceEnabled ? 'text-[var(--accent-teal)]' : 'text-[var(--slate-500)]'}`}>
                    <Volume2 size={16} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-[var(--slate-400)] hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

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
                        {msg.role === 'agent' ? <><Terminal size={10} className="text-[var(--accent-teal)]"/> SYSTEM</> : <>OPERATOR</>}
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

              <div className="p-4 border-t border-[var(--slate-700)] bg-[var(--slate-800)] shrink-0">
                <form onSubmit={(e) => { e.preventDefault(); if(input.trim()) handleCommand(input); }} className="flex gap-2">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={toggleListen}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                        isListening ? 'bg-[#EF4444] text-white animate-pulse' : 'text-[var(--slate-400)] hover:bg-[var(--slate-700)] hover:text-white'
                      }`}
                    >
                      {isListening ? <Mic size={14} /> : <MicOff size={14} />}
                    </button>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isListening ? "LISTENING..." : "ENTER DIRECTIVE OR TAP MIC..."}
                      className="w-full bg-[var(--slate-900)] border border-[var(--slate-600)] pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--accent-teal)] transition-colors placeholder-[var(--slate-600)]"
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
