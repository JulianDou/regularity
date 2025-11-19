import postgres from "postgres";
import {
  Goal
} from './definitions';
import { requireAuth } from './session';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchGoals() {
  try {
    const user = await requireAuth();
    
    // Fetch only finite goals (time-limited, not infinite) for the current user
    const data = await sql<Goal[]>`
      SELECT * FROM goals 
      WHERE complete = false 
        AND type = 0
        AND goal_time > 0
        AND owner = ${user.id}
      ORDER BY start_date DESC;
    `;
    return data;
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
}

export async function fetchCompletedGoals() {
  try {
    const user = await requireAuth();
    
    const data = await sql<Goal[]>`
      SELECT * FROM goals 
      WHERE complete = true
        AND owner = ${user.id}
      ORDER BY start_date DESC;
    `;
    return data;
  } catch (error) {
    console.error("Error fetching completed goals:", error);
    return [];
  }
}

export async function fetchInfiniteGoals() {
  try {
    const user = await requireAuth();
    
    // For future implementation - fetch infinite goals for the current user
    const data = await sql<Goal[]>`
      SELECT * FROM goals 
      WHERE complete = false 
        AND (type = 1 OR goal_time = 0)
        AND owner = ${user.id}
      ORDER BY start_date DESC;
    `;
    return data;
  } catch (error) {
    console.error("Error fetching infinite goals:", error);
    return [];
  }
}

export function calculateGoalProgress(goal: Goal) {
  // Progress is now based on the stored progress value (days clicked)
  // not automatic time calculation
  const currentDays = goal.progress; // progress field stores number of days/clicks
  const totalDays = Math.ceil(goal.goal_time / (60 * 60 * 24)); // Convert seconds to days
  const progressPercentage = Math.min(100, Math.round((currentDays / totalDays) * 100));
  
  // Check if completed today
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const completedToday = goal.completions?.some(date => {
    // Normalize the date from database (could be timestamp or date string)
    const normalizedDate = new Date(date).toISOString().split('T')[0];
    return normalizedDate === today;
  }) || false;
  
  return {
    currentDays,
    totalDays,
    progress: progressPercentage,
    isComplete: currentDays >= totalDays,
    completedToday,
  };
}
