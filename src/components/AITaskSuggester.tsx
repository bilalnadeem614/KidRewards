import React, { useState } from 'react';
import { X, Sparkles, Loader2, Sparkle, PlusCircle } from 'lucide-react';
import { Kid, AITaskSuggestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AITaskSuggesterProps {
  onClose: () => void;
  onRefresh: () => void;
  kids: Kid[];
}

export default function AITaskSuggester({ onClose, onRefresh, kids }: AITaskSuggesterProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AITaskSuggestion[]>([]);
  const [selectedKid, setSelectedKid] = useState(kids[0]?.id || '');
  const [age, setAge] = useState('7');
  const [interests, setInterests] = useState('Robots, Books, Art');

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/suggest-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          childAge: parseInt(age, 10), 
          interests 
        })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch suggestions');
      }
      const data = await res.json();
      setSuggestions(data);
    } catch (e) {
      console.error('Error fetching suggestions:', e);
      alert('Failed to generate suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (suggestion: AITaskSuggestion) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...suggestion,
          assignedTo: selectedKid,
          recurrence: 'none'
        })
      });
      if (res.ok) {
        onRefresh();
        onClose();
      }
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-2xl space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto w-full border border-primary/10">
      <div className="flex justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container shrink-0">
            <Sparkles size={18} className="sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-on-surface truncate">AI Task Suggester</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant shrink-0">
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">Assign To</label>
            <select 
              value={selectedKid} 
              onChange={e => setSelectedKid(e.target.value)}
              className="w-full bg-surface-container border-none rounded-xl h-10 sm:h-12 px-3 sm:px-4 text-sm focus:ring-2 focus:ring-primary"
            >
              {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">Age</label>
            <input 
              type="number" 
              value={age} 
              onChange={e => setAge(e.target.value)}
              className="w-full bg-surface-container border-none rounded-xl h-10 sm:h-12 px-3 sm:px-4 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant uppercase">Interests</label>
          <input 
            type="text" 
            value={interests} 
            onChange={e => setInterests(e.target.value)}
            className="w-full bg-surface-container border-none rounded-xl h-10 sm:h-12 px-3 sm:px-4 text-sm focus:ring-2 focus:ring-primary"
            placeholder="e.g., Space, Dinosaurs, Drawing"
          />
        </div>
      </div>

      <button 
        onClick={getSuggestions}
        disabled={loading}
        className="w-full h-12 sm:h-14 bg-primary text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-primary-container disabled:opacity-50 transition-all shadow-lg active:scale-95"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" /> : <Sparkle size={18} className="sm:w-5 sm:h-5" />}
        {loading ? 'Thinking...' : 'Generate New Missions'}
      </button>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-outline-variant"
          >
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Suggested Missions</p>
            {suggestions.map((s: any, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-gradient-to-r from-primary/5 to-transparent p-3 sm:p-4 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 hover:border-primary/40 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-on-surface text-sm sm:text-base">{s.title}</h4>
                  {s.reason && (
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-1">{s.reason}</p>
                  )}
                  <div className="flex gap-2 text-xs font-semibold mt-1 sm:mt-2">
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs">
                      +Rs. {s.points}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => addTask({ 
                    title: s.title, 
                    points: s.points, 
                    category: 'AI-Suggested',
                    description: s.reason || 'AI-generated task suggestion'
                  })}
                  className="shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-primary text-white rounded-xl font-semibold text-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-1 shadow-sm whitespace-nowrap"
                >
                  <PlusCircle size={14} className="sm:w-4 sm:h-4" />
                  Add
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
