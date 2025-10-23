import Nav from "@/components/nav";
import Objectif from "@/components/objectif";

export default function MobileGoals() {
  return (
    <div className="bg-[#cafdef] flex flex-col gap-2.5 p-2.5 w-full h-full overflow-hidden">
      <div className="flex flex-col gap-2.5 p-2.5">
        <h1 className="text-2xl text-black font-abhaya-libre font-bold">
          Mes objectifs
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-2.5 p-0">
          <Objectif  />
          <Objectif 
            temps="12"
            titre="Coder en PHP"
            description="Vous avez réussi à Coder en PHP depuis 12 jours. Continuez !"
            objectif="31 jours"
          />
          <Objectif 
            temps="48"
            titre="Avoir son BUT 3"
            description="Vous avez réussi à Avoir son BUT 3 depuis 48 jours. Continuez !"
            objectif="1 an"
          />
        </div>
      </div>

      <Nav tab="Goals" />
    </div>
  );
}
