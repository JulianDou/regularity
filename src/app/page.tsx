import Nav from "@/components/nav";
import Link from "next/link";
import { fetchGoals, calculateGoalProgress } from "@/app/lib/data";
import GoalView from "@/components/goal-view";

export default async function MobileGoals() {
  const goals = await fetchGoals();
  
  if (goals.length === 0) {
    return (
      <div className="bg-black flex flex-col gap-2.5 p-2.5 w-full h-full">
        <header className="p-2.5">
          <h1 className="text-2xl text-white">
            Mes objectifs
          </h1>
        </header>
        <main className="flex-1 flex flex-col gap-5 items-center justify-center">
          <p className="text-white text-lg text-center">
            Aucun objectif actif. Créez-en un pour commencer !
          </p>
          <Link href="/new" className="button-fill w-full">
            Créer un objectif
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

  return (
    <div className="bg-black flex flex-col gap-2.5 p-2.5 w-full h-full">
      <header className="p-2.5">
        <h1 className="text-2xl text-white">
          Mes objectifs
        </h1>
      </header>
      <main className="flex-1 flex flex-col gap-5 items-center justify-center">
        <GoalView goals={goalsWithProgress} />
        <Link 
          href="/new"
          className="button-fill"
        >
          <p className="text-center">Ajouter un objectif</p>
        </Link>
      </main>
      <Nav tab="Goals" />
    </div>
  )
}
