export interface Task {
  id: number;
  title: string;
  points: number;
  assignedTo: string;
  category: string;
  completed: boolean;
  recurrence: 'daily' | 'weekly' | 'none';
  createdAt: string;
}

export interface Kid {
  id: string;
  name: string;
  points: number;
  avatar: string;
}

export interface AITaskSuggestion {
  title: string;
  points: number;
  category: string;
  description: string;
}

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
