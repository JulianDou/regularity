# Fonctionnalités

## Inscription et connexion
On peut se créer un compte (sans mail pour l'exercice) qui comporte :
- Un pseudo
- Eventuellement un avatar pour personnaliser son appli
- Un mot de passe
L'appli demande donc d'être connecté pour accéder à ses objectifs
```json
{
  user_id: 164568                                             // Identifiant unique de l'utilisateur
  username: "EpicUser1234",                                   // Pseudo de l'utilisateur (doit être unique)
  avatar: "avatar_epicuser1234_155A8D2q55Lopmie186b.jpg",     // Nom du fichier de l'avatar de l'utilisateur
  pwd_hash: "a1f228756c978cec68b73517ea979cdc68fffda83..."    // Mot de passe (hashé) de l'utilisateur
}
```

### Modifier son profil
L'utilisateur pourra choisir un autre pseudo (unique) ainsi qu'un autre avatar

## Objectifs

### - Ajouter un objectif
On pourra ajouter un objectif avec temps et intitulé
```json
{
  goal_id: 456852134,         // Identifiant unique de l'objectif
  title: "titre",             // Intitulé de l'objectif
  owner: 154153               // L'user_id du propriétaire de l'objectif
  start_date: "2024-12-12",   // Date de début de l'objectif
  goal_time: 31536000,        // Temps total programmé pour l'objectif
  progress: 26524800,         // Progression actuelle de l'utilisateur
}
```

#### - Avancer un objectif
Les objectifs avancent tous seuls quand ils sont chargés par le serveur qui calcule cette propriété avant de les envoyer au client

#### - Réinitialiser un objectif
On pourra réinitialiser l'objectif avec un bouton (si on l'a échoué mais qu'on veut réessayer par exemple)
```json
{
  reset_date: "2025-10-15",   // On rajoute reset_date, qui prendra désormais le dessus sur start_date pour calculer la progression. 
                              // Par défaut (quand l'objectif est créé) reset_date est égal à start_date
  progress: 0,                // progress est donc remis à 0
  // resets: 1                // On pourrait envisager un compteur de réinitialisations mais ce n'est pas très motivant...
}
```

#### - Compléter un objectif
Les objectifs sont marqués comme complétés lorsqu'ils sont arrivés à leur date limite
- On peut alors les passer dans une section "objectif complétés"
```json
{
  complete: true,             // On rajoute complete qui permet tout simplement de marquer l'objectif comme complété.
                              // On ignorera ces objectifs pendant le calcul de la progression pour gagner du temps de calcul côté serveur
}
```

### - Supprimer un objectif
On pourra supprimer un objectif

### - Modifier un objectif
On pourra modifier l'intitulé et la durée de l'objectif

### - Créer un objectif "infini"
On pourra créer un objectif sans date limite, qui compte simplement les jours depuis sa création/réinitialisation
```json
{
  type: 1,                    // On rajoute une propriété "type" à nos objectifs. 0 comporte une date limite, 1 n'en a pas.
  goal_time: 0                // goal_time est donc égal à 0
}
```

### - Rallonger un objectif complété
On pourra, lorsqu'on complète un objectif, choisir de le rallonger (en rajoutant 30 jours par exemple)

# User Stories & Developer Notes
*Avec l'aide de copilot, modèle GPT-4.1.*

This document provides detailed user stories and implementation hints for developers working on HabitTracker.

## User Authentication
### Story: As a user, I want to sign up and log in with a unique username and password, optionally setting an avatar.
- Store user data in PostgreSQL: `user_id`, `username` (unique), `avatar` (filename), `pwd_hash` (hashed password).
- Use Next.js API routes for authentication logic.
- Hash passwords securely (e.g., bcrypt).
- Avatar upload: store file in `/public/avatars` or use a cloud provider.

### Story: As a user, I want to update my profile (username, avatar).
- Validate new username uniqueness.
- Allow avatar change (replace file, update DB reference).

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
  avatar: string,
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

# HabitTracker
*Avec l'aide de copilot, modèle GPT-4.1.*

HabitTracker is a web application designed to help users set, track, and achieve their personal goals and habits. Built with Next.js, React, and TailwindCSS, and hosted on Vercel, it offers a modern, fast, and responsive experience. Data is securely stored in a PostgreSQL database, and all interactions are handled via a client-side API.

## Features

### User Authentication
- Sign up and log in with a unique username and password (no email required).
- Optional avatar for profile personalization.
- Secure password storage (hashed).

### Profile Management
- Change username (must remain unique).
- Update avatar.

### Goal Management
- Add new goals with a title, start date, and total time to achieve.
- Track progress automatically (server calculates progress before sending to client).
- Reset goals to try again (progress resets, reset date tracked).
- Mark goals as completed when the deadline is reached; completed goals are moved to a separate section.
- Delete goals.
- Edit goal title and duration.
- Create "infinite" goals (no deadline, tracks days since creation/reset).
- Extend completed goals (e.g., add 30 days).

## Tech Stack
- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** Client-side API (Next.js API routes)
- **Database:** PostgreSQL
- **Hosting:** Vercel

## Project Structure
The app follows the structure of the [Next.js Dashboard Tutorial](https://nextjs.org/learn/dashboard-app/), with clear separation between pages, components, and API routes.

## Getting Started
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database and configure environment variables.
4. Run the development server: `npm run dev`
5. Deploy to Vercel for production.

## License
MIT
