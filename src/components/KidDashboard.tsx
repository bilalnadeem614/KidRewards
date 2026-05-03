import React, { useState } from 'react';
import { Kid, Task } from '../types';
import TaskCard from './TaskCard';
import { Wallet, Star, Trophy, ArrowRight, Zap, Home, ClipboardList, Gift, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface KidDashboardProps {
  kids: Kid[];
  tasks: Task[];
  onRefresh: () => void;
}

interface ToastMessage {
  id: string;
  message: string;
  taskTitle: string;
}

export default function KidDashboard({ kids, tasks, onRefresh }: KidDashboardProps) {
  // For demo, we just pick the first kid (Bilal)
  const currentKid = kids.find(k => k.id === 'bilal') || kids[0];
  const kidTasks = tasks.filter(t => t.assignedTo === currentKid.id);
  const pendingTasks = kidTasks.filter(t => !t.completed);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [localKidPoints, setLocalKidPoints] = useState(currentKid.points);

  const handleComplete = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Call motivate endpoint for celebration message
      const motivateRes = await fetch('/api/ai/motivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kidName: currentKid.name,
          taskName: task.title
        })
      });

      let motivationMessage = '🎉 Amazing work!';
      if (motivateRes.ok) {
        const motivateData = await motivateRes.json();
        motivationMessage = motivateData.message;
      }

      // Show toast with motivation message
      const toastId = Date.now().toString();
      setToasts(prev => [...prev, {
        id: toastId,
        message: motivationMessage,
        taskTitle: task.title
      }]);

      // Auto-remove toast after 4 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 4000);

      // Update points locally immediately
      setLocalKidPoints(prev => prev + task.points);

      // Mark task as complete on server
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' });
      if (res.ok) onRefresh();
    } catch (e) {
      console.error('Error completing task:', e);
    }
  };

  return (
    <div className="min-h-screen bg-surface max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-32 sm:pb-24 space-y-6 sm:space-y-8">
      {/* Kid Header with Toast Notifications */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 relative">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-primary-container overflow-hidden shadow-lg p-0.5 bg-white">
              <img src={currentKid.avatar} alt={currentKid.name} className="w-full h-full rounded-full object-cover" />
            </div>
            
            {/* Toast Notifications */}
            <AnimatePresence>
              {toasts.map((toast, idx) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, scale: 0.3, x: -20, y: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.3, x: -20, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="absolute -top-12 -right-20 bg-gradient-to-r from-secondary to-secondary-container text-on-secondary rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-black shadow-xl whitespace-nowrap z-50"
                >
                  ✨ {toast.message.substring(0, 35)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-primary break-words">Salam, {currentKid.name}! 🌟</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium">Ready to earn rewards?</p>
          </div>
        </div>
        <button className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-outline-variant flex items-center justify-center text-primary-container shrink-0">
          <Trophy size={24} />
        </button>
      </header>

      {/* Point Bank Card */}
      <section className="bg-secondary-container rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg group border-b-8 border-secondary active:border-b-4 active:translate-y-1 transition-all">
        <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
          <Wallet size={150} className="sm:w-[200px]" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-secondary-container mb-2">My Point Bank</h2>
          <motion.div 
            key={localKidPoints}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-baseline gap-1 sm:gap-2"
          >
            <span className="text-4xl sm:text-6xl font-black text-on-secondary-fixed">{localKidPoints.toLocaleString()}</span>
            <span className="text-lg sm:text-xl font-bold text-on-secondary-fixed/50">Rs.</span>
          </motion.div>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button className="flex-1 bg-white text-secondary font-bold py-3 sm:py-4 rounded-2xl shadow-[0_4px_0_0_#855300] active:shadow-none active:translate-y-1 transition-all text-sm sm:text-base">
              Withdraw
            </button>
            <button className="flex-1 bg-primary text-white font-bold py-3 sm:py-4 rounded-2xl shadow-[0_4px_0_0_#003c0b] active:shadow-none active:translate-y-1 transition-all text-sm sm:text-base">
              Add Goal
            </button>
          </div>
        </div>
      </section>

      {/* Today's Missions */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-on-surface">Today's Missions</h3>
          <span className={cn(
            "px-3 sm:px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap",
            pendingTasks.length > 0 ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-primary-fixed text-on-primary-fixed"
          )}>
            {pendingTasks.length === 0 ? "All Done! 🎉" : `${pendingTasks.length} Missions Left`}
          </span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {kidTasks.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl text-center text-on-surface-variant">
              <p>No tasks yet. Start by creating one!</p>
            </div>
          ) : (
            kidTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                showAssignee={false} 
                onComplete={handleComplete} 
              />
            ))
          )}
        </div>
      </section>

      {/* Next Wish Progress Bar */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border border-outline-variant">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface">🎁 Next Wish</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant">Weekend Movie Night</p>
            </div>
            <div className="text-right text-sm">
              <div className="font-bold text-primary text-sm">Rs. {localKidPoints} / Rs. 500</div>
              <div className="text-xs text-on-surface-variant">{Math.round((localKidPoints / 500) * 100)}% Complete</div>
            </div>
          </div>
          <div className="w-full bg-surface-container h-3 sm:h-4 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              key={localKidPoints}
              animate={{ width: `${(localKidPoints / 500) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="bg-gradient-to-r from-primary to-secondary-container h-full rounded-full shadow-[0_0_8px_rgba(0,150,70,0.3)]"
            />
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant font-semibold">
            <span>Start</span>
            <span>{Math.max(0, 500 - localKidPoints)} Rs. to go!</span>
          </div>
        </div>
      </section>

      {/* Bottom Nav Mockup */}
      <nav className="fixed bottom-0 left-0 w-full h-20 sm:h-24 bg-white border-t border-outline-variant shadow-2xl flex justify-around items-center px-2 sm:px-4">
        {[
          { icon: <Home size={20} className="sm:w-6 sm:h-6" />, label: "Home", active: true },
          { icon: <ClipboardList size={20} className="sm:w-6 sm:h-6" />, label: "Tasks", active: false },
          { icon: <Gift size={20} className="sm:w-6 sm:h-6" />, label: "Wishes", active: false },
          { icon: <Coins size={20} className="sm:w-6 sm:h-6" />, label: "Bank", active: false }
        ].map((item, i) => (
          <div key={i} className={cn(
            "flex flex-col items-center justify-center px-2 sm:px-6 py-1 sm:py-2 rounded-2xl transition-all cursor-pointer",
            item.active ? "bg-secondary-container text-on-secondary-container shadow-md translate-y-[-8px]" : "text-on-surface-variant opacity-60"
          )}>
            {item.icon}
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider mt-1">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
    </div>
  );
}
