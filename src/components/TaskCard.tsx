import React from 'react';
import { CheckCircle2, Circle, Star, Award, Clock } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface TaskCardProps {
  task: Task;
  onComplete?: (id: number) => void | Promise<void>;
  showAssignee?: boolean;
}

export default function TaskCard({ task, onComplete, showAssignee = true }: any) {
  const isBonus = task.points >= 25;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white p-3 sm:p-4 rounded-xl shadow-sm border-l-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-all",
        task.completed ? "border-outline-variant opacity-70" : (isBonus ? "border-secondary border-dashed" : "border-primary")
      )}
    >
      <div className={cn(
        "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0",
        task.completed ? "bg-surface-container" : (isBonus ? "bg-secondary-container/20 text-secondary" : "bg-primary/10 text-primary")
      )}>
        {isBonus ? <Star size={20} className="sm:w-6 sm:h-6" /> : <Award size={20} className="sm:w-6 sm:h-6" />}
      </div>

      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
          <h4 className={cn("font-semibold truncate text-on-surface text-sm sm:text-base", task.completed && "line-through text-on-surface-variant")}>
            {task.title}
          </h4>
          {showAssignee && (
            <span className="shrink-0 bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {task.assignedTo}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-1.5">
          <span className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-1">
            <Clock size={12} /> {task.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-outline-variant" />
          <span className={cn("font-bold text-xs sm:text-sm", isBonus ? "text-secondary" : "text-primary")}>
            +Rs. {task.points}
          </span>
        </div>
      </div>

      {!task.completed && onComplete && (
        <button 
          onClick={() => onComplete(task.id)}
          className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-outline-variant rounded-full text-outline-variant flex items-center justify-center hover:border-primary hover:text-primary active:scale-90 transition-all shrink-0"
        >
          <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />
        </button>
      )}

      {task.completed && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-primary shrink-0">
          <CheckCircle2 size={20} fill="currentColor" className="text-primary-container sm:w-6 sm:h-6" />
        </div>
      )}
    </motion.div>
  );
}
