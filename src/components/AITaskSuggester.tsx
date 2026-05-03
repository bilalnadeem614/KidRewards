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
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, interests })
      });
      const data = await res.json();
      setSuggestions(data);
    } catch (e) {
      console.error(e);
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
    <div className="bg-white rounded-3xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto w-full border border-primary/10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold text-on-surface">AI Task Suggester</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase">Assign To</label>
            <select 
              value={selectedKid} 
              onChange={e => setSelectedKid(e.target.value)}
              className="w-full bg-surface-container border-none rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary"
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
              className="w-full bg-surface-container border-none rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant uppercase">Interests</label>
          <input 
            type="text" 
            value={interests} 
            onChange={e => setInterests(e.target.value)}
            className="w-full bg-surface-container border-none rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary"
            placeholder="e.g., Space, Dinosaurs, Drawing"
          />
        </div>
      </div>

      <button 
        onClick={getSuggestions}
        disabled={loading}
        className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container disabled:opacity-50 transition-all shadow-lg active:scale-95"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Sparkle size={20} />}
        {loading ? 'Thinking...' : 'Generate New Missions'}
      </button>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 pt-4 border-t"
          >
            {suggestions.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-on-surface">{s.title}</h4>
                  <div className="flex gap-2 text-xs font-semibold mt-1">
                    <span className="text-primary">+{s.points} PTS</span>
                    <span className="text-on-surface-variant">{s.category}</span>
                  </div>
                </div>
                <button 
                  onClick={() => addTask(s)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <PlusCircle size={24} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
