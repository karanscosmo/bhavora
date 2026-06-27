import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Activity } from 'lucide-react';
import type { CascadeNode } from '@/lib/simulation';

interface ConsequenceTreeProps {
  nodes: CascadeNode[];
}

const formatDelta = (val: number) => {
  if (val === undefined || val === null) return '0';
  return Number.isInteger(val) ? val.toString() : Number(val).toFixed(1);
};

const DependencyNode = ({ node, level = 0, index = 0 }: { node: CascadeNode, level?: number, index?: number }) => {
  const isGood = node.type === 'improvement';
  const isBad = node.type === 'deterioration';
  
  return (
    <div className="flex flex-col items-center">
      {level > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 24 }}
          transition={{ delay: index * 0.15 - 0.1 }}
          className="w-0.5 bg-gray-300 my-1 relative flex justify-center z-0"
        >
           <ArrowDown size={14} className="text-gray-400 absolute -bottom-3 bg-white rounded-full" />
        </motion.div>
      )}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 }}
        className={`relative z-10 w-full max-w-[280px] p-3.5 rounded-xl border shadow-sm backdrop-blur flex justify-between items-center ${
          isGood ? 'bg-green-50 border-green-200' : 
          isBad ? 'bg-red-50 border-red-200' : 
          'bg-white border-gray-200'
        }`}
      >
        <span className="text-sm font-bold text-gray-700 leading-snug truncate pr-2">
          {node.label.split(' ▼ ')[0].split(' ▲ ')[0]}
        </span>
        <div className={`font-mono font-black text-sm whitespace-nowrap px-2 py-1 rounded bg-white/50 border shadow-sm ${
          isGood ? 'text-green-600 border-green-100' : isBad ? 'text-red-600 border-red-100' : 'text-gray-700 border-gray-100'
        }`}>
          {node.delta > 0 ? '+' : ''}{formatDelta(node.delta)} <span className="text-[10px] text-gray-500 uppercase">{node.unit}</span>
        </div>
      </motion.div>
      
      {node.children && node.children.length > 0 && (
        <div className="flex flex-col w-full relative z-0">
           {node.children.map((child, i) => (
             <DependencyNode key={child.id} node={child} level={level + 1} index={index + i + 1} />
           ))}
        </div>
      )}
    </div>
  );
}

export function ConsequenceTree({ nodes }: ConsequenceTreeProps) {
  if (!nodes || nodes.length === 0) return null;
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 p-2 bg-slate-50/50 rounded-xl border border-slate-100/50">
        {nodes.map((node, i) => (
          <DependencyNode key={node.id} node={node} index={i} />
        ))}
      </div>
    </div>
  );
}
