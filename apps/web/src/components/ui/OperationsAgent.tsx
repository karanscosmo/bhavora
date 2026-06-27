"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ArrowRight, Bot, Brain, Send, X, Zap, Activity } from 'lucide-react';

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
    
    let proactiveMessage = "Good Morning Rajesh. System nominal.";
    let actions: { label: string; onClick: () => void }[] = [];

    if (metrics.trafficCongestion > 15) {
      proactiveMessage = `Good Morning Rajesh.\\nWhitefield and ORR congestion expected to increase by \${Math.round(metrics.trafficCongestion)}% due to \${popGrowth}% population influx.\\n\\nSuggested Actions:\\n✓ Increase ORR signal cycle by 8%\\n✓ Deploy 4 additional BMTC feeder buses\\n✓ Accelerate Metro Phase 3 funding`;
      actions = [
        { label: "Simulate Metro Expansion", onClick: () => { store.setInputs({ metroExpansion: 10 }); store.runSimulation(); } }
      ];
    } else if (metrics.energyDemand > 20) {
      proactiveMessage = `Good Morning Rajesh.\\nCritical grid load detected. Substation capacity at 94% due to rapid EV adoption.\\n\\nSuggested Actions:\\n✓ Enable smart-grid load shedding in East Zone\\n✓ Route 400MW from Solar Park\\n✓ Issue emergency conservation alert`;
      actions = [
        { label: "Simulate Grid Balancing", onClick: () => { store.setInputs({ renewableGrowth: 50 }); store.runSimulation(); } }
      ];
    } else if (metrics.waterDemand > 15) {
      proactiveMessage = `Good Morning Rajesh.\\nWater reserve depletion accelerated. Cauvery Stage V supply insufficient for current growth.\\n\\nSuggested Actions:\\n✓ Mandate STP water for construction\\n✓ Reduce industrial quota by 5%\\n✓ Deploy pressure valving`;
      actions = [
        { label: "Apply Conservation Policy", onClick: () => { store.setInputs({ indExpansion: -5 }); store.runSimulation(); } }
      ];
    } else {
      proactiveMessage = `Good Morning Rajesh.\\nAll city infrastructure operating within optimal parameters. No severe anomalies detected across 428 monitored nodes.`;
    }

    setMessages([
      {
        id: 'init',
        role: 'agent',
        content: proactiveMessage,
        timestamp: new Date().toISOString(),
        actions
      }
    ]);
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
        content: "I have queried the BBMP DPRs and Smart City planning docs. Implementing that policy requires city council approval and a 30-day notice period. Would you like me to draft the proposal?",
        timestamp: new Date().toISOString()
      }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl flex items-center justify-center transition-colors \${isOpen ? 'bg-surface border border-outline-variant scale-0 opacity-0' : 'bg-primary text-white hover:bg-primary-hover animate-bounce-slow'}`}
      >
        <Activity className="w-6 h-6 mr-2" />
        <span className="font-bold text-sm">Operations Agent</span>
      </motion.button>

      {/* Copilot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-outline-variant/30 bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Bhavora AI Command</h3>
                  <p className="text-[10px] text-blue-100 uppercase tracking-wider font-bold">Proactive Agent</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'agent' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0 border border-primary/20">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm \${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-white border border-outline-variant/30 rounded-tl-sm text-on-surface'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    
                    {/* Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {msg.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={action.onClick}
                            className="w-full text-left px-4 py-2.5 bg-[#f8f9ff] hover:bg-[#e5eeff] text-primary text-xs font-bold rounded-xl border border-primary/10 transition-colors flex items-center justify-between group"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <span className={`text-[10px] mt-2 block \${msg.role === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-outline-variant/30">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Bhavora AI..."
                  className="w-full bg-[#f8f9ff] border border-outline-variant/50 text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-900"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 p-2 bg-primary text-white rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
