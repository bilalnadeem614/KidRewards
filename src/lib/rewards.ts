import { ApprovalRequest } from '../types';

export interface RewardSettings {
  rewardLabel: string;
  rewardTargetPoints: number;
  approvalRequired: boolean;
}

const SETTINGS_KEY = 'kidrewards_reward_settings';
const APPROVALS_KEY = 'kidrewards_approval_requests';

export const defaultRewardSettings: RewardSettings = {
  rewardLabel: 'Weekend Movie Night',
  rewardTargetPoints: 500,
  approvalRequired: false,
};

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const loadRewardSettings = (): RewardSettings => {
  if (!canUseStorage()) {
    return defaultRewardSettings;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return defaultRewardSettings;
    }

    return { ...defaultRewardSettings, ...JSON.parse(raw) };
  } catch {
    return defaultRewardSettings;
  }
};

export const saveRewardSettings = (settings: RewardSettings) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadApprovalRequests = (): ApprovalRequest[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(APPROVALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveApprovalRequests = (requests: ApprovalRequest[]) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(APPROVALS_KEY, JSON.stringify(requests));
};

export const addApprovalRequest = (request: ApprovalRequest) => {
  const requests = loadApprovalRequests();
  const exists = requests.some(item => {
    if (request.type === 'task') {
      return item.taskId === request.taskId && item.type === 'task';
    } else {
      return item.goalId === request.goalId && item.type === 'goal';
    }
  });

  if (exists) {
    return requests;
  }

  const nextRequests = [request, ...requests];
  saveApprovalRequests(nextRequests);
  return nextRequests;
};

export const removeApprovalRequest = (taskId?: number, goalId?: string) => {
  const requests = loadApprovalRequests().filter(request => {
    if (taskId) {
      return request.taskId !== taskId;
    } else if (goalId) {
      return request.goalId !== goalId;
    }
    return true;
  });
  saveApprovalRequests(requests);
  return requests;
};