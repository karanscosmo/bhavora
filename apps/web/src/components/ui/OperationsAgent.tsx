"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ArrowRight, Bot, Brain, Send, X, Zap, Activity, Clock, MapPin, Target, AlertTriangle } from 'lucide-react';

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
      proactiveMessage = `Good Morning Rajesh.\nWhitefield and ORR congestion expected to increase by ${Math.round(metrics.trafficCongestion)}% due to ${popGrowth}% population influx.\n\nSuggested Actions:\n✓ Increase ORR signal cycle by 8%\n✓ Deploy 4 additional BMTC feeder buses\n✓ Accelerate Metro Phase 3 funding`;
      actions = [
        { label: "Simulate Metro Expansion", onClick: () => { store.setInputs({ metroExpansion: 10 }); store.runSimulation(); } }
      ];
    } else if (metrics.energyDemand > 20) {
      proactiveMessage = `Good Morning Rajesh.\nCritical grid load detected. Substation capacity at 94% due to rapid EV adoption.\n\nSuggested Actions:\n✓ Enable smart-grid load shedding in East Zone\n✓ Route 400MW from Solar Park\n✓ Issue emergency conservation alert`;
      actions = [
        { label: "Simulate Grid Balancing", onClick: () => { store.setInputs({ renewableGrowth: 50 }); store.runSimulation(); } }
      ];
    } else if (metrics.waterDemand > 15) {
      proactiveMessage = `Good Morning Rajesh.\nWater reserve depletion accelerated. Cauvery Stage V supply insufficient for current growth.\n\nSuggested Actions:\n✓ Mandate STP water for construction\n✓ Reduce industrial quota by 5%\n✓ Deploy pressure valving`;
      actions = [
        { label: "Apply Conservation Policy", onClick: () => { store.setInputs({ indExpansion: -5 }); store.runSimulation(); } }
      ];
    } else {
      proactiveMessage = `Good Morning Rajesh.\nAll city infrastructure operating within optimal parameters. No severe anomalies detected across 428 monitored nodes.`;
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
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '96px',
          zIndex: 9990,
          padding: '12px 20px 12px 16px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
          border: 'none',
          boxShadow: '0 4px 24px rgba(0,212,255,0.3), 0 8px 40px rgba(124,58,237,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#fff',
          fontWeight: 700,
          fontSize: '13px',
        }}
      >
        <Activity size={18} />
        <span>Operations Agent</span>
      </motion.button>

      {/* Copilot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '96px',
              zIndex: 9990,
              width: '420px',
              height: '600px',
              background: 'linear-gradient(170deg, var(--bg-surface-1) 0%, color-mix(in srgb, var(--bg-surface-1) 95%, #000) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0,0,0,0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0,212,255,0.15)',
                }}>
                  <Brain size={18} color="#00D4FF" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>Bhavora AI Command</div>
                  <div style={{ fontSize: '10px', color: 'rgba(0,212,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Proactive Agent</div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px' }}
              >
                <X size={14} />
              </motion.button>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(0,0,0,0.1)',
            }}>
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                      display: 'flex',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      gap: '10px',
                      alignItems: 'flex-start',
                    }}
                  >
                    {msg.role === 'agent' && (
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '10px',
                        background: 'rgba(0,212,255,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(0,212,255,0.15)',
                      }}>
                        <Brain size={16} color="#00D4FF" />
                      </div>
                    )}
                    
                    <div style={{
                      maxWidth: '85%',
                      padding: msg.role === 'user' ? '10px 14px' : '12px 14px',
                      borderRadius: msg.role === 'user' ? '14px 14px 6px 14px' : '14px 14px 14px 6px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.12))'
                        : 'rgba(255,255,255,0.03)',
                      border: msg.role === 'user'
                        ? '1px solid rgba(0,212,255,0.15)'
                        : '1px solid rgba(255,255,255,0.06)',
                      backdropFilter: msg.role === 'agent' ? 'blur(8px)' : 'none',
                      boxShadow: msg.role === 'agent' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                    }}>
                      <p style={{
                        fontSize: '13px',
                        color: msg.role === 'user' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.8)',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                        margin: 0,
                      }}>{msg.content}</p>
                      
                      {/* Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Recommended Action</div>
                          {msg.actions.map((action, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.02, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={action.onClick}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: 'rgba(0,212,255,0.06)',
                                border: '1px solid rgba(0,212,255,0.1)',
                                color: '#00D4FF',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 120ms',
                                textAlign: 'left',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Zap size={12} />
                                <span>{action.label}</span>
                              </div>
                              <ArrowRight size={12} style={{ opacity: 0.6 }} />
                            </motion.button>
                          ))}
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div style={{
                        fontSize: '9px',
                        color: msg.role === 'user' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
                        marginTop: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      }}>
                        <Clock size={8} />
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Bhavora AI..."
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '24px',
                    padding: '10px 16px',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <motion.button
                  whileHover={input.trim() ? { scale: 1.04 } : {}}
                  whileTap={input.trim() ? { scale: 0.96 } : {}}
                  type="submit"
                  disabled={!input.trim()}
                  style={{
                    padding: '10px',
                    background: !input.trim() ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                    border: 'none',
                    borderRadius: '50%',
                    color: '#FFFFFF',
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                    opacity: input.trim() ? 1 : 0.3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    flexShrink: 0,
                  }}
                >
                  <Send size={14} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
