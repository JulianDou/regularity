import Nav from "@/components/nav";
import Link from "next/link";
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
        <main className="flex-1 flex flex-col gap-5 items-center justify-center">
          <p className="text-white font-pixelify-sans text-lg text-center">
            Aucun objectif actif. Créez-en un pour commencer !
          </p>
          <Link href="/new" className="bg-white py-2.5 px-4">
            <span className="text-black font-pixelify-sans text-base">
              Créer un objectif
            </span>
          </Link>
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
