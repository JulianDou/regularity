import Nav from "@/components/nav";
import { fetchCompletedGoals } from "@/app/lib/data";
import GoalView from "@/components/goal-view";

export default async function CompletedPage() {
  const goals = await fetchCompletedGoals();

  if (goals.length === 0) {
    return (
    <div className="bg-background flex flex-col w-full h-full">
      <header className="py-2">
        <h1 className="page-title">
          Planètes découvertes
        </h1>
      </header>
      <main className="flex-1 flex flex-col gap-5 items-center justify-center">
        <p className="text-foreground text-lg text-center">
          Vous n&apos;avez pas encore atteint d&apos;objectifs.
        </p>
      </main>
      <Nav tab="Completed" />
    </div>
    );
  }
  
  return (
    <div className="bg-background flex flex-col  w-full h-full">
      <header className="py-2">
        <h1 className="text-2xl text-foreground">
          Mes objectifs complétés
        </h1>
      </header>
      <main className="flex-1 flex flex-col gap-5 items-center justify-center">
        <GoalView goals={goals} />
      </main>
      <Nav tab="Completed" />
    </div>
  )
}
