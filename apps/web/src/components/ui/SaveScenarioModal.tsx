import React, { useState } from 'react';
import { useUIStore, useScenarioStore, useMapStore, useSimulationStore, useAppStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { X, Save, GitBranch } from 'lucide-react';

export function SaveScenarioModal() {
  const { isSaveScenarioOpen, closeSaveScenario } = useUIStore();
  const { saveScenario } = useScenarioStore();
  const { activeYear } = useSimulationStore();
  const mapStore = useMapStore();
  const { addNotification } = useAppStore();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Transport');
  const [targetYear, setTargetYear] = useState(activeYear.toString());
  const [priority, setPriority] = useState('High');
  const [tags, setTags] = useState('');

  if (!isSaveScenarioOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    // Capture Map State
    const mapState = {
      layerOpacity: mapStore.layerOpacity,
      activeBasemap: mapStore.activeBasemap,
      enabledLayers: mapStore.layers.filter(l => l.enabled).map(l => l.id)
    };

    saveScenario({
      name,
      description,
      category,
      targetYear: parseInt(targetYear, 10) || activeYear,
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      mapState
    });

    closeSaveScenario();
    
    // Reset form
    setName('');
    setDescription('');
    setTags('');
    
    addNotification({ 
      title: 'Scenario Saved', 
      message: `Scenario "${name}" committed to War Room successfully.`, 
      severity: 'success' 
    });
    
    router.push('/war-room');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeSaveScenario}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-[var(--border-subtle)]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
              <GitBranch size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Save Strategy Scenario</h2>
              <p className="text-[10px] text-[var(--text-secondary)]">Create a new commit in the Policy War Room</p>
            </div>
          </div>
          <button 
            onClick={closeSaveScenario}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Scenario Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="e.g. Green Mobility 2035"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-md text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Description</label>
            <textarea 
              placeholder="Briefly describe the focus of this scenario..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-md text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-md text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white"
              >
                <option value="Transport">Transport</option>
                <option value="Environment">Environment</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Economy">Economy</option>
                <option value="Zoning">Zoning</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Target Year</label>
              <select 
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-md text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white"
              >
                <option value="2025">2025</option>
                <option value="2030">2030</option>
                <option value="2035">2035</option>
                <option value="2040">2040</option>
                <option value="2045">2045</option>
                <option value="2050">2050</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-md text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Tags</label>
              <input 
                type="text" 
                placeholder="e.g. sustainability, metro"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-md text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex justify-end gap-3">
          <button 
            onClick={closeSaveScenario}
            className="px-4 py-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} /> Save to War Room
          </button>
        </div>

      </div>
    </div>
  );
}
