import Image from "next/image";
import rocketImg from "../../assets/rocket-vector.svg";
import planetImg from "../../assets/planet-vector.svg";
import flagImg from "../../assets/flag-vector.svg";
import planetFlagImg from "../../assets/planet-flag-vector.svg";

interface ProgressMeterProps {
  currentGoal: {
    isComplete: boolean;
    currentDays: number;
    totalDays: number;
    progress: number;
  };
}

export default function ProgressMeter({ currentGoal }: ProgressMeterProps) {

  return (
    <aside className="flex flex-col items-start justify-between gap-4 h-full mr-16 md:mr-20">
      <Image
        src={currentGoal.isComplete ? planetFlagImg : planetImg}
        alt="Planet"
        width={50}
        height={50}
        className="w-12 h-12 shrink-0"
      />
  
      <div className="relative flex flex-col justify-end h-full w-8 md:w-12 border-l-[5px] border-b-[5px] border-t-[5px] border-white font-pixelify-sans">
        <div
          className="relative w-full border-l-[20px] border-white"
          style={{ height: `${currentGoal.progress}%` }}
        >
          <div 
            className={`
              absolute -top-2 -left-3 flex items-center gap-1 transform -translate-y-full
              ${currentGoal.isComplete && "hidden"}
            `}
          >
            <Image
              src={rocketImg}
              alt="Rocket"
              width={32}
              height={44}
              className="w-6 h-8 md:w-8 md:h-10"
            />
            <span className="text-sm text-white whitespace-nowrap">
              {currentGoal.currentDays} {currentGoal.currentDays === 1 ? "jour" : "jours"}
            </span>
          </div>
        </div>
  
        <span className="absolute -right-2 -bottom-3 translate-x-full text-sm text-nowrap text-white">
          0 jours
        </span>
        <span className="absolute -right-2 -top-3 translate-x-full text-sm text-nowrap text-white">
          {currentGoal.totalDays} jours
        </span>
      </div>
  
      <Image
        src={flagImg}
        alt="Flag"
        width={50}
        height={39}
        className="w-12 h-10 shrink-0"
      />
    </aside>
  );
}
