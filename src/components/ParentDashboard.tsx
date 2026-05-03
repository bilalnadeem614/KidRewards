import React, { useState } from 'react';
import { Kid, Task } from '../types';
import TaskCard from './TaskCard';
import { Bell, TrendingUp, Search, Calendar, ChevronRight, User, Baby, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import AITaskSuggester from './AITaskSuggester';
import { cn } from '../lib/utils';

interface ParentDashboardProps {
  kids: Kid[];
  tasks: Task[];
  onRefresh: () => void;
}

export default function ParentDashboard({ kids, tasks, onRefresh }: ParentDashboardProps) {
  const [selectedKid, setSelectedKid] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);

  const filteredTasks = selectedKid 
    ? tasks.filter(t => t.assignedTo === selectedKid)
    : tasks;

  const totalPointsAwarded = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-teal-700">KidRewards</h1>
            <span className="text-[10px] uppercase font-bold text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded">Parent Mode</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {kids.map(kid => (
              <img 
                key={kid.id}
                src={kid.avatar} 
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                alt={kid.name}
              />
            ))}
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <Bell size={24} />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-primary">
          <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Active Tasks</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-on-surface">{tasks.filter(t => !t.completed).length}</h2>
            <span className="text-xs text-primary flex items-center gap-1">
              <TrendingUp size={12} /> +3
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-secondary">
          <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Points Managed</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-secondary font-mono">{totalPointsAwarded}</h2>
          </div>
        </div>
      </div>

      {/* Kid Selection */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
        <button 
          onClick={() => setSelectedKid(null)}
          className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${!selectedKid ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-on-surface-variant'}`}
        >
          All Kids
        </button>
        {kids.map(kid => (
          <button 
            key={kid.id}
            onClick={() => setSelectedKid(kid.id)}
            className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${selectedKid === kid.id ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-on-surface-variant'}`}
          >
            {kid.name}
          </button>
        ))}
      </div>

      {/* Today's Tasks Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-on-surface">Recent Activity</h3>
        <button className="text-sm font-bold text-primary flex items-center gap-1">
          View All <ChevronRight size={16} />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4 mb-12">
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Weekly Milestone */}
      <div className="bg-primary/90 text-white p-6 rounded-3xl relative overflow-hidden mb-12">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-1">Motivation Center</h3>
          <p className="text-sm opacity-80 mb-6">Bilal is only 15 points away from the "Weekend Movie" reward!</p>
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-primary-fixed h-full rounded-full shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold">
            <span>185 / 200 pts</span>
            <span className="text-primary-fixed">85% Complete</span>
          </div>
        </div>
      </div>

      {/* AI Suggester Modal Trigger */}
      <div className="fixed bottom-24 right-4 flex flex-col gap-3">
        <button 
          onClick={() => setShowAI(true)}
          className="bg-secondary-container text-on-secondary-container w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Sparkles size={24} />
        </button>
        <button className="bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          <Plus size={32} />
        </button>
      </div>

      {/* AI Modal */}
      {showAI && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg"
          >
            <AITaskSuggester onClose={() => setShowAI(false)} onRefresh={onRefresh} kids={kids} />
          </motion.div>
        </div>
      )}

      {/* Bottom Nav Mockup */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-white border-t flex justify-around items-center px-4">
        {[
          { icon: <Baby />, label: "Kids", active: false },
          { icon: <Calendar />, label: "Tasks", active: true },
          { icon: <TrendingUp />, label: "Reports", active: false },
          { icon: <Search />, label: "Settings", active: false }
        ].map((item, i) => (
          <div key={i} className={cn("flex flex-col items-center gap-1", item.active ? "text-primary" : "text-on-surface-variant")}>
            <div className={cn("p-2 rounded-xl", item.active && "bg-primary/10")}>{item.icon}</div>
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

