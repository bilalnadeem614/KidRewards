import React, { useEffect, useState } from 'react';
import { X, Plus, Loader2, ClipboardPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { Kid } from '../types';

interface TaskCreatorModalProps {
  kids: Kid[];
  onClose: () => void;
  onCreated: () => void;
  defaultKidId?: string | null;
}

export default function TaskCreatorModal({ kids, onClose, onCreated, defaultKidId }: TaskCreatorModalProps) {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState('10');
  const [assignedTo, setAssignedTo] = useState(defaultKidId || kids[0]?.id || '');
  const [category, setCategory] = useState('General');
  const [recurrence, setRecurrence] = useState<'daily' | 'weekly' | 'none'>('none');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAssignedTo(defaultKidId || kids[0]?.id || '');
  }, [defaultKidId, kids]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericPoints = Number(points);
    if (!title.trim() || !assignedTo || !category.trim() || !Number.isFinite(numericPoints) || numericPoints < 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          points: numericPoints,
          assignedTo,
          category: category.trim(),
          recurrence,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to create task');
      }

      onCreated();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl p-5 sm:p-8 shadow-2xl space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto w-full border border-primary/10"
    >
      <div className="flex justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shrink-0">
            <ClipboardPlus size={18} className="sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-on-surface truncate">Add New Task</h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant shrink-0 transition-colors"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      <form onSubmit={handleCreateTask} className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Clean your room"
            className="w-full bg-surface-container border-2 border-outline-variant rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Points</label>
            <input
              type="number"
              value={points}
              onChange={e => setPoints(e.target.value)}
              min="0"
              className="w-full bg-surface-container border-2 border-outline-variant rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Home, Study, etc."
              className="w-full bg-surface-container border-2 border-outline-variant rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Assign To</label>
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full bg-surface-container border-2 border-outline-variant rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              {kids.map(kid => (
                <option key={kid.id} value={kid.id}>{kid.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Recurrence</label>
            <select
              value={recurrence}
              onChange={e => setRecurrence(e.target.value as 'daily' | 'weekly' | 'none')}
              className="w-full bg-surface-container border-2 border-outline-variant rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="none">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 sm:h-14 bg-surface-container text-on-surface rounded-2xl font-bold text-sm sm:text-base transition-all hover:bg-surface-bright active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-12 sm:h-14 bg-primary text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-primary-container disabled:opacity-50 transition-all active:scale-95 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Creating...</span>
              </>
            ) : (
              <>
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Create Task</span>
                <span className="sm:hidden">Create</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}