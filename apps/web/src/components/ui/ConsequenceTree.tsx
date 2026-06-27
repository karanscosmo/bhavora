import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, AlertTriangle, Activity } from 'lucide-react';
import type { CascadeNode } from '@/lib/simulation';

interface ConsequenceTreeProps {
  nodes: CascadeNode[];
}

const TreeNode = ({ node, level = 0 }: { node: CascadeNode; level?: number }) => {
  const isPrimary = level === 0;
  
  return (
    <div className="flex flex-col">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.1 }}
        className={`relative flex flex-col p-3 rounded-lg border ${
          node.type === 'improvement' ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]' : 
          node.type === 'deterioration' ? 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' : 
          'bg-[var(--slate-800)] border-[var(--slate-700)] text-[var(--slate-300)]'
        } ${isPrimary ? 'mb-2 w-full max-w-sm' : 'mb-2 ml-6 w-full max-w-xs'}`}
      >
        {!isPrimary && (
          <div className="absolute -left-6 top-4 border-l-2 border-b-2 border-[var(--slate-700)] w-5 h-4 rounded-bl-md" />
        )}
        <div className="flex justify-between items-start gap-2">
          <span className="text-xs font-bold">{node.label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">
            {node.delta > 0 ? '+' : ''}{node.delta} {node.unit}
          </span>
        </div>
      </motion.div>
      
      {node.children && node.children.length > 0 && (
        <div className="relative flex flex-col">
          {/* Vertical connection line for children */}
          <div className="absolute left-3 top-0 bottom-6 w-px bg-[var(--slate-700)]" />
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export function ConsequenceTree({ nodes }: ConsequenceTreeProps) {
  if (!nodes || nodes.length === 0) return null;
  
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-bold text-[var(--slate-400)] uppercase tracking-wider flex items-center gap-2">
        <Activity size={14} /> Cascading Consequence Engine
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nodes.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
