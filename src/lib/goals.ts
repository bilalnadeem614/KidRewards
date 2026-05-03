export interface Goal {
  id: string;
  kidId: string;
  title: string;
  targetPoints: number;
  description: string;
  completed: boolean;
  createdAt: string;
}

const GOALS_KEY = 'kidrewards_goals';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const loadGoals = (kidId: string): Goal[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(GOALS_KEY);
    if (!raw) {
      return [];
    }

    const allGoals: Goal[] = JSON.parse(raw);
    return allGoals.filter(goal => goal.kidId === kidId);
  } catch {
    return [];
  }
};

export const saveGoal = (goal: Omit<Goal, 'id' | 'createdAt'>): Goal => {
  if (!canUseStorage()) {
    throw new Error('localStorage not available');
  }

  const newGoal: Goal = {
    ...goal,
    id: `goal_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const allGoals = getAllGoals();
  allGoals.push(newGoal);
  window.localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));

  return newGoal;
};

export const completeGoal = (goalId: string): void => {
  if (!canUseStorage()) {
    return;
  }

  const allGoals = getAllGoals();
  const goal = allGoals.find(g => g.id === goalId);
  if (goal) {
    goal.completed = true;
    window.localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
  }
};

export const removeGoal = (goalId: string): void => {
  if (!canUseStorage()) {
    return;
  }

  const allGoals = getAllGoals().filter(g => g.id !== goalId);
  window.localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
};

const getAllGoals = (): Goal[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(GOALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
