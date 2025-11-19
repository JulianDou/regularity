import Nav from "@/components/nav";
import { fetchCompletedGoals, calculateGoalProgress } from "@/app/lib/data";
import GoalView from "@/components/goal-view";

export default async function CompletedPage() {
  const goals = await fetchCompletedGoals();

  if (goals.length === 0) {
    return (
    <div className="bg-black flex flex-col gap-2.5 p-2.5 w-full h-full">
      <header className="p-2.5">
        <h1 className="text-2xl text-white">
          Objectifs atteints
        </h1>
      </header>
      <main className="flex-1 flex flex-col gap-5 items-center justify-center">
        <p className="text-white text-lg text-center">
          Vous n&apos;avez pas encore atteint d&apos;objectifs.
        </p>
      </main>
      <Nav tab="Completed" />
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
          Mes objectifs complétés
        </h1>
      </header>
      <main className="flex-1 flex flex-col gap-5 items-center justify-center">
        <GoalView goals={goalsWithProgress} />
      </main>
      <Nav tab="Completed" />
    </div>
  )
}
