// Placeholder data for seeding the database

export const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    username: 'EpicUser1234',
    password: 'password123', // Will be hashed in seed route
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442b',
    username: 'MotivatedJane',
    password: 'securepass456',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    username: 'FitnessKing',
    password: 'fitness2024',
  },
];

export const goals = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    title: 'Learn TypeScript',
    owner: '410544b2-4001-4271-9855-fec4b6a6442a', // EpicUser1234
    start_date: '2025-10-01',
    goal_time: 2592000, // 30 days in seconds
    progress: 0,
    reset_date: '2025-10-01',
    complete: false,
    type: 0, // Time-limited goal
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442c',
    title: 'Daily Meditation',
    owner: '410544b2-4001-4271-9855-fec4b6a6442a', // EpicUser1234
    start_date: '2025-09-15',
    goal_time: 0, // Infinite goal
    progress: 0,
    reset_date: '2025-09-15',
    complete: false,
    type: 1, // Infinite goal
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f3',
    title: 'Run a Marathon',
    owner: '3958dc9e-712f-4377-85e9-fec4b6a6442b', // MotivatedJane
    start_date: '2025-08-01',
    goal_time: 7776000, // 90 days in seconds
    progress: 0,
    reset_date: '2025-08-01',
    complete: true,
    type: 0,
  },
  {
    id: '126eed9c-c90c-4ef6-8c56-9e63dc2d9f57',
    title: 'Build Muscle Mass',
    owner: '76d65c26-f784-44a2-ac19-586678f7c2f2', // FitnessKing
    start_date: '2025-07-01',
    goal_time: 15552000, // 180 days in seconds
    progress: 0,
    reset_date: '2025-07-01',
    complete: false,
    type: 0,
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    title: 'Read Daily',
    owner: '3958dc9e-712f-4377-85e9-fec4b6a6442b', // MotivatedJane
    start_date: '2025-10-10',
    goal_time: 0,
    progress: 0,
    reset_date: '2025-10-10',
    complete: false,
    type: 1, // Infinite goal
  },
];
