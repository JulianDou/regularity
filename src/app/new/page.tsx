import Nav from "@/components/nav";
import CreateGoalForm from "@/components/create-goal-form";

export default function NewGoalPage() {
  return (
    <div className="bg-black flex flex-col w-full h-full">
      {/* Header */}
      <header className="py-2">
        <h1 className="page-title">
          Nouvelle expédition
        </h1>
      </header>

      <main className="h-full">
        {/* Form */}
        <CreateGoalForm />
      </main>

      {/* Navigation */}
      <Nav tab="Goals" />
    </div>
  );
}
