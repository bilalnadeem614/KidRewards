export interface RewardSettings {
  rewardLabel: string;
  rewardTargetPoints: number;
  approvalRequired: boolean;
}

export interface ApprovalRequest {
  taskId: number;
  kidId: string;
  kidName: string;
  taskTitle: string;
  points: number;
  requestedAt: string;
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
  const exists = requests.some(item => item.taskId === request.taskId);

  if (exists) {
    return requests;
  }

  const nextRequests = [request, ...requests];
  saveApprovalRequests(nextRequests);
  return nextRequests;
};

export const removeApprovalRequest = (taskId: number) => {
  const requests = loadApprovalRequests().filter(request => request.taskId !== taskId);
  saveApprovalRequests(requests);
  return requests;
};