"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Target, Building2, AlertTriangle, Leaf, Zap, ChevronRight, Activity, MessageSquare } from 'lucide-react';
import { useAgentStore, useUIStore, useCityDataStore, AgentId } from '@/stores';

const AGENTS: { id: AgentId; name: string; icon: React.ReactNode; color: string }[] = [
  { id: 'executive', name: 'Executive', icon: <Target size={16} />, color: 'var(--accent-primary)' },
  { id: 'urban', name: 'Urban', icon: <Building2 size={16} />, color: 'var(--slate-700)' },
  { id: 'disaster', name: 'Disaster', icon: <AlertTriangle size={16} />, color: 'var(--accent-danger)' },
  { id: 'sustainability', name: 'Sustainability', icon: <Leaf size={16} />, color: 'var(--accent-success)' },
  { id: 'infrastructure', name: 'Infrastructure', icon: <Zap size={16} />, color: 'var(--accent-warning)' },
];

const SUGGESTIONS: Record<AgentId, string[]> = {
  executive: ['Generate a board-ready briefing', 'Summarize Top 3 City Risks'],
  urban: ['Run density analysis for Whitefield', 'Show Metro Phase 3 alignment impact'],
  disaster: ['Assess monsoon flood risk in Bellandur', 'Generate evacuation plan for Zone 4'],
  sustainability: ['Project water stress index to 2030', 'Analyze carbon neutrality pathway'],
  infrastructure: ['Identify critical substation loads', 'Recommend 50 EV charging locations']
};

export function AgentHub() {
  const { isAgentHubOpen, closeAgentHub, activeAgentId } = useUIStore();
  const { conversations, addMessage, isLoading, setLoading } = useAgentStore();
  const [currentAgent, setCurrentAgent] = useState<AgentId>((activeAgentId as AgentId) || 'executive');
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const history = conversations[currentAgent] || [];
  const isTyping = isLoading;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping, isAgentHubOpen]);

  if (!isAgentHubOpen) return null;

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;
    const msgId = String(Math.floor(Math.random() * 1000000));
    addMessage(currentAgent, { id: msgId, role: 'user', content: text, timestamp: new Date() });
    setInput('');
    setLoading(true);
    setTimeout(() => {
      // Mock Response
      const respId = String(Math.floor(Math.random() * 1000000));
      addMessage(currentAgent, { 
        id: respId, 
        role: 'agent', 
        content: `Analyzing "${text}" through the ${currentAgent} context matrix...\n\nData models indicate a strong correlation with recent metric deviations. I recommend reviewing the Simulation Twin to test edge cases.`, 
        timestamp: new Date() 
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-white rounded-xl shadow-2xl border border-[var(--border-subtle)] z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">AI Copilot</h3>
              <p className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-success)]"></span> Models Online
              </p>
            </div>
          </div>
          <button onClick={() => closeAgentHub()} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Agent Tabs */}
        <div className="flex bg-[var(--bg-surface-2)] border-b border-[var(--border-subtle)] px-2 pt-2 gap-1 overflow-x-auto no-scrollbar shrink-0">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => setCurrentAgent(agent.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-semibold transition-colors whitespace-nowrap border-b-2 ${
                currentAgent === agent.id 
                  ? 'bg-white text-[var(--text-primary)] border-[var(--accent-primary)]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--slate-200)] border-transparent'
              }`}
            >
              {agent.icon} {agent.name}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-base)]">
          
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-muted)] mb-3">
              {AGENTS.find(a => a.id === currentAgent)?.icon}
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
              {AGENTS.find(a => a.id === currentAgent)?.name} Intelligence
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">Ask a question or request a specialized analysis.</p>
          </div>

          {history.filter(m => m.role === 'user' || m.role === 'agent').length === 0 && (
            <div className="space-y-2 mt-4">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Suggested Prompts</div>
              {(SUGGESTIONS as Record<string, string[]>)[currentAgent]?.map((prompt: string) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-3 rounded-lg border border-[var(--border-subtle)] bg-white hover:border-[var(--accent-primary)] hover:shadow-sm transition-all text-xs text-[var(--text-primary)] flex items-center justify-between group"
                >
                  {prompt}
                  <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          )}

          {history.map((msg: any, i: number) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl p-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#2563EB] text-white rounded-br-sm' 
                  : 'bg-white border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-bl-sm shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-[var(--border-subtle)] text-[var(--text-muted)] rounded-xl rounded-bl-sm p-3 shadow-sm flex items-center gap-2">
                <Activity size={14} className="animate-spin" /> Analyzing data...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-white shrink-0">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder={`Ask ${AGENTS.find(a => a.id === currentAgent)?.name} Copilot...`}
              className="w-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] rounded-lg pl-4 pr-12 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 p-1.5 rounded-md transition-colors ${
                input.trim() && !isTyping ? 'bg-[#2563EB] text-white' : 'text-[var(--text-muted)] bg-transparent'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
