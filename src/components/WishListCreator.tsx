import React, { useState } from 'react';
import { X, Gift, Plus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface WishListCreatorProps {
  onClose: () => void;
  kidId: string;
  onAddGoal?: (goal: { title: string; targetPoints: number; description: string }) => void;
}

export default function WishListCreator({ onClose, kidId, onAddGoal }: WishListCreatorProps) {
  const [title, setTitle] = useState('');
  const [targetPoints, setTargetPoints] = useState('500');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !targetPoints) {
      alert('Please fill in all fields');
      return;
    }

    const goal = {
      title: title.trim(),
      targetPoints: parseInt(targetPoints, 10),
      description: description.trim()
    };

    setIsLoading(true);
    try {
      if (onAddGoal) {
        onAddGoal(goal);
      }
      // Reset form
      setTitle('');
      setTargetPoints('500');
      setDescription('');
      // Close after a short delay to show success
      setTimeout(onClose, 500);
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Failed to add goal. Please try again.');
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
            <Gift size={18} className="sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-on-surface truncate">Add New Goal</h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant shrink-0 transition-colors"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      <form onSubmit={handleAddGoal} className="space-y-3 sm:space-y-4">
        {/* Goal Title */}
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Goal Title</label>
          <input 
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., New Gaming Console"
            className="w-full bg-surface-container border-2 border-outline-variant rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Target Points */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Target Points (Rs.)</label>
            <input 
              type="number" 
              value={targetPoints}
              onChange={e => setTargetPoints(e.target.value)}
              min="1"
              step="50"
              className="w-full bg-surface-container border-2 border-outline-variant rounded-2xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Progress</label>
            <div className="bg-surface-container border-2 border-outline-variant rounded-2xl h-10 sm:h-12 px-3 sm:px-4 flex items-center text-sm sm:text-base text-on-surface-variant">
              0 / {targetPoints} (0%)
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Description</label>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Why do you want this goal? What will you do with it?"
            className="w-full bg-surface-container border-2 border-outline-variant rounded-2xl p-3 sm:p-4 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none h-20 sm:h-24"
          />
        </div>

        {/* Action Buttons */}
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
                <span className="hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Goal</span>
                <span className="sm:hidden">Add</span>
              </>
            )}
          </button>
        </div>

        {/* Tip */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-on-surface-variant">
          <p className="font-semibold text-primary mb-1">💡 Tip:</p>
          <p>Set realistic goals that motivate you. Break big goals into smaller steps!</p>
        </div>
      </form>
    </motion.div>
  );
}
