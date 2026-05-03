import React from 'react';
import { ArrowLeft, Activity, CheckCircle, User, Award, Calendar } from 'lucide-react';
import { Task, Kid } from '../types';
import { cn } from '../lib/utils';

interface ActivityLogProps {
  tasks: Task[];
  kids: Kid[];
  onBack?: () => void;
}

export default function ActivityLog({ tasks, kids, onBack }: ActivityLogProps) {
  // Sort tasks by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  const getKidName = (kidId: string) => {
    return kids.find(k => k.id === kidId)?.name || 'Unknown';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-surface max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-surface-container rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-primary" />
            </button>
          )}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-container rounded-xl flex items-center justify-center text-white">
              <Activity size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Activity Log</h1>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-outline-variant">
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-2">Total Tasks</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">{tasks.length}</h2>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-outline-variant">
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-2">Completed</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">{tasks.filter(t => t.completed).length}</h2>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-outline-variant">
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-2">Points Awarded</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary">{tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)}</h2>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-on-surface mb-4">Recent Activity</h2>
          
          {sortedTasks.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center text-on-surface-variant">
              <p>No activity yet</p>
            </div>
          ) : (
            sortedTasks.map(task => (
              <div 
                key={task.id}
                className={cn(
                  "bg-white p-4 sm:p-6 rounded-2xl shadow-sm border-l-4 transition-all hover:shadow-md",
                  task.completed 
                    ? 'border-l-primary bg-primary/5' 
                    : 'border-l-outline-variant'
                )}
              >
                <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      {task.completed ? (
                        <CheckCircle size={20} className="text-primary shrink-0 sm:w-6 sm:h-6" />
                      ) : (
                        <Activity size={20} className="text-on-surface-variant shrink-0 sm:w-6 sm:h-6" />
                      )}
                      <h3 className="text-base sm:text-lg font-bold text-on-surface truncate">{task.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant mb-2 line-clamp-2">{task.category || 'Task'}</p>
                    
                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <User size={14} />
                        <span>{getKidName(task.assignedTo)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-secondary">
                        <Award size={14} />
                        <span>+Rs. {task.points}</span>
                      </div>
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <Calendar size={14} />
                        <span>{formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={cn(
                      "px-2 sm:px-3 py-1 rounded-lg text-xs font-bold uppercase whitespace-nowrap",
                      task.completed
                        ? 'bg-primary text-white'
                        : 'bg-surface-dim text-on-surface-variant'
                    )}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
