import postgres from "postgres";
import {
  Goal
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchGoals() {
  try {
    // Fetch only finite goals (time-limited, not infinite)
    const data = await sql<Goal[]>`
      SELECT * FROM goals 
      WHERE complete = false 
        AND type = 0
        AND goal_time > 0
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
    const data = await sql<Goal[]>`
      SELECT * FROM goals 
      WHERE complete = true
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
    // For future implementation - fetch infinite goals
    const data = await sql<Goal[]>`
      SELECT * FROM goals 
      WHERE complete = false 
        AND (type = 1 OR goal_time = 0)
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
  
  return {
    currentDays,
    totalDays,
    progress: progressPercentage,
    isComplete: currentDays >= totalDays,
  };
}
