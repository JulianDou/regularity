"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/nav";
import rocketImg from "../../assets/rocket-vector.svg";
import planetImg from "../../assets/planet-vector.svg";
import flagImg from "../../assets/flag-vector.svg";
import chevronLeft from "../../assets/chevron-left.svg";
import chevronRight from "../../assets/chevron-right.svg";
import { Goal } from "@/app/lib/definitions";
import { advanceGoal, resetGoal } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

interface GoalWithProgress extends Goal {
  currentDays: number;
  totalDays: number;
  progress: number;
  isComplete: boolean;
}

interface GoalViewProps {
  goals: GoalWithProgress[];
}

export default function GoalView({ goals }: GoalViewProps) {
  const [currentGoalId, setCurrentGoalId] = useState(goals[0]?.id);
  const [isAdvancing, setIsAdvancing] = useState(false);
  
  // Find current goal by ID, fallback to first goal if not found
  const currentIndex = goals.findIndex(g => g.id === currentGoalId);
  const actualIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentGoal = goals[actualIndex];
  
  const router = useRouter();

  const handlePrevious = () => {
    const newIndex = actualIndex > 0 ? actualIndex - 1 : goals.length - 1;
    setCurrentGoalId(goals[newIndex].id);
  };

  const handleNext = () => {
    const newIndex = actualIndex < goals.length - 1 ? actualIndex + 1 : 0;
    setCurrentGoalId(goals[newIndex].id);
  };

  const handleAdvance = async () => {
    setIsAdvancing(true);
    try {
      await advanceGoal(currentGoal.id);
    } catch (error) {
      console.error("Failed to advance goal:", error);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleReset = async () => {
    setIsAdvancing(true);
    try {
      await resetGoal(currentGoal.id);
    } catch (error) {
      console.error("Failed to reset goal:", error);
    } finally {
      setIsAdvancing(false);
    }
  }

  return (
    <div className="bg-black flex flex-col gap-2.5 p-2.5 w-full h-full">
      {/* Header */}
      <header className="flex items-center justify-between p-2.5">
        <h1 className="text-2xl text-white font-pixelify-sans">
          Mes objectifs
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center gap-24 px-2.5">
        {/* Progress Meter */}
        <aside className="flex flex-col items-center justify-between h-full gap-2.5">
          <Image
            src={planetImg}
            alt="Planet"
            width={50}
            height={50}
            className="w-12 h-12 shrink-0"
          />

          <div className="relative flex flex-col justify-end h-full w-12 border-l-[5px] border-b-[5px] border-t-[5px] border-white">
            <div
              className="relative w-full border-l-[20px] border-white"
              style={{ height: `${currentGoal.progress}%` }}
            >
              <div 
                className={`
                  absolute -top-2 -left-3 flex items-center gap-1 transform -translate-y-full
                  ${currentGoal.isComplete && "hidden"}
                `}
              >
                <Image
                  src={rocketImg}
                  alt="Rocket"
                  width={32}
                  height={44}
                  className="w-8 h-11"
                />
                <span className="text-sm text-white font-pixelify-sans whitespace-nowrap">
                  {currentGoal.currentDays} {currentGoal.currentDays === 1 ? "jour" : "jours"}
                </span>
              </div>
            </div>

            <span className="absolute -right-2 -bottom-3 translate-x-full text-sm text-nowrap text-white font-pixelify-sans">
              0 jours
            </span>
            <span className="absolute -right-2 -top-3 translate-x-full text-sm text-nowrap text-white font-pixelify-sans">
              {currentGoal.totalDays} jours
            </span>
          </div>

          <Image
            src={flagImg}
            alt="Flag"
            width={50}
            height={39}
            className="w-12 h-10 shrink-0"
          />
        </aside>

        {/* Goal Info */}
        <section className="flex-1 flex flex-col justify-between h-full py-14">
          <div className="flex flex-col gap-2.5">
            <div>
              <p className="text-white font-pixelify-sans text-base">
                Objectif actuel :
              </p>
              <h2 className="text-white font-pixelify-sans text-2xl">
                {currentGoal.title}
              </h2>
            </div>

            <div>
              <p className="text-white font-pixelify-sans text-base">
                Avancée actuelle :
              </p>
              <p className={`font-pixelify-sans text-4xl ${
                currentGoal.isComplete ? "text-green-400" : "text-white"
              }`}>
                {currentGoal.progress}%
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row-reverse justify-end">
            <button
              onClick={handleReset}
              disabled={isAdvancing || currentGoal.isComplete}
              className={`button-hollow ${currentGoal.isComplete && "hidden"} w-full`}
            >
              Réinitialiser
            </button>
            <button 
              onClick={handleAdvance}
              disabled={isAdvancing || currentGoal.isComplete}
              className="button-fill w-full"
            >
              <span className="text-black font-pixelify-sans text-base">
                {currentGoal.isComplete ? "Terminé !" : isAdvancing ? "..." : "Avancer"}
              </span>
            </button>
          </div>
        </section>
      </main>

      {/* Navigation: Previous/Next */}
      <nav className="flex items-center justify-between px-2.5">
        <button 
          onClick={handlePrevious}
          className="flex items-center gap-1 p-2.5 cursor-pointer"
          disabled={goals.length <= 1}
        >
          <Image src={chevronLeft} alt="" width={24} height={24} />
          <span className="text-white font-pixelify-sans text-base">Précédent</span>
        </button>

        {goals.length > 1 && (
          <span className="text-white font-pixelify-sans text-sm">
            {actualIndex + 1} / {goals.length}
          </span>
        )}

        <button 
          onClick={handleNext}
          className="flex items-center gap-1 p-2.5 cursor-pointer"
          disabled={goals.length <= 1}
        >
          <span className="text-white font-pixelify-sans text-base">Suivant</span>
          <Image src={chevronRight} alt="" width={24} height={24} />
        </button>
      </nav>

      <button 
        className="button-fill"
        onClick={() => router.push('/new')}
      >
        <p className="text-center">Ajouter un objectif</p>
      </button>

      <Nav tab="Goals" />
    </div>
  );
}
