import postgres from "postgres";
import {
  Goal,
  FriendInfo,
  UserProfile
} from './definitions';
import { requireAuth } from './session';

const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: 'require',
  prepare: false // Disable prepared statements to avoid cached plan issues
});

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

export async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await requireAuth();
    
    // Fetch the current user's friends array
    const userData = await sql`
      SELECT id, username, COALESCE(friends, '{}') as friends
      FROM users 
      WHERE id = ${user.id}
    `;
    
    if (userData.length === 0) {
      return null;
    }
    
    const currentUser = userData[0];
    const friendIds: string[] = currentUser.friends || [];
    
    if (friendIds.length === 0) {
      return {
        id: currentUser.id,
        username: currentUser.username,
        friends: []
      };
    }
    
    // Fetch friend details and their friends arrays to determine mutual status
    const friendsData = await sql`
      SELECT id, username, COALESCE(friends, '{}') as friends
      FROM users 
      WHERE id = ANY(${friendIds})
    `;
    
    // Build friends list with mutual status
    const friendsWithMutual: FriendInfo[] = friendsData.map((friend) => ({
      id: friend.id,
      username: friend.username,
      // Mutual if the friend also has the current user in their friends array
      mutual: (friend.friends || []).includes(currentUser.id)
    }));
    
    return {
      id: currentUser.id,
      username: currentUser.username,
      friends: friendsWithMutual
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
