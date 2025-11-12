import Nav from "@/components/nav";
import { fetchGoals, calculateGoalProgress } from "./lib/data";
import GoalView from "@/components/goal-view";

export default async function MobileGoals() {
  const goals = await fetchGoals();
  
  if (goals.length === 0) {
    return (
      <div className="bg-black flex flex-col gap-2.5 p-2.5 w-full h-full">
        <header className="p-2.5">
          <h1 className="text-2xl text-white font-pixelify-sans">
            Mes objectifs
          </h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-white font-pixelify-sans text-lg">
            Aucun objectif actif. Créez-en un pour commencer !
          </p>
        </main>
        <Nav tab="Goals" />
      </div>
    );
  }

  const goalsWithProgress = goals.map(goal => ({
    ...goal,
    ...calculateGoalProgress(goal)
  }));

  return <GoalView goals={goalsWithProgress} />;
}
