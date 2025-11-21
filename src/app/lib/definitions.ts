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
  completions: string[];
  flight_log_events: Record<string, string>;
}

export type SessionUser = {
  id: string;
  username: string;
}
