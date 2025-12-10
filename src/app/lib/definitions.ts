export type User = {
  id: string;
  username: string;
  pwd_hash: string;
  friends: string[]; // Array of user IDs
}

// Friend info returned when fetching profile data
export type FriendInfo = {
  id: string;
  username: string;
  mutual: boolean; // True if the friendship is reciprocal
}

// User profile with computed friend information
export type UserProfile = {
  id: string;
  username: string;
  friends: FriendInfo[];
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
