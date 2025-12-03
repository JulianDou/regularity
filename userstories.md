# User Stories & Developer Notes
*Avec l'aide de copilot, modèle GPT-4.1.*

This document provides detailed user stories and implementation hints for developers working on Regularity.

## User Authentication
### Story: As a user, I want to sign up and log in with a unique username and password.
- Store user data in PostgreSQL: `user_id`, `username` (unique), `pwd_hash` (hashed password).
- Use Next.js API routes for authentication logic.
- Hash passwords securely (e.g., bcrypt).

### Story: As a user, I want to update my profile (username).
- Validate new username uniqueness.

## Goal Management
### Story: As a user, I want to add, edit, and delete goals.
- Goal model: `goal_id`, `title`, `owner` (user_id), `start_date`, `goal_time`, `progress`.
- API endpoints: `/api/goals` (CRUD operations).
- Use forms for input; validate required fields.

### Story: As a user, I want my goals to track progress automatically.
- On goal fetch, server calculates `progress` based on dates and goal type.
- For infinite goals (`type: 1`), count days since `start_date` or `reset_date`.

### Story: As a user, I want to reset a goal to try again.
- Add `reset_date` (defaults to `start_date` on creation).
- Reset progress to 0; optionally track reset count.

### Story: As a user, I want to mark goals as completed and view them separately.
- Add `complete: true` to completed goals.
- Filter completed goals out of active progress calculations.
- UI: Separate section for completed goals.

### Story: As a user, I want to extend a completed goal.
- Allow user to add time (e.g., +30 days) to a completed goal.
- Update `goal_time` and move back to active goals.

### Story: As a user, I want to create infinite goals.
- `type: 1` for infinite goals; `goal_time: 0`.
- Progress is days since creation/reset.

## Implementation Hints
- Use Prisma ORM for PostgreSQL integration.
- Organize code following Next.js best practices: `/pages`, `/components`, `/api`.
- Use TailwindCSS for rapid UI development.
- Protect API routes with authentication middleware.
- Use React Context or SWR for state management and data fetching.
- Deploy on Vercel; configure environment variables for DB connection.

## Example Data Models
```ts
// User
{
  user_id: number,
  username: string,
  pwd_hash: string
}

// Goal
{
  goal_id: number,
  title: string,
  owner: number,
  start_date: string,
  goal_time: number,
  progress: number,
  reset_date?: string,
  complete?: boolean,
  type?: number
}
```

## References
- [Next.js Dashboard Tutorial](https://nextjs.org/learn/dashboard-app/)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
