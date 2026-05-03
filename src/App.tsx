import React, { useState, useEffect } from 'react';
import { Kid, Task } from './types';
import ParentDashboard from './components/ParentDashboard';
import KidDashboard from './components/KidDashboard';
import { User, Baby, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabType = 'parent' | 'kid';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('parent');
  const [kids, setKids] = useState<Kid[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [kidsRes, tasksRes] = await Promise.all([
        fetch('/api/kids'),
        fetch('/api/tasks')
      ]);
      const [kidsData, tasksData] = await Promise.all([
        kidsRes.json(),
        tasksRes.json()
      ]);
      setKids(kidsData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => fetchData();

  const renderContent = () => {
    switch (activeTab) {
      case 'parent':
        return <ParentDashboard kids={kids} tasks={tasks} onRefresh={refreshData} />;
      case 'kid':
        return <KidDashboard kids={kids} tasks={tasks} onRefresh={refreshData} />;
      default:
        return <ParentDashboard kids={kids} tasks={tasks} onRefresh={refreshData} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-primary"
        >
          <ShieldCheck size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Mode Switcher Floating Toggle */}
      <div className="fixed top-4 sm:top-20 right-2 sm:right-4 z-50">
        <button 
          onClick={() => setActiveTab(prev => prev === 'parent' ? 'kid' : 'parent')}
          className="bg-white/80 backdrop-blur-md border border-outline-variant p-1.5 sm:p-2 rounded-full shadow-lg flex items-center gap-1 sm:gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <div className={`p-1.5 sm:p-2 rounded-full transition-colors ${activeTab === 'parent' ? 'bg-primary text-white' : 'text-on-surface-variant'}`}>
            <User size={16} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          <div className={`p-1.5 sm:p-2 rounded-full transition-colors ${activeTab === 'kid' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant'}`}>
            <Baby size={16} className="sm:w-[18px] sm:h-[18px]" />
          </div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex-grow"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
