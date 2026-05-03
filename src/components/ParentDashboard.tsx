import React, { useState } from 'react';
import { Kid, Task } from '../types';
import TaskCard from './TaskCard';
import { Bell, TrendingUp, Search, Calendar, ChevronRight, User, Baby, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import AITaskSuggester from './AITaskSuggester';
import ActivityLog from './ActivityLog';
import TaskCreatorModal from './TaskCreatorModal';
import { cn } from '../lib/utils';
import { ApprovalRequest, RewardSettings } from '../types';
import { loadApprovalRequests, loadRewardSettings, removeApprovalRequest, saveRewardSettings } from '../lib/rewards';

interface ParentDashboardProps {
  kids: Kid[];
  tasks: Task[];
  onRefresh: () => void;
}

export default function ParentDashboard({ kids, tasks, onRefresh }: ParentDashboardProps) {
  const [selectedKid, setSelectedKid] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [activeNav, setActiveNav] = useState<'kids' | 'tasks' | 'reports' | 'settings'>('tasks');
  const [rewardSettings, setRewardSettings] = useState<RewardSettings>(() => loadRewardSettings());
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>(() => loadApprovalRequests());
  const [saveNotice, setSaveNotice] = useState('');

  const filteredTasks = selectedKid 
    ? tasks.filter(t => t.assignedTo === selectedKid)
    : tasks;

  const totalPointsAwarded = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);

  const renderSection = () => {
    switch (activeNav) {
      case 'kids':
        return (
          <section className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-outline-variant">
              <h3 className="text-lg sm:text-xl font-bold text-on-surface mb-2">Kids Overview</h3>
              <p className="text-sm text-on-surface-variant">Tap a child to focus the task list.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {kids.map(kid => (
                <button
                  key={kid.id}
                  onClick={() => setSelectedKid(kid.id)}
                  className={cn(
                    "text-left bg-white p-4 sm:p-5 rounded-2xl shadow-sm border transition-all",
                    selectedKid === kid.id ? "border-primary ring-2 ring-primary/20" : "border-outline-variant hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img src={kid.avatar} alt={kid.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div>
                      <h4 className="font-bold text-on-surface">{kid.name}</h4>
                      <p className="text-sm text-on-surface-variant">Rs. {kid.points} points</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        );

      case 'reports':
        return <ActivityLog tasks={tasks} kids={kids} onBack={() => setActiveNav('tasks')} />;

      case 'settings':
        return (
          <section className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-outline-variant">
              <h3 className="text-lg sm:text-xl font-bold text-on-surface mb-2">Settings</h3>
              <p className="text-sm text-on-surface-variant">Configure the main reward and decide whether kids need approval before earning points.</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-outline-variant space-y-4">
              <div>
                <p className="text-xs font-bold uppercase text-on-surface-variant mb-2">Reward Setup</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Reward Label</label>
                    <input
                      value={rewardSettings.rewardLabel}
                      onChange={e => setRewardSettings(prev => ({ ...prev, rewardLabel: e.target.value }))}
                      className="w-full bg-surface-container border border-outline-variant rounded-xl h-11 px-3 text-sm"
                      placeholder="Weekend Movie Night"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Target Points</label>
                    <input
                      type="number"
                      min="1"
                      value={rewardSettings.rewardTargetPoints}
                      onChange={e => setRewardSettings(prev => ({ ...prev, rewardTargetPoints: Number(e.target.value) || 0 }))}
                      className="w-full bg-surface-container border border-outline-variant rounded-xl h-11 px-3 text-sm"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 bg-surface-container rounded-2xl px-4 py-3">
                <input
                  type="checkbox"
                  checked={rewardSettings.approvalRequired}
                  onChange={e => setRewardSettings(prev => ({ ...prev, approvalRequired: e.target.checked }))}
                  className="w-4 h-4"
                />
                <div>
                  <p className="text-sm font-semibold text-on-surface">Require parent approval before points are awarded</p>
                  <p className="text-xs text-on-surface-variant">When enabled, kids send completion requests and you approve them here.</p>
                </div>
              </label>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    saveRewardSettings(rewardSettings);
                    setPendingApprovals(loadApprovalRequests());
                    setSaveNotice('Settings saved');
                    window.setTimeout(() => setSaveNotice(''), 2000);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                >
                  Save Settings
                </button>
                {saveNotice && <span className="text-sm text-primary font-semibold">{saveNotice}</span>}
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-outline-variant space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Pending Approvals</p>
                  <h4 className="text-base sm:text-lg font-bold text-on-surface">Review kid completion requests</h4>
                </div>
                <button
                  onClick={() => setPendingApprovals(loadApprovalRequests())}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Refresh
                </button>
              </div>

              {pendingApprovals.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No pending approvals right now.</p>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map(request => (
                    <div key={request.taskId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container border border-outline-variant">
                      <div>
                        <p className="font-bold text-on-surface">{request.taskTitle}</p>
                        <p className="text-xs text-on-surface-variant">{request.kidName} requested approval for +Rs. {request.points}</p>
                      </div>
                      <button
                        onClick={async () => {
                          const res = await fetch(`/api/tasks/${request.taskId}/complete`, { method: 'POST' });
                          if (!res.ok) {
                            alert('Could not approve this task.');
                            return;
                          }

                          const nextRequests = removeApprovalRequest(request.taskId);
                          setPendingApprovals(nextRequests);
                          onRefresh();
                        }}
                        className="bg-secondary text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
                      >
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'tasks':
      default:
        return (
          <>
            {/* Kid Selection */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4 sm:mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
              <button 
                onClick={() => setSelectedKid(null)}
                className={`px-4 sm:px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm sm:text-base ${!selectedKid ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-on-surface-variant'}`}
              >
                All Kids
              </button>
              {kids.map(kid => (
                <button 
                  key={kid.id}
                  onClick={() => setSelectedKid(kid.id)}
                  className={`px-4 sm:px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm sm:text-base ${selectedKid === kid.id ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-on-surface-variant'}`}
                >
                  {kid.name}
                </button>
              ))}
            </div>

            {/* Today's Tasks Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-on-surface">Recent Activity</h3>
              <button 
                onClick={() => setActiveNav('reports')}
                className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-3 sm:space-y-4 mb-12">
              {filteredTasks.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl text-center text-on-surface-variant">
                  <p>No tasks yet. Create your first task!</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>

            {/* Weekly Milestone */}
            <div className="bg-primary/90 text-white p-5 sm:p-6 rounded-3xl relative overflow-hidden mb-12">
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold mb-1">Motivation Center</h3>
                <p className="text-xs sm:text-sm opacity-80 mb-4 sm:mb-6">Bilal is only 15 points away from the "Weekend Movie" reward!</p>
                <div className="w-full bg-white/20 h-2 sm:h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-primary-fixed h-full rounded-full shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold">
                  <span>Rs. 185 / Rs. 200</span>
                  <span className="text-primary-fixed">85% Complete</span>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-32 sm:pb-24">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-container rounded-xl flex items-center justify-center text-white">
            <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-teal-700">KidRewards</h1>
            <span className="text-[8px] sm:text-[10px] uppercase font-bold text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded inline-block">Parent Mode</span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex -space-x-2 sm:-space-x-3">
            {kids.map(kid => (
              <img 
                key={kid.id}
                src={kid.avatar} 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover shadow-sm"
                alt={kid.name}
              />
            ))}
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <Bell size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border-t-4 border-primary">
          <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Active Tasks</p>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <h2 className="text-2xl sm:text-4xl font-bold text-on-surface">{tasks.filter(t => !t.completed).length}</h2>
            <span className="text-xs text-primary flex items-center gap-0.5">
              <TrendingUp size={12} /> +3
            </span>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border-t-4 border-secondary">
          <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Points Managed</p>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <h2 className="text-2xl sm:text-4xl font-bold text-secondary font-mono">{totalPointsAwarded}</h2>
          </div>
        </div>
      </div>
      {renderSection()}

      {/* AI Suggester Modal Trigger */}
      <div className="fixed bottom-24 sm:bottom-20 right-3 sm:right-4 flex flex-col gap-2 sm:gap-3">
        <button 
          onClick={() => setShowAI(true)}
          className="bg-secondary-container text-on-secondary-container w-12 sm:w-14 h-12 sm:h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Sparkles size={20} className="sm:w-6 sm:h-6" />
        </button>
        <button 
          onClick={() => setShowTaskCreator(true)}
          className="bg-primary text-white w-12 sm:w-14 h-12 sm:h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Plus size={24} className="sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Task Creator Modal */}
      {showTaskCreator && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <TaskCreatorModal
              kids={kids}
              defaultKidId={selectedKid}
              onClose={() => setShowTaskCreator(false)}
              onCreated={onRefresh}
            />
          </motion.div>
        </div>
      )}

      {/* AI Modal */}
      {showAI && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <AITaskSuggester onClose={() => setShowAI(false)} onRefresh={onRefresh} kids={kids} />
          </motion.div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-white border-t border-outline-variant shadow-2xl flex justify-around items-center px-2 sm:px-4">
        <button
          onClick={() => setActiveNav('kids')}
          className={cn(
            "flex flex-col items-center gap-0.5 sm:gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer",
            activeNav === 'kids' ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <Baby size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase">Kids</span>
        </button>
        <button
          onClick={() => setActiveNav('tasks')}
          className={cn(
            "flex flex-col items-center gap-0.5 sm:gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer",
            activeNav === 'tasks' ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <Calendar size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase">Tasks</span>
        </button>
        <button
          onClick={() => setActiveNav('reports')}
          className={cn(
            "flex flex-col items-center gap-0.5 sm:gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer",
            activeNav === 'reports' ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <TrendingUp size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase">Reports</span>
        </button>
        <button
          onClick={() => setActiveNav('settings')}
          className={cn(
            "flex flex-col items-center gap-0.5 sm:gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer",
            activeNav === 'settings' ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <Search size={20} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase">Settings</span>
        </button>
      </nav>
      </div>
    </div>
  );
}

