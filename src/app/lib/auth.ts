"use server";

import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { createSession, destroySession } from './session';
import { User, SessionUser } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function login(prevState: { error: string } | undefined, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  
  if (!username || !password) {
    return { error: 'Veuillez renseigner tous les champs' };
  }
  
  try {
    // Find user by username
    const users = await sql<User[]>`
      SELECT * FROM users 
      WHERE username = ${username}
      LIMIT 1
    `;
    
    if (users.length === 0) {
      return { error: 'Identifiants invalides' };
    }
    
    const user = users[0];
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.pwd_hash);
    
    if (!passwordMatch) {
      return { error: 'Identifiants invalides' };
    }
    
    // Create session
    const sessionUser: SessionUser = {
      id: user.id,
      username: user.username,
    };
    
    await createSession(sessionUser);
    
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Une erreur est survenue lors de la connexion' };
  }
  
  redirect('/');
}

export async function signup(prevState: { error: string } | undefined, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  
  if (!username || !password) {
    return { error: 'Veuillez renseigner tous les champs' };
  }
  
  if (username.length < 3) {
    return { error: 'Le nom d\'utilisateur doit comporter au moins 3 caractères' };
  }
  
  if (password.length < 6) {
    return { error: 'Le mot de passe doit comporter au moins 6 caractères' };
  }
  
  try {
    // Check if username already exists
    const existingUsers = await sql<User[]>`
      SELECT * FROM users 
      WHERE username = ${username}
      LIMIT 1
    `;
    
    if (existingUsers.length > 0) {
      return { error: 'Le nom d\'utilisateur existe déjà' };
    }
    
    // Hash password
    const pwd_hash = await bcrypt.hash(password, 10);
    
    // Create user
    const newUsers = await sql<User[]>`
      INSERT INTO users (username, pwd_hash)
      VALUES (${username}, ${pwd_hash})
      RETURNING id, username
    `;
    
    const newUser = newUsers[0];
    
    // Create session
    const sessionUser: SessionUser = {
      id: newUser.id,
      username: newUser.username
    };
    
    await createSession(sessionUser);
    
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'Une erreur est survenue lors de l\'inscription', detail: (error as Error).message };
  }
  
  redirect('/');
}

export async function logout() {
  await destroySession();
  redirect('/login');
}
