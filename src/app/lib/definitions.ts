export type User = {
  id: string;
  username: string;
  pwd_hash: string;
}

export type Goal = {
  id: string;
  title: string;
  owner: string;
  start_date: string;
  goal_time: number;
  progress: number;
  reset_date: string;
  complete: boolean;
  type: number;
  period: 'days' | 'weeks';
  must_advance_on: string | null;
  completions: string[];
}

export type SessionUser = {
  id: string;
  username: string;
}
