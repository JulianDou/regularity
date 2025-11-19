"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { requireAuth } from './session';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function advanceGoal(goalId: string) {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if already completed today and increment if not
    const result = await sql`
      UPDATE goals 
      SET progress = progress + 1,
          reset_date = CURRENT_TIMESTAMP,
          completions = array_append(completions, ${today}::date)
      WHERE id = ${goalId}
        AND NOT (${today}::date = ANY(completions))
      RETURNING progress, goal_time
    `;
    
    // If no rows were updated, it means the goal was already completed today
    if (result.length === 0) {
      return { success: false, error: "Already completed today" };
    }
    
    // Check if goal is complete
    if (result.length > 0) {
      const { progress, goal_time } = result[0];
      const totalDays = Math.ceil(goal_time / (60 * 60 * 24));
      
      if (progress >= totalDays) {
        // Auto-complete the goal if it reached its target
        await sql`
          UPDATE goals 
          SET complete = true
          WHERE id = ${goalId}
        `;
      }
    }
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error advancing goal:", error);
    return { success: false, error: "Failed to advance goal" };
  }
}

export async function resetGoal(goalId: string) {
  try {
    await sql`
      UPDATE goals 
      SET progress = 0,
          start_date = CURRENT_TIMESTAMP,
          reset_date = CURRENT_TIMESTAMP,
          completions = '{}'
      WHERE id = ${goalId}
    `;
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error resetting goal:", error);
    return { success: false, error: "Failed to reset goal" };
  }
}

export async function completeGoal(goalId: string) {
  try {
    await sql`
      UPDATE goals 
      SET complete = true
      WHERE id = ${goalId}
    `;
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error completing goal:", error);
    return { success: false, error: "Failed to complete goal" };
  }
}

export async function deleteGoal(goalId: string) {
  try {
    await sql`
      DELETE FROM goals 
      WHERE id = ${goalId}
    `;
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { success: false, error: "Failed to delete goal" };
  }
}

export async function revertCompletion(goalId: string) {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Revert the progress and remove today from completions
    const result = await sql`
      UPDATE goals 
      SET progress = GREATEST(0, progress - 1),
          completions = array_remove(completions, ${today}::date)
      WHERE id = ${goalId}
        AND ${today}::date = ANY(completions)
      RETURNING progress
    `;
    
    // If no rows were updated, it means there was no completion today
    if (result.length === 0) {
      return { success: false, error: "No completion to revert today" };
    }
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error reverting completion:", error);
    return { success: false, error: "Failed to revert completion" };
  }
}

export async function createGoal(formData: {
  title: string;
  days: number;
}) {
  try {
    const user = await requireAuth();
    const goalTimeInSeconds = formData.days * 24 * 60 * 60; // Convert days to seconds
    
    await sql`
      INSERT INTO goals (id, title, owner, start_date, goal_time, progress, reset_date, complete, type)
      VALUES (
        gen_random_uuid(),
        ${formData.title},
        ${user.id},
        CURRENT_TIMESTAMP,
        ${goalTimeInSeconds},
        0,
        CURRENT_TIMESTAMP,
        false,
        0
      )
    `;
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: "Failed to create goal" };
  }
}
