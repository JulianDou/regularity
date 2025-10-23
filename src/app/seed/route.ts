import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users, goals } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      avatar VARCHAR(255),
      pwd_hash VARCHAR(255) NOT NULL
    );
  `;

  // Insert users with hashed passwords
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, username, avatar, pwd_hash)
        VALUES (${user.id}, ${user.username}, ${user.avatar}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedGoals() {
  // Create goals table
  await sql`
    CREATE TABLE IF NOT EXISTS goals (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      owner UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      start_date DATE NOT NULL,
      goal_time INTEGER NOT NULL DEFAULT 0,
      progress INTEGER NOT NULL DEFAULT 0,
      reset_date DATE NOT NULL,
      complete BOOLEAN NOT NULL DEFAULT FALSE,
      type INTEGER NOT NULL DEFAULT 0
    );
  `;

  // Insert goals
  const insertedGoals = await Promise.all(
    goals.map((goal) => sql`
      INSERT INTO goals (id, title, owner, start_date, goal_time, progress, reset_date, complete, type)
      VALUES (
        ${goal.id}, 
        ${goal.title}, 
        ${goal.owner}, 
        ${goal.start_date}, 
        ${goal.goal_time}, 
        ${goal.progress},
        ${goal.reset_date},
        ${goal.complete},
        ${goal.type}
      )
      ON CONFLICT (id) DO NOTHING;
    `),
  );

  return insertedGoals;
}

export async function GET() {
  try {
    await sql.begin(async () => {
      await seedUsers();
      await seedGoals();
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
