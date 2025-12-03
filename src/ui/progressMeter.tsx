import RocketIcon from "../../assets/rocket-vector.svg";
import PlanetIcon from "../../assets/planet-vector.svg";
import FlagIcon from "../../assets/flag-vector.svg";
import PlanetFlagIcon from "../../assets/planet-flag-vector.svg";
import { Goal } from "@/app/lib/definitions";

interface ProgressMeterProps {
  currentGoal: Goal;
}

export default function ProgressMeter({ currentGoal }: ProgressMeterProps) {
  // Calculate derived values from Goal
  const totalDays = Math.ceil(currentGoal.goal_time / (60 * 60 * 24));
  
  // Convert to the original period for display
  const displayValue = currentGoal.completions.length;
  
  const displayTotal = currentGoal.period === 'weeks'
    ? Math.ceil(totalDays / 7)
    : totalDays;
  
  const unit = currentGoal.period === 'weeks' 
    ? (displayValue === 1 ? 'semaine' : 'semaines')
    : (displayValue === 1 ? 'jour' : 'jours');

  const totalUnit = currentGoal.period === 'weeks' 
    ? (displayTotal === 1 ? 'semaine' : 'semaines')
    : (displayTotal === 1 ? 'jour' : 'jours');

  return (
    <aside className="flex flex-col items-start justify-between gap-4 h-full mr-16 md:mr-20">
      {currentGoal.complete ? (
        <PlanetFlagIcon className="w-12 h-12 shrink-0 text-foreground [&>svg]:w-full [&>svg]:h-full" />
      ) : (
        <PlanetIcon className="w-12 h-12 shrink-0 text-foreground [&>svg]:w-full [&>svg]:h-full" />
      )}
  
      <div className="relative flex flex-col justify-end h-full w-8 md:w-12 border-l-[5px] border-b-[5px] border-t-[5px] border-foreground font-pixelify-sans">
        <div
          className="relative w-full border-l-[20px] border-foreground"
          style={{ height: `${currentGoal.progress}%` }}
        >
          <div 
            className={`
              absolute -top-2 -left-3 flex items-center gap-1 transform -translate-y-full
              ${currentGoal.complete && "hidden"}
            `}
          >
            <RocketIcon className="w-6 h-8 md:w-8 md:h-10 text-foreground" />
            <span className={`${(unit === "jours" || unit === "jour") ? "text-sm" : "text-xs"} text-foreground whitespace-nowrap`}>
              {displayValue} {unit}
            </span>
          </div>
        </div>
  
        <span className={`absolute -right-2 -bottom-3 translate-x-full ${(unit === "jours" || unit === "jour") ? "text-sm" : "text-xs"} text-nowrap text-foreground`}>
          0 {unit}
        </span>
        <span className={`absolute -right-2 -top-3 translate-x-full ${(unit === "jours" || unit === "jour") ? "text-sm" : "text-xs"} text-nowrap text-foreground`}>
          {displayTotal} {totalUnit}
        </span>
      </div>
  
      <FlagIcon className="w-12 h-10 shrink-0 text-foreground" />
    </aside>
  );
}
