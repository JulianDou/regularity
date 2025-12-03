"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LaunchpadIcon from "../../assets/launchpad-vector.svg";
import { createGoal } from "@/app/lib/actions";

export default function CreateGoalForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [period, setPeriod] = useState<'days' | 'weeks'>('days');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [advanceDayToggle, setAdvanceDayToggle] = useState(false);
  const [advanceDay, setAdvanceDay] = useState("monday");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Le nom de l'objectif est requis");
      return;
    }

    const timeNum = parseInt(time);
    if (!time || timeNum <= 0) {
      setError("Veuillez entrer une distance valide");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createGoal({
        title: title.trim(),
        time: timeNum,
        period: period,
        mustAdvanceOn: advanceDayToggle ? advanceDay : undefined,
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
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 generic-bordered-container h-full">
      {/* Title Input */}
      <div className="flex flex-col gap-1">
        <label className="label-text">
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

      {/* Time Input */}
      <div className="flex flex-col gap-1">
        <label className="label-text">
          Distance
        </label>
        <div className="flex items-center gap-1">
          <input
            id="time-input"
            name="time"
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="_"
            min="1"
            className="input-field w-full"
            disabled={isSubmitting}
          />
          <select 
            id="period-select"
            name="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'days' | 'weeks')}
            className="border-2 border-foreground text-xs p-2 focus:outline-none box-border font-pixelify-sans bg-background text-foreground"
            disabled={isSubmitting}
          >
            <option value="days">jours</option>
            <option value="weeks">semaines</option>
          </select>
        </div>
      </div>

      {/* Advancing Day Input */}
      {
        period === 'weeks' && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="must-advance-on-checkbox" 
                name="mustAdvanceOn" 
                className="checkbox" 
                checked={advanceDayToggle}
                onChange={() => setAdvanceDayToggle(!advanceDayToggle)}
                disabled={isSubmitting}
              />
              <label htmlFor="must-advance-on-checkbox" className="label-text">A valider sur un jour spécifique ?</label>
            </div>
            {
              advanceDayToggle && (
                <select
                  id="advance-day-select"
                  name="advanceDay"
                  value={advanceDay}
                  onChange={(e) => setAdvanceDay(e.target.value)}
                  className="border-2 border-foreground text-xs p-2 focus:outline-none box-border font-pixelify-sans bg-background text-foreground disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="monday">Lundi</option>
                  <option value="tuesday">Mardi</option>
                  <option value="wednesday">Mercredi</option>
                  <option value="thursday">Jeudi</option>
                  <option value="friday">Vendredi</option>
                  <option value="saturday">Samedi</option>
                  <option value="sunday">Dimanche</option>
                </select>
              )
            }
          </div>
        )
      }

      {/* Error Message */}
      {error && (
        <p className="text-danger text-sm">
          {error}
        </p>
      )}

      {/* Illustration */}
      <div className="flex-1 flex items-end justify-center min-h-0">
        <LaunchpadIcon className="w-[120px] h-[139px] text-foreground" />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="button-fill w-full"
      >
        <span className="text-background text-base">
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
        <span className="text-foreground text-base">Annuler</span>
      </button>
    </form>
  );
}
