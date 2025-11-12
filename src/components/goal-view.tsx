"use client";

import { useState } from "react";
import Image from "next/image";
import Nav from "@/components/nav";
import rocketImg from "../../assets/rocket.png";
import profile1 from "../../assets/profile1.png";
import profile2 from "../../assets/profile2.png";
import chevronLeft from "../../assets/chevron-left.svg";
import chevronRight from "../../assets/chevron-right.svg";
import { Goal } from "@/app/lib/definitions";
import { advanceGoal } from "@/app/lib/actions";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const currentGoal = goals[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : goals.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < goals.length - 1 ? prev + 1 : 0));
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

  return (
    <div className="bg-black flex flex-col gap-2.5 p-2.5 w-full h-full">
      {/* Header */}
      <header className="p-2.5">
        <h1 className="text-2xl text-white font-pixelify-sans">
          Mes objectifs
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center gap-24 px-2.5">
        {/* Progress Meter */}
        <aside className="flex flex-col items-center justify-between h-full gap-2.5">
          <Image
            src={profile1}
            alt="Profile top"
            width={50}
            height={50}
            className="w-12 h-12 object-cover shrink-0"
          />

          <div className="relative flex flex-col justify-end h-full w-12 border-l-[5px] border-b-[5px] border-t-[5px] border-white">
            <div
              className="relative w-full border-l-[20px] border-white"
              style={{ height: `${currentGoal.progress}%` }}
            >
              <div 
                className="absolute top-0 right-0 flex items-center gap-1 transform translate-x-10"
              >
                <Image
                  src={rocketImg}
                  alt="Rocket"
                  width={45}
                  height={48}
                  className="w-10 h-10"
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
            src={profile2}
            alt="Profile bottom"
            width={50}
            height={50}
            className="w-12 h-12 object-cover shrink-0"
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

          <button 
            onClick={handleAdvance}
            disabled={isAdvancing || currentGoal.isComplete}
            className="bg-white py-2.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-black font-pixelify-sans text-base">
              {currentGoal.isComplete ? "Terminé !" : isAdvancing ? "..." : "Avancer"}
            </span>
          </button>
        </section>
      </main>

      {/* Navigation: Previous/Next */}
      <nav className="flex items-center justify-between px-2.5">
        <button 
          onClick={handlePrevious}
          className="flex items-center gap-1 p-2.5"
          disabled={goals.length <= 1}
        >
          <Image src={chevronLeft} alt="" width={24} height={24} />
          <span className="text-white font-pixelify-sans text-base">Précédent</span>
        </button>

        {goals.length > 1 && (
          <span className="text-white font-pixelify-sans text-sm">
            {currentIndex + 1} / {goals.length}
          </span>
        )}

        <button 
          onClick={handleNext}
          className="flex items-center gap-1 p-2.5"
          disabled={goals.length <= 1}
        >
          <span className="text-white font-pixelify-sans text-base">Suivant</span>
          <Image src={chevronRight} alt="" width={24} height={24} />
        </button>
      </nav>

      <Nav tab="Goals" />
    </div>
  );
}
