"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ArrowRight, Bot, Brain, Send, X, Zap } from 'lucide-react';


interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  actions?: { label: string; onClick: () => void }[];
  status?: 'pending' | 'success' | 'error';
}

export function AICopilot() {
  const router = useRouter();
  const store = useSimulationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'agent',
      content: 'Bhavora City Operations Agent online. I can execute platform simulations, adjust policy parameters, export reports, or analyze current infrastructure loads.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Command Parser (Rule-based to act like an LLM tool caller)
  const processCommand = async (text: string) => {
    const cmd = text.toLowerCase();
    
    // Default response
    let response: Message = {
      id: Date.now().toString(),
      role: 'agent',
      content: "I didn't recognize a specific system command. Try asking me to 'run flood simulation', 'create EV adoption scenario', or 'export planning report'.",
      timestamp: new Date().toISOString()
    };

    if (cmd.includes('ev') || cmd.includes('adoption')) {
      store.setInputs({ evAdoption: 80, renewableGrowth: 60, popGrowth: 15 });
      response = {
        id: Date.now().toString(),
        role: 'agent',
        content: "I've configured an aggressive EV Adoption scenario (80% EV, 60% Renewable). Would you like me to run the simulation now?",
        timestamp: new Date().toISOString(),
        actions: [
          { 
            label: "Run Simulation", 
            onClick: async () => {
              store.runSimulation();
              router.push('/simulation-results');
              setIsOpen(false);
            }
          },
          {
            label: "View Parameters",
            onClick: () => { router.push('/decision-twin'); setIsOpen(false); }
          }
        ]
      };
    } 
    else if (cmd.includes('flood') || cmd.includes('disaster')) {
      store.setInputs({ climateEvent: '100-Year Flood' });
      response = {
        id: Date.now().toString(),
        role: 'agent',
        content: "Initiating 100-Year Flood disaster protocol. I am loading the hydrological impact layer for the Koramangala Valley.",
        timestamp: new Date().toISOString(),
        actions: [
          {
            label: "View Impact Map",
            onClick: () => { router.push('/disaster'); setIsOpen(false); }
          }
        ]
      };
    }
    else if (cmd.includes('report') || cmd.includes('export')) {
      response = {
        id: Date.now().toString(),
        role: 'agent',
        content: "Generating executive infrastructure report based on current simulation metrics.",
        timestamp: new Date().toISOString(),
        status: 'success',
        actions: [
          {
            label: "Go to Reports Dashboard",
            onClick: () => { router.push('/reports'); setIsOpen(false); }
          }
        ]
      };
    }
    else if (cmd.includes('compare') || cmd.includes('baseline')) {
      response = {
        id: Date.now().toString(),
        role: 'agent',
        content: "Preparing variance comparison between Baseline 2025 and Simulated 2035 targets.",
        timestamp: new Date().toISOString(),
        actions: [
          {
            label: "Open Impact Matrix",
            onClick: () => { router.push('/impact'); setIsOpen(false); }
          }
        ]
      };
    }
    else if (cmd.includes('hotspot') || cmd.includes('congestion')) {
      response = {
        id: Date.now().toString(),
        role: 'agent',
        content: "Highlighting transit congestion bottlenecks across the metropolitan area.",
        timestamp: new Date().toISOString(),
        actions: [
          {
            label: "View Live Map",
            onClick: () => { router.push('/cities'); setIsOpen(false); }
          }
        ]
      };
    }

    // Add processing delay to simulate thinking
    setTimeout(() => {
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    processCommand(input);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 group border border-white/20"
      >
        <Bot />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </button>

      {/* Copilot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] max-h-[80vh] bg-surface border border-outline-variant/30 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                  <Zap />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">City Operations Agent</h3>
                  <p className="text-[10px] text-white/60 font-mono uppercase tracking-wider">Ready to execute</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                <X />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-surface-container text-on-surface border border-outline-variant/20 rounded-tl-sm'
                  }`}>
                    {msg.role === 'agent' && (
                      <div className="flex items-center gap-1.5 mb-2 text-primary">
                        <Brain />
                        <span className="text-[10px] font-bold uppercase tracking-widest">System</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    
                    {/* Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {msg.actions.map((action, i) => (
                          <button 
                            key={i}
                            onClick={action.onClick}
                            className="w-full py-2 px-3 bg-white border border-outline-variant/30 rounded-xl text-xs font-bold text-primary hover:bg-primary/5 transition-colors flex items-center justify-between group"
                          >
                            {action.label}
                            <ArrowRight />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-outline-variant/20 bg-surface shrink-0">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="E.g. Run flood simulation..."
                  className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors text-on-surface"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-black transition-colors"
                >
                  <Send />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
