import Nav from "@/components/nav";
import Link from "next/link";
import { fetchGoals } from "@/app/lib/data";
import GoalView from "@/components/goal-view";

export default async function MobileGoals() {
  const goals = await fetchGoals();
  
  if (goals.length === 0) {
    return (
      <div className="bg-background flex flex-col  w-full h-full">
        <header className="py-2">
          <h1 className="text-2xl text-foreground">
            Exploration
          </h1>
        </header>
        <main className="flex-1 flex flex-col gap-5 items-center justify-center">
          <p className="text-foreground text-lg text-center">
            Aucun objectif actif. Programmez-en un pour commencer !
          </p>
          <Link href="/new" className="button-fill responsive-width">
            Nouvelle expédition
          </Link>
        </main>
        <Nav tab="Goals" />
      </div>
    );
  }

  return (
    <div className="bg-background flex flex-col  w-full h-full">
      <header className="py-2">
        <h1 className="text-2xl text-foreground">
          Exploration
        </h1>
      </header>
      <main className="flex-1 flex flex-col gap-5 items-center justify-center md:items-start">
        <GoalView goals={goals} />
        <Link 
          href="/new"
          className="button-fill responsive-width"
        >
          <p className="text-center">Ajouter un objectif</p>
        </Link>
      </main>
      <Nav tab="Goals" />
    </div>
  )
}
