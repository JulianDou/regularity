"use client";

import { findUsersByUsername, addFriend } from "@/app/lib/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CaptainFinder(){
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<Array<{username: string}>>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUsers([]);

    if (!username.trim()) {
      setError("Veuillez saisir un nom de capitaine");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await findUsersByUsername(username.trim(), true);

      if (result.success) {
        setUsername("");
        const data = result.data;
        if (data && data.length > 0) {
          setUsers(data as Array<{username: string}>);
        }
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUser = async (username: string) => {
    setIsSubmitting(true);

    try {
      const result = await addFriend(username);
      console.log(result.success);

      if (result.success === true) {
        setError("");
        router.refresh();
      } else {
        setError(result.error || "Une erreur est survenue lors de l'ajout de l'ami");
      }
    } catch {
      setError("Une erreur est survenue lors de l'ajout de l'ami");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="text-foreground flex flex-col w-full h-full gap-2">
      <p className="font-pixelify-sans">
        Ajouter un ami
      </p>
      <form 
        onSubmit={handleSubmit}
        className="flex gap-2 items-center w-full"
      >
        <input
          className="input-field h-full w-full"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom du capitaine"
        />
        <button
          type="submit"
          className="button-fill"
          disabled={isSubmitting}
        > 
          {
            isSubmitting ? "Recherche..." : "Rechercher"
          }
        </button>
      </form>
      {
        (error || users.length > 0) && (
          <ul className="flex flex-col border-2 border-foreground font-pixelify-sans">
            {error && (
              <p className="text-danger p-4 border-b border-foreground">
                {error}
              </p>
            )}
            {users.length > 0 && (
              users.map((user, index) => (
                <li 
                  key={index}
                  className={`
                    flex justify-between items-center p-4 
                    ${index === users.length - 1 ? "" : "border-b border-border"} 
                    hover:bg-foreground hover:text-background
                  `}
                >
                  {user.username}
                  <button
                    className="border-2 text-center font-pixelify-sans py-2 px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleAddUser(user.username)}
                    disabled={isSubmitting}
                  >
                    Ajouter
                  </button>
                </li>
              ))
            )}
          </ul>
        )
      }
    </div>
  );
}
