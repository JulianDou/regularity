"use client";

import { useState } from "react";
import ConfirmationPopup from "@/components/confirm-popup";
import ChevronLeft from "../../assets/chevron-left.svg";
import ChevronRight from "../../assets/chevron-right.svg";
import { Goal } from "@/app/lib/definitions";
import { advanceGoal, resetGoal, deleteGoal, revertCompletion } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import ProgressMeter from "@/ui/progressMeter";

interface GoalViewProps {
  goals: Goal[];
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
  
  const today = new Date().toISOString().split('T')[0];
  let completedToday = false;
  
  if (currentGoal.period === 'weeks') {
    // For weekly goals, check if completed this week
    const todayDate = new Date(today);
    const dayOfWeek = todayDate.getDay();
    
    // Calculate the start of this week (Monday)
    const startOfWeek = new Date(todayDate);
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(todayDate.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
    
    completedToday = currentGoal.completions?.some(date => {
      const completionDate = new Date(date).toISOString().split('T')[0];
      return completionDate >= startOfWeekStr;
    }) || false;
  } else {
    // For daily goals, check if completed today
    completedToday = currentGoal.completions?.some(date => {
      const normalizedDate = new Date(date).toISOString().split('T')[0];
      return normalizedDate === today;
    }) || false;
  }
  
  const weekdayToday = new Date().toLocaleDateString('en-EN', { weekday: 'long' }).toLowerCase();
  const lastCompletedDay = new Date(currentGoal.completions[currentGoal.completions.length - 1]);

  const missedADay = (() => {
    if (!currentGoal) return false;
    const completions = currentGoal.completions || [];
    if (completions.length === 0) return false;
    if (completedToday) return false;

    const toDateStr = (d: Date) => new Date(d).toDateString();

    // Yesterday date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // If the goal requires a specific weekday, only consider that weekday as "missed"
    if (currentGoal.must_advance_on) {
      const yWeekday = yesterday.toLocaleDateString("en-EN", { weekday: "long" }).toLowerCase();
      if (yWeekday !== currentGoal.must_advance_on) return false; // yesterday wasn't a required day
      const didYesterday = completions.some(c => toDateStr(new Date(c)) === toDateStr(yesterday));
      return !didYesterday;
    }

    // Daily goals: missed if there was no completion yesterday
    if (currentGoal.period === "days") {
      const didYesterday = completions.some(c => toDateStr(new Date(c)) === toDateStr(yesterday));
      return !didYesterday;
    }

    // Weekly goals (or other): consider last calendar week (Mon-Sun). Missed if no completions in last week.
    const today = new Date();
    const day = today.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = (day + 6) % 7;
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setHours(0, 0, 0, 0);
    startOfThisWeek.setDate(today.getDate() - diffToMonday);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setDate(startOfThisWeek.getDate() - 1);
    endOfLastWeek.setHours(23, 59, 59, 999);

    const hasLastWeekCompletion = completions.some(c => {
      const d = new Date(c);
      return d >= startOfLastWeek && d <= endOfLastWeek;
    });

    return !hasLastWeekCompletion;
  })();

  const daysSinceLastCompletion = (() => {
    if (currentGoal.completions.length === 0) return null;
    
    const lastCompletionDate = new Date(currentGoal.completions[currentGoal.completions.length - 1]);
    lastCompletionDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // For weekly goals, calculate missed weeks instead of days
    if (currentGoal.period === "weeks") {
      const msPerDay = 1000 * 60 * 60 * 24;
      const diffDays = Math.floor((today.getTime() - lastCompletionDate.getTime()) / msPerDay);
      const missedWeeks = Math.floor(diffDays / 7);
      return missedWeeks;
    }
    
    // For daily goals, calculate days
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.floor((today.getTime() - lastCompletionDate.getTime()) / msPerDay);
    return diffDays;
  })();

  const daysSinceStart = (() => {
    const createdSource = currentGoal.start_date;
    let created = new Date(createdSource);
    if (isNaN(created.getTime())) {
      const times = currentGoal.completions.map(c => new Date(c).getTime()).filter(t => !isNaN(t));
      if (times.length === 0) return 0;
      created = new Date(Math.min(...times));
    }
    created.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get start of week for creation date (Monday = 0)
    const startDay = created.getDay();
    const diffToMonday = (startDay + 6) % 7; // 0 (Mon) - 6 (Sun)
    const startOfFirstWeek = new Date(created);
    startOfFirstWeek.setDate(created.getDate() - diffToMonday);
    startOfFirstWeek.setHours(0, 0, 0, 0);

    // Get start of current week
    const todayDay = today.getDay();
    const todayDiffToMonday = (todayDay + 6) % 7;
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - todayDiffToMonday);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    // For weekly goals, calculate based on weeks
    if (currentGoal.period === "weeks") {
      const msPerWeek = 1000 * 60 * 60 * 24 * 7;
      const diffWeeks = Math.floor((startOfCurrentWeek.getTime() - startOfFirstWeek.getTime()) / msPerWeek) + 1;
      return diffWeeks;
    }
    
    // For daily goals, calculate weekdays only (Mon-Fri)
    let weekdayCount = 0;
    const currentDate = new Date(startOfFirstWeek);
    
    while (currentDate <= today) {
      const dayOfWeek = currentDate.getDay();
      // Count Monday (1) through Friday (5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        weekdayCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return weekdayCount;
  })();

  const regularity = (() => {
    let totalDays = 0;
    if (currentGoal.complete && daysSinceLastCompletion !== null) {
      totalDays = daysSinceStart - daysSinceLastCompletion;
    }
    else {
      totalDays = daysSinceStart;
    }
    if (totalDays === 0) return 100;
    return Math.round((currentGoal.completions.length / totalDays) * 100);
  })();

  const router = useRouter();

  const translateWeekday = (day: string) => {
    switch (day) {
      case 'monday':
        return 'lundi';
      case 'tuesday':
        return 'mardi';
      case 'wednesday':
        return 'mercredi';
      case 'thursday':
        return 'jeudi';
      case 'friday':
        return 'vendredi';
      case 'saturday':
        return 'samedi';
      case 'sunday':
        return 'dimanche';
      default:
        return day;
    }
  };

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
    <div className="bg-background flex flex-col gap-4 w-full h-full generic-bordered-container">
      {showResetConfirm && (
        <ConfirmationPopup
          message="Êtes-vous sûr de vouloir réinitialiser cet objectif ?"
          onConfirm={handleResetConfirm}
          onCancel={handleResetCancel}
          dangerous={true}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmationPopup
          message="Êtes-vous sûr de vouloir supprimer cet objectif ?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          dangerous={true}
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
              <p className="text-foreground text-sm font-pixelify-sans">
                Objectif actuel :
              </p>
              <h2 className="text-foreground">
                {currentGoal.title}
              </h2>
              <p className="text-xs font-pixelify-sans text-intermediate">
                A valider  {
                  currentGoal.must_advance_on ?
                    ("tous les " + translateWeekday(currentGoal.must_advance_on) + "s") :
                    currentGoal.period === "days" ? "tous les jours" : "toutes les semaines"
                }
              </p>
            </div>

            <div>
              <p className="text-foreground text-sm font-pixelify-sans">
                Avancée actuelle :
              </p>
              <p className={`text-2xl ${
                currentGoal.complete ? "text-success" : "text-foreground"
              }`}>
                {currentGoal.progress}%
              </p>
            </div>

            <div>
              <p className="text-foreground text-sm font-pixelify-sans">
                Dernière avancée :
              </p>
              <p className={completedToday ? "text-success text-sm" : "text-foreground text-sm"}>
                {
                  currentGoal.completions.length > 0 ?
                  lastCompletedDay.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                  :
                  "Aucune avancée enregistrée"
                }
              </p>
              {
                missedADay && !currentGoal.complete && (
                  <p className="text-danger font-pixelify-sans text-xs">
                    En retard depuis {daysSinceLastCompletion} jours
                  </p>
                )
              }
            </div>

            {
              currentGoal.completions.length > 0 &&
              <div>
                <p className="text-foreground text-sm font-pixelify-sans">
                  Régularité :
                </p>
                <p className={"text-foreground text-sm" + (regularity === 100 ? " text-success" : "")}>
                  {regularity}%
                </p>
                <p className={"text-foreground font-pixelify-sans text-xs"}>
                  vous avez complété {currentGoal.completions.length} 
                  {currentGoal.period === "days" ? " jours " : " semaines "} 
                  sur {currentGoal.complete && daysSinceLastCompletion !== null ? (daysSinceStart - daysSinceLastCompletion) : daysSinceStart}
                </p>
              </div>
            }
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
              disabled={isAdvancing || currentGoal.complete}
              className={`button-hollow ${currentGoal.complete && "hidden"} w-full`}
            >
              Réinitialiser
            </button>
            {!currentGoal.complete && (
              currentGoal.must_advance_on && (currentGoal.must_advance_on !== weekdayToday) ? (
                <div 
                  className="fake-button-hollow w-full cursor-not-allowed opacity-50"
                >
                  <span className="text-foreground text-base">
                    Seulement le {translateWeekday(currentGoal.must_advance_on)}
                  </span>
                </div>
              ) : (
                completedToday ? (
                  <button 
                    onClick={handleRevert}
                    disabled={isAdvancing}
                    className="button-hollow w-full"
                  >
                    <span className="text-foreground text-base">
                      {isAdvancing ? "..." : "Annuler"}
                    </span>
                  </button>
                ) : (
                  <button 
                    onClick={handleAdvance}
                    disabled={isAdvancing}
                    className="button-fill w-full"
                  >
                    <span className="text-background text-base">
                      {isAdvancing ? "..." : "Avancer"}
                    </span>
                  </button>
                )
              )
            )}
            {currentGoal.complete && (
              <div 
                className="fake-button-fill w-full"
              >
                <span className="text-background text-base">
                  Terminé !
                </span>
              </div>
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
              <ChevronLeft className="w-6 h-6 text-foreground" />
              <span className="text-foreground text-sm">Précédent</span>
            </button>

            {goals.length > 1 && (
              <span className="font-press-start-2p text-foreground text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {actualIndex + 1} / {goals.length}
              </span>
            )}

            <button 
              onClick={handleNext}
              className="flex items-center gap-1 p-2 cursor-pointer"
              disabled={goals.length <= 1}
            >
              <span className="text-foreground text-sm">Suivant</span>
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
        </nav>
      }

    </div>
  );
}
