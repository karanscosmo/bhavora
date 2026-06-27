"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Target, Building2, AlertTriangle, Leaf, Zap, ChevronRight, Activity, Maximize2, Minimize2 } from 'lucide-react';
import { useAgentStore, useUIStore, AgentId } from '@/stores';

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

export function BhavishyavaniPanel() {
  const { isBhavishyavaniOpen, closeBhavishyavani, activeAgentId } = useUIStore();
  const { conversations, addMessage, isLoading, setLoading } = useAgentStore();
  const [currentAgent, setCurrentAgent] = useState<AgentId>((activeAgentId as AgentId) || 'executive');
  const [input, setInput] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const history = conversations[currentAgent] || [];
  const isTyping = isLoading;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping, isBhavishyavaniOpen, isFullScreen]);

  if (!isBhavishyavaniOpen) return null;

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
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed right-0 top-[64px] bottom-0 bg-white border-l border-[var(--border-subtle)] shadow-2xl z-40 flex flex-col overflow-hidden transition-all duration-300 ${
          isFullScreen ? 'w-full lg:w-[calc(100%-256px)]' : 'w-[400px]'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Bhavishyavani AI</h3>
              <p className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-success)] animate-pulse"></span> Predictive Copilot
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded hover:bg-[var(--slate-200)]">
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button onClick={() => closeBhavishyavani()} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded hover:bg-[var(--slate-200)]">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Agent Tabs */}
        <div className="flex bg-[var(--bg-surface-2)] border-b border-[var(--border-subtle)] px-2 pt-2 gap-1 overflow-x-auto no-scrollbar shrink-0">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => setCurrentAgent(agent.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-semibold transition-colors whitespace-nowrap border-b-2 ${
                currentAgent === agent.id 
                  ? 'bg-white text-[var(--text-primary)] border-[#2563EB]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--slate-200)] border-transparent'
              }`}
            >
              {agent.icon} {agent.name}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-base)]">
          
          <div className="text-center mb-6 mt-4">
            <div className="inline-block p-3 rounded-full bg-[var(--bg-surface-2)] text-[#2563EB] mb-3 border border-[var(--border-subtle)] shadow-sm">
              {AGENTS.find(a => a.id === currentAgent)?.icon}
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
              {AGENTS.find(a => a.id === currentAgent)?.name} Domain Active
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">Ask a question or request a specialized analysis.</p>
          </div>

          {history.filter(m => m.role === 'user' || m.role === 'agent').length === 0 && (
            <div className="space-y-2 mt-4 max-w-lg mx-auto">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">Suggested Analytics</div>
              {(SUGGESTIONS as Record<string, string[]>)[currentAgent]?.map((prompt: string) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-3 rounded-lg border border-[var(--border-subtle)] bg-white hover:border-[#2563EB] hover:shadow-sm transition-all text-xs text-[var(--text-primary)] flex items-center justify-between group"
                >
                  {prompt}
                  <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[#2563EB] transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          )}

          <div className={`${isFullScreen ? 'max-w-4xl mx-auto' : ''} space-y-4`}>
            {history.map((msg: any, i: number) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl p-3.5 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#2563EB] text-white rounded-br-sm' 
                    : 'bg-white border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-[var(--border-subtle)] text-[var(--text-muted)] rounded-xl rounded-bl-sm p-3.5 shadow-sm flex items-center gap-2 text-sm">
                  <Activity size={14} className="animate-spin text-[#2563EB]" /> Compiling intelligence briefing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-white shrink-0">
          <div className={`relative flex items-center ${isFullScreen ? 'max-w-4xl mx-auto' : ''}`}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder={`Ask Bhavishyavani about ${AGENTS.find(a => a.id === currentAgent)?.name}...`}
              className="w-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] rounded-lg pl-4 pr-12 py-3.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 p-2 rounded-md transition-colors ${
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
