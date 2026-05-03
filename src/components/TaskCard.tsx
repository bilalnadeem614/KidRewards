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
        "bg-white p-4 rounded-xl shadow-sm border-l-4 flex items-center gap-4 transition-all",
        task.completed ? "border-outline-variant opacity-70" : (isBonus ? "border-secondary border-dashed" : "border-primary")
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center",
        task.completed ? "bg-surface-container" : (isBonus ? "bg-secondary-container/20 text-secondary" : "bg-primary/10 text-primary")
      )}>
        {isBonus ? <Star size={24} /> : <Award size={24} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className={cn("font-semibold truncate text-on-surface", task.completed && "line-through text-on-surface-variant")}>
            {task.title}
          </h4>
          {showAssignee && (
            <span className="shrink-0 bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {task.assignedTo}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-sm text-on-surface-variant flex items-center gap-1">
            <Clock size={12} /> {task.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-outline-variant" />
          <span className={cn("font-bold text-sm", isBonus ? "text-secondary" : "text-primary")}>
            +{task.points} pts
          </span>
        </div>
      </div>

      {!task.completed && onComplete && (
        <button 
          onClick={() => onComplete(task.id)}
          className="w-10 h-10 border-2 border-outline-variant rounded-full text-outline-variant flex items-center justify-center hover:border-primary hover:text-primary active:scale-90 transition-all"
        >
          <CheckCircle2 size={24} />
        </button>
      )}

      {task.completed && (
        <div className="w-10 h-10 flex items-center justify-center text-primary">
          <CheckCircle2 size={24} fill="currentColor" className="text-primary-container" />
        </div>
      )}
    </motion.div>
  );
}
