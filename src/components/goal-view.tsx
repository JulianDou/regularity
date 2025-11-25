"use client";

import { useState } from "react";
import Image from "next/image";
import ConfirmationPopup from "@/components/confirm-popup";
import chevronLeft from "../../assets/chevron-left.svg";
import chevronRight from "../../assets/chevron-right.svg";
import { Goal } from "@/app/lib/definitions";
import { advanceGoal, resetGoal, deleteGoal, revertCompletion } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import ProgressMeter from "@/ui/progressMeter";

interface GoalWithProgress extends Goal {
  currentDays: number;
  totalDays: number;
  progress: number;
  isComplete: boolean;
  completedToday: boolean;
}

interface GoalViewProps {
  goals: GoalWithProgress[];
}

export default function GoalView({ goals }: GoalViewProps) {
  const [currentGoalId, setCurrentGoalId] = useState(goals[0]?.id);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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

  const handleRevert = async () => {
    setIsAdvancing(true);
    try {
      await revertCompletion(currentGoal.id);
    } catch (error) {
      console.error("Failed to revert completion:", error);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleResetConfirm = async () => {
    setShowResetConfirm(false);
    setIsAdvancing(true);
    try {
      await resetGoal(currentGoal.id);
    } catch (error) {
      console.error("Failed to reset goal:", error);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    setIsAdvancing(true);
    try {
      await deleteGoal(currentGoal.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete goal:", error);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-black flex flex-col gap-4 w-full h-full generic-bordered-container">
      {showResetConfirm && (
        <ConfirmationPopup
          message="Êtes-vous sûr de vouloir réinitialiser cet objectif ?"
          onConfirm={handleResetConfirm}
          onCancel={handleResetCancel}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmationPopup
          message="Êtes-vous sûr de vouloir supprimer cet objectif ?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex items-center">
        {/* Progress Meter */}
        <ProgressMeter currentGoal={currentGoal} />

        {/* Goal Info */}
        <section className="flex-1 flex flex-col justify-between h-full gap-4">
          <div className="flex flex-col gap-4 h-full">
            <div>
              <p className="text-white text-sm font-pixelify-sans">
                Objectif actuel :
              </p>
              <h2 className="text-white">
                {currentGoal.title}
              </h2>
            </div>

            <div>
              <p className="text-white text-sm font-pixelify-sans">
                Avancée actuelle :
              </p>
              <p className={`text-2xl ${
                currentGoal.isComplete ? "text-green-400" : "text-white"
              }`}>
                {currentGoal.progress}%
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row-reverse justify-end">
            <button
              onClick={handleDeleteClick}
              disabled={isAdvancing}
              className="button-hollow w-full"
            >
              Supprimer
            </button>
            <button
              onClick={handleResetClick}
              disabled={isAdvancing || currentGoal.isComplete}
              className={`button-hollow ${currentGoal.isComplete && "hidden"} w-full`}
            >
              Réinitialiser
            </button>
            {!currentGoal.isComplete && (
              currentGoal.completedToday ? (
                <button 
                  onClick={handleRevert}
                  disabled={isAdvancing}
                  className="button-hollow w-full"
                >
                  <span className="text-white text-base">
                    {isAdvancing ? "..." : "Annuler"}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={handleAdvance}
                  disabled={isAdvancing}
                  className="button-fill w-full"
                >
                  <span className="text-black text-base">
                    {isAdvancing ? "..." : "Avancer"}
                  </span>
                </button>
              )
            )}
            {currentGoal.isComplete && (
              <button 
                disabled
                className="button-fill w-full"
              >
                <span className="text-black text-base">
                  Terminé !
                </span>
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Navigation: Previous/Next */}
      {
        goals.length > 1 && 
          <nav className="relative flex items-center justify-between px-2 gap-2 font-pixelify-sans">
            <button 
              onClick={handlePrevious}
              className="flex items-center gap-1 p-2 cursor-pointer"
              disabled={goals.length <= 1}
            >
              <Image src={chevronLeft} alt="" width={24} height={24} />
              <span className="text-white text-sm">Précédent</span>
            </button>

            {goals.length > 1 && (
              <span className="font-press-start-2p text-white text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {actualIndex + 1} / {goals.length}
              </span>
            )}

            <button 
              onClick={handleNext}
              className="flex items-center gap-1 p-2 cursor-pointer"
              disabled={goals.length <= 1}
            >
              <span className="text-white text-sm">Suivant</span>
              <Image src={chevronRight} alt="" width={24} height={24} />
            </button>
        </nav>
      }

    </div>
  );
}
