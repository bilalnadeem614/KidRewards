import React, { useState } from 'react';
import { Kid, Task } from '../types';
import TaskCard from './TaskCard';
import { Wallet, Star, Trophy, ArrowRight, Zap, Home, ClipboardList, Gift, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import WishListCreator from './WishListCreator';
import WithdrawModal from './WithdrawModal';

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
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [localKidPoints, setLocalKidPoints] = useState(currentKid?.points ?? 0);
  const [showWishListCreator, setShowWishListCreator] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeNav, setActiveNav] = useState<'home' | 'tasks' | 'wishes' | 'bank'>('home');

  if (!currentKid) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">No kid profile found</h1>
          <p className="text-on-surface-variant">Add a kid profile to view the child dashboard.</p>
        </div>
      </div>
    );
  }

  const kidTasks = tasks.filter(t => t.assignedTo === currentKid.id);
  const pendingTasks = kidTasks.filter(t => !t.completed);

  const renderSection = () => {
    switch (activeNav) {
      case 'tasks':
        return (
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
        );

      case 'wishes':
        return (
          <section className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border border-outline-variant">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-on-surface">My Wishes</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant">Create a new goal or wishlist item.</p>
                </div>
                <button
                  onClick={() => setShowWishListCreator(true)}
                  className="bg-primary text-white font-bold px-4 py-2 rounded-xl text-sm hover:scale-105 active:scale-95 transition-all"
                >
                  Add Goal
                </button>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-5 sm:p-6">
              <h4 className="text-base sm:text-lg font-bold text-on-surface mb-2">🎁 Next Wish</h4>
              <p className="text-sm sm:text-base text-on-surface-variant">Weekend Movie Night</p>
              <div className="mt-4 w-full bg-surface-container h-3 sm:h-4 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  key={localKidPoints}
                  animate={{ width: `${Math.min(100, (localKidPoints / 500) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="bg-gradient-to-r from-primary to-secondary-container h-full rounded-full shadow-[0_0_8px_rgba(0,150,70,0.3)]"
                />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-on-surface-variant">{Math.max(0, 500 - localKidPoints)} Rs. left to reach this wish.</p>
            </div>
          </section>
        );

      case 'bank':
        return (
          <section className="space-y-4 sm:space-y-6">
            <div className="bg-secondary-container rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg group border-b-8 border-secondary active:border-b-4 active:translate-y-1 transition-all">
              <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
                <Wallet size={150} className="sm:w-[200px]" />
              </div>
              <div className="relative z-10">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-secondary-container mb-2">My Point Bank</h2>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <span className="text-4xl sm:text-6xl font-black text-on-secondary-fixed">{localKidPoints.toLocaleString()}</span>
                  <span className="text-lg sm:text-xl font-bold text-on-secondary-fixed/50">Rs.</span>
                </div>
                <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-3">
                  <button 
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex-1 bg-white text-secondary font-bold py-3 sm:py-4 rounded-2xl shadow-[0_4px_0_0_#855300] active:shadow-none active:translate-y-1 transition-all text-sm sm:text-base"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border border-outline-variant">
              <h4 className="text-base sm:text-lg font-bold text-on-surface mb-2">Bank Summary</h4>
              <p className="text-sm text-on-surface-variant">Track your earnings and withdraw when you want to redeem rewards.</p>
            </div>
          </section>
        );

      case 'home':
      default:
        return (
          <>
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
                  <button 
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex-1 bg-white text-secondary font-bold py-3 sm:py-4 rounded-2xl shadow-[0_4px_0_0_#855300] active:shadow-none active:translate-y-1 transition-all text-sm sm:text-base"
                  >
                    Withdraw
                  </button>
                  <button 
                    onClick={() => setShowWishListCreator(true)}
                    className="flex-1 bg-primary text-white font-bold py-3 sm:py-4 rounded-2xl shadow-[0_4px_0_0_#003c0b] active:shadow-none active:translate-y-1 transition-all text-sm sm:text-base"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            </section>

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
          </>
        );
    }
  };

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

  const handleAddGoal = (goal: { title: string; targetPoints: number; description: string }) => {
    console.log('Goal added:', goal);
    // Here you could save the goal to backend if needed
    const toastId = Date.now().toString();
    setToasts(prev => [...prev, {
      id: toastId,
      message: `Goal "${goal.title}" created!`,
      taskTitle: goal.title
    }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4000);
  };

  const handleWithdraw = (amount: number) => {
    console.log('Withdrew:', amount);
    // Here you could save the withdrawal to backend if needed
    setLocalKidPoints(prev => Math.max(0, prev - amount));
    const toastId = Date.now().toString();
    setToasts(prev => [...prev, {
      id: toastId,
      message: `Successfully withdrew Rs. ${amount}!`,
      taskTitle: 'Withdrawal'
    }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4000);
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

      {renderSection()}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full h-20 sm:h-24 bg-white border-t border-outline-variant shadow-2xl flex justify-around items-center px-2 sm:px-4">
        <button
          onClick={() => setActiveNav('home')}
          className={cn(
            "flex flex-col items-center justify-center px-2 sm:px-6 py-1 sm:py-2 rounded-2xl transition-all cursor-pointer",
            activeNav === 'home' ? "bg-secondary-container text-on-secondary-container shadow-md -translate-y-2" : "text-on-surface-variant opacity-60 hover:opacity-100"
          )}
        >
          <Home size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider mt-1">Home</span>
        </button>
        <button
          onClick={() => setActiveNav('tasks')}
          className={cn(
            "flex flex-col items-center justify-center px-2 sm:px-6 py-1 sm:py-2 rounded-2xl transition-all cursor-pointer",
            activeNav === 'tasks' ? "bg-secondary-container text-on-secondary-container shadow-md -translate-y-2" : "text-on-surface-variant opacity-60 hover:opacity-100"
          )}
        >
          <ClipboardList size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider mt-1">Tasks</span>
        </button>
        <button
          onClick={() => setActiveNav('wishes')}
          className={cn(
            "flex flex-col items-center justify-center px-2 sm:px-6 py-1 sm:py-2 rounded-2xl transition-all cursor-pointer",
            activeNav === 'wishes' ? "bg-secondary-container text-on-secondary-container shadow-md -translate-y-2" : "text-on-surface-variant opacity-60 hover:opacity-100"
          )}
        >
          <Gift size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider mt-1">Wishes</span>
        </button>
        <button
          onClick={() => setActiveNav('bank')}
          className={cn(
            "flex flex-col items-center justify-center px-2 sm:px-6 py-1 sm:py-2 rounded-2xl transition-all cursor-pointer",
            activeNav === 'bank' ? "bg-secondary-container text-on-secondary-container shadow-md -translate-y-2" : "text-on-surface-variant opacity-60 hover:opacity-100"
          )}
        >
          <Coins size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider mt-1">Bank</span>
        </button>
      </nav>

      {/* WishListCreator Modal */}
      {showWishListCreator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <WishListCreator 
            onClose={() => setShowWishListCreator(false)} 
            kidId={currentKid.id}
            onAddGoal={handleAddGoal}
          />
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <WithdrawModal 
            onClose={() => setShowWithdrawModal(false)} 
            availablePoints={localKidPoints}
            onWithdraw={handleWithdraw}
          />
        </div>
      )}
    </div>
    </div>
  );
}
