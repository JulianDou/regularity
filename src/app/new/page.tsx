import Nav from "@/components/nav";
import CreateGoalForm from "@/components/create-goal-form";

export default function NewGoalPage() {
  return (
    <div className="bg-black flex flex-col gap-2.5 p-2.5 w-full h-full">
      {/* Header */}
      <header className="p-2.5">
        <h1 className="text-2xl text-white">
          Créer un objectif
        </h1>
      </header>

      {/* Form */}
      <CreateGoalForm />

      {/* Navigation */}
      <Nav tab="Goals" />
    </div>
  );
}
