"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import launchpadImg from "../../assets/launchpad-vector.svg";
import { createGoal } from "@/app/lib/actions";

export default function CreateGoalForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [days, setDays] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Le nom de l'objectif est requis");
      return;
    }

    const daysNum = parseInt(days);
    if (!days || daysNum <= 0) {
      setError("Veuillez entrer un nombre de jours valide");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Get actual user ID from auth session
      // For now using a placeholder
      const userId = "410544b2-4001-4271-9855-fec4b6a6442a";
      
      const result = await createGoal({
        title: title.trim(),
        days: daysNum,
        owner: userId,
      });

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch {
      setError("Impossible de créer l'objectif");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-2.5 p-2.5 font-pixelify-sans">
      {/* Title Input */}
      <div className="flex flex-col gap-1">
        <label className="text-white text-base">
          Nom de l&apos;objectif
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="_"
          className="input-field"
          disabled={isSubmitting}
        />
      </div>

      {/* Days Input */}
      <div className="flex flex-col gap-1">
        <label className="text-white text-base">
          Distance
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="_"
            min="1"
            className="input-field"
            disabled={isSubmitting}
          />
          <span className="text-white text-base">jours</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}

      {/* Illustration */}
      <div className="flex-1 flex items-end justify-center min-h-0">
        <Image
          src={launchpadImg}
          alt="Launchpad"
          width={120}
          height={139}
          className="object-contain"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="button-fill w-full"
      >
        <span className="text-black text-base">
          {isSubmitting ? "3, 2, 1..." : "Lancement !"}
        </span>
      </button>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={() => router.back()}
        disabled={isSubmitting}
        className="button-hollow w-full"
      >
        <span className="text-white text-base">Annuler</span>
      </button>
    </form>
  );
}
