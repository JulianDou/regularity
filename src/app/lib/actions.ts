"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { requireAuth } from './session';

const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require',
  prepare: false // Disable prepared statements to avoid cached plan issues
});

export async function advanceGoal(goalId: string) {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // First, fetch the goal to check its period and must_advance_on
    const goalData = await sql`
      SELECT period, must_advance_on, completions 
      FROM goals 
      WHERE id = ${goalId}
    `;
    
    if (goalData.length === 0) {
      return { success: false, error: "Goal not found" };
    }
    
    const goal = goalData[0];
    
    // For weekly goals, check if already completed this week
    if (goal.period === 'weeks') {
      const todayDate = new Date(today);
      const dayOfWeek = todayDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      // Calculate the start of this week (Monday)
      const startOfWeek = new Date(todayDate);
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days; otherwise go to Monday
      startOfWeek.setDate(todayDate.getDate() + diff);
      startOfWeek.setHours(0, 0, 0, 0);
      const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
      
      // Check if must_advance_on is set and if today matches
      if (goal.must_advance_on) {
        const dayMap: { [key: string]: number } = {
          'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
          'thursday': 4, 'friday': 5, 'saturday': 6
        };
        const requiredDay = dayMap[goal.must_advance_on.toLowerCase()];
        
        if (dayOfWeek !== requiredDay) {
          const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
          return { 
            success: false, 
            error: `Cet objectif ne peut être validé que le ${dayNames[requiredDay]}` 
          };
        }
      }
      
      // Check if there's already a completion this week
      const hasCompletionThisWeek = goal.completions?.some((date: string) => {
        const completionDate = new Date(date).toISOString().split('T')[0];
        return completionDate >= startOfWeekStr;
      }) || false;
      
      if (hasCompletionThisWeek) {
        return { success: false, error: "Déjà validé cette semaine" };
      }
    }
    
    // For both daily and weekly goals, calculate progress as a percentage
    const result = await sql`
      UPDATE goals 
      SET completions = array_append(completions, ${today}::date),
        reset_date = CURRENT_TIMESTAMP
      WHERE id = ${goalId}
      AND NOT (${today}::date = ANY(completions))
      RETURNING completions, goal_time, period
    `;
    
    // Calculate progress percentage based on completions
    if (result.length > 0) {
      const { completions, goal_time, period } = result[0];
      const completionCount = completions?.length || 0;
      
      // Calculate total required completions based on period
      const totalDays = Math.ceil(goal_time / (60 * 60 * 24));
      const totalCompletions = period === 'weeks' ? totalDays / 7 : totalDays;
      
      // Calculate percentage (0-100)
      const progressPercentage = Math.min(100, Math.round((completionCount / totalCompletions) * 100));
      
      // Update progress with percentage
      await sql`
      UPDATE goals 
      SET progress = ${progressPercentage}
      WHERE id = ${goalId}
      `;
      
      // Return the updated result for the completion check below
      result[0].progress = progressPercentage;
    }
    
    // If no rows were updated, it means the goal was already completed today
    if (result.length === 0) {
      return { success: false, error: "Déjà validé aujourd'hui" };
    }
    
    // Check if goal is complete
    if (result.length > 0) {
      const { progress } = result[0];
      
      if (progress === 100) {
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
    
    // First, fetch the goal to check its period
    const goalData = await sql`
      SELECT period, completions, goal_time
      FROM goals 
      WHERE id = ${goalId}
    `;
    
    if (goalData.length === 0) {
      return { success: false, error: "Goal not found" };
    }
    
    const goal = goalData[0];
    let canRevert = false;
    
    if (goal.period === 'weeks') {
      // For weekly goals, check if there's a completion this week
      const todayDate = new Date(today);
      const dayOfWeek = todayDate.getDay();
      
      // Calculate the start of this week (Monday)
      const startOfWeek = new Date(todayDate);
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startOfWeek.setDate(todayDate.getDate() + diff);
      startOfWeek.setHours(0, 0, 0, 0);
      const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
      
      // Check if there's a completion this week
      canRevert = goal.completions?.some((date: string) => {
        const completionDate = new Date(date).toISOString().split('T')[0];
        return completionDate >= startOfWeekStr;
      }) || false;
      
      if (!canRevert) {
        return { success: false, error: "Aucune validation cette semaine à annuler" };
      }
      
      // Find and remove the most recent completion this week
      const completionsThisWeek = goal.completions
        ?.filter((date: string) => {
          const completionDate = new Date(date).toISOString().split('T')[0];
          return completionDate >= startOfWeekStr;
        })
        .sort()
        .reverse();
      
      if (completionsThisWeek && completionsThisWeek.length > 0) {
        const dateToRemove = new Date(completionsThisWeek[0]).toISOString().split('T')[0];
        
        const result = await sql`
          UPDATE goals 
          SET completions = array_remove(completions, ${dateToRemove}::date)
          WHERE id = ${goalId}
          RETURNING completions, goal_time, period
        `;
        
        if (result.length === 0) {
          return { success: false, error: "Échec de l'annulation" };
        }
        
        // Recalculate progress percentage
        const { completions, goal_time, period } = result[0];
        const completionCount = completions?.length || 0;
        
        const totalDays = Math.ceil(goal_time / (60 * 60 * 24));
        const totalCompletions = period === 'weeks' ? totalDays / 7 : totalDays;
        const progressPercentage = Math.min(100, Math.round((completionCount / totalCompletions) * 100));
        
        await sql`
          UPDATE goals 
          SET progress = ${progressPercentage},
              complete = false
          WHERE id = ${goalId}
        `;
      }
    } else {
      // For daily goals, only revert if completed today
      const result = await sql`
        UPDATE goals 
        SET completions = array_remove(completions, ${today}::date)
        WHERE id = ${goalId}
          AND ${today}::date = ANY(completions)
        RETURNING completions, goal_time, period
      `;
      
      // If no rows were updated, it means there was no completion today
      if (result.length === 0) {
        return { success: false, error: "Aucune validation aujourd'hui à annuler" };
      }
      
      // Recalculate progress percentage
      const { completions, goal_time, period } = result[0];
      const completionCount = completions?.length || 0;
      
      const totalDays = Math.ceil(goal_time / (60 * 60 * 24));
      const totalCompletions = period === 'weeks' ? totalDays / 7 : totalDays;
      const progressPercentage = Math.min(100, Math.round((completionCount / totalCompletions) * 100));
      
      await sql`
        UPDATE goals 
        SET progress = ${progressPercentage},
            complete = false
        WHERE id = ${goalId}
      `;
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
  time: number;
  period: 'days' | 'weeks';
  mustAdvanceOn?: string;
}) {
  try {
    const user = await requireAuth();
    const daysCount = formData.period === 'weeks' ? formData.time * 7 : formData.time;
    const goalTimeInSeconds = daysCount * 24 * 60 * 60;
    
    await sql`
      INSERT INTO goals (id, title, owner, start_date, goal_time, progress, reset_date, complete, type, period, must_advance_on)
      VALUES (
        gen_random_uuid(),
        ${formData.title},
        ${user.id},
        CURRENT_TIMESTAMP,
        ${goalTimeInSeconds},
        0,
        CURRENT_TIMESTAMP,
        false,
        0,
        ${formData.period},
        ${formData.mustAdvanceOn || null}
      )
    `;
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: "Failed to create goal" };
  }
}
