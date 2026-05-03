import React, { useState } from 'react';
import { Kid, Task } from '../types';
import TaskCard from './TaskCard';
import { Wallet, Star, Trophy, ArrowRight, Zap, Home, ClipboardList, Gift, Coins } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface KidDashboardProps {
  kids: Kid[];
  tasks: Task[];
  onRefresh: () => void;
}

export default function KidDashboard({ kids, tasks, onRefresh }: KidDashboardProps) {
  // For demo, we just pick the first kid (Bilal)
  const currentKid = kids.find(k => k.id === 'bilal') || kids[0];
  const kidTasks = tasks.filter(t => t.assignedTo === currentKid.id);
  const pendingTasks = kidTasks.filter(t => !t.completed);

  const handleComplete = async (taskId: number) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' });
      if (res.ok) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
      {/* Kid Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary-container overflow-hidden shadow-lg p-0.5 bg-white">
            <img src={currentKid.avatar} alt={currentKid.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary">Salam, {currentKid.name}! 🌟</h1>
            <p className="text-on-surface-variant font-medium">Ready to earn some awesome rewards?</p>
          </div>
        </div>
        <button className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-outline-variant flex items-center justify-center text-primary-container">
          <Trophy size={28} />
        </button>
      </header>

      {/* Point Bank Card */}
      <section className="bg-secondary-container rounded-3xl p-8 relative overflow-hidden shadow-lg group border-b-8 border-secondary active:border-b-4 active:translate-y-1 transition-all">
        <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
          <Wallet size={200} />
        </div>
        <div className="relative z-10">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-secondary-container mb-2">My Point Bank</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-on-secondary-fixed">{currentKid.points.toLocaleString()}</span>
            <span className="text-xl font-bold text-on-secondary-fixed/50">pts</span>
          </div>
          <div className="mt-8 flex gap-3">
            <button className="flex-1 bg-white text-secondary font-bold py-4 rounded-2xl shadow-[0_4px_0_0_#855300] active:shadow-none active:translate-y-1 transition-all">
              Withdraw
            </button>
            <button className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-[0_4px_0_0_#003c0b] active:shadow-none active:translate-y-1 transition-all">
              Add Goal
            </button>
          </div>
        </div>
      </section>

      {/* Today's Missions */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-on-surface">Today's Missions</h3>
          <span className={cn(
            "px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider",
            pendingTasks.length > 0 ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-primary-fixed text-on-primary-fixed"
          )}>
            {pendingTasks.length === 0 ? "All Done! 🎉" : `${pendingTasks.length} Missions Left`}
          </span>
        </div>

        <div className="space-y-4">
          {kidTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              showAssignee={false} 
              onComplete={handleComplete} 
            />
          ))}
        </div>
      </section>

      {/* Motivational Speech Bubble */}
      <section className="flex items-end gap-4 py-6">
        <div className="w-16 h-16 shrink-0 bg-primary-container/20 rounded-full flex items-center justify-center p-2 border-2 border-white shadow-md">
           <Zap className="text-primary-container fill-primary-container" size={32} />
        </div>
        <div className="bg-white p-6 rounded-3xl rounded-bl-none shadow-xl border border-outline-variant flex-grow">
          <p className="text-on-surface-variant font-bold leading-relaxed">
            You're doing great! You're only <span className="text-primary font-black">50 points</span> away from your weekly goal. Keep it up!
          </p>
          <div className="mt-4 w-full bg-surface-container h-4 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '85%' }}
               className="bg-primary-container h-full rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Bottom Nav Mockup */}
      <nav className="fixed bottom-0 left-0 w-full h-24 bg-white border-t rounded-t-[40px] shadow-2xl flex justify-around items-center px-4 pb-4">
        {[
          { icon: <Home />, label: "Home", active: true },
          { icon: <ClipboardList />, label: "Tasks", active: false },
          { icon: <Gift />, label: "Wishes", active: false },
          { icon: <Coins />, label: "Bank", active: false }
        ].map((item, i) => (
          <div key={i} className={cn(
            "flex flex-col items-center justify-center px-6 py-2 rounded-2xl transition-all cursor-pointer",
            item.active ? "bg-secondary-container text-on-secondary-container shadow-md translate-y-[-8px]" : "text-on-surface-variant opacity-60"
          )}>
            {item.icon}
            <span className="text-[11px] font-black uppercase tracking-wider mt-1">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
