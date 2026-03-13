export type UserRole = 'manager' | 'qa';

export type TaskStatus = 'in_progress' | 'completed' | 'blocked' | 'not_started';

export type MemberStatus = 'active' | 'available' | 'on_leave' | 'busy';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  squad: string;
  avatar?: string;
  status: MemberStatus;
  projects: string[];
  currentTask?: string;
  capacity: number; // 0-100
}

export interface Squad {
  id: string;
  name: string;
  projects: string[];
  members: User[];
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  squad: string;
  project: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  jiraKey?: string;
  testpadRunId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  description?: string;
}

export interface JiraTicket {
  key: string;
  summary: string;
  status: string;
  assignee: string;
  priority: string;
  updated: string;
  project: string;
}

export interface TestpadRun {
  id: string;
  name: string;
  status: string;
  progress: number;
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  assignee: string;
  project: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
