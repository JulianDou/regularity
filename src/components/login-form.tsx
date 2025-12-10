"use client";

import { login } from "@/app/lib/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <div className="bg-background h-full flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8">
          Regularity
        </h1>
        
        <div className="generic-bordered-container">
          <h2 className="text-2xl text-foreground mb-6">Connexion</h2>
          
          <form action={formAction} className="flex flex-col gap-4">
            <div>
              <label htmlFor="username" className="label-text">
                Nom d&apos;utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="input-field w-full"
                placeholder="Nom d'utilisateur"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="label-text">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="input-field w-full"
                placeholder="Mot de passe"
              />
            </div>
            
            {state?.error && (
              <div className="danger-container px-4 py-3">
                {state.error}
              </div>
            )}
            
            <button
              type="submit"
              className="button-fill mt-4"
            >
              Se connecter
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Pas encore de compte ?
            </p>
            <Link href="/signup" className="text-blue-400 hover:text-blue-300">
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
