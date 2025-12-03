import Image from "next/image";
import metersHigh from "../../assets/meters_high.svg";
import metersMed from "../../assets/meters_med.svg";
import metersLow from "../../assets/meters_low.svg";
import tablerTrash from "../../assets/tabler_trash.svg";
import lucideEdit from "../../assets/lucide_edit.svg";
import qlementineReset from "../../assets/qlementine-icons_reset-16.svg";

interface ObjectifProps {
  className?: string;
  temps?: string;
  description?: string;
  titre?: string;
  objectif?: string;
}

export default function Objectif({ temps = "24", description = "Vous avez réussi à Coder en Next depuis 24 jours. Continuez !", titre = "Coder en Next", objectif = "31 jours" }: ObjectifProps) {
  // Choose meter based on progress
  const getMeterAsset = (days: string) => {
    const dayNumber = parseInt(days);
    if (dayNumber >= 40) return metersHigh;
    if (dayNumber >= 20) return metersMed;
    return metersLow;
  };

  return (
    <div className="bg-foreground/90 flex flex-col  h-60 p-2 rounded-xl w-[162.5px]">
      {/* Progress Meter */}
      <div className="relative w-full h-20 flex items-center justify-center p-2">
        <Image 
          alt="Progress meter" 
          src={getMeterAsset(temps)} 
          width={120} 
          height={90}
          className="object-contain"
        />
        <div className="absolute flex flex-col items-center justify-center text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1.5">
          <p className="text-2xl text-background font-adamina">{temps}</p>
          <p className="text-xs text-[#8a8a8a]">jours</p>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col items-center flex-1 w-full">
        <p className="text-sm text-background text-center font-abhaya-libre font-bold">
          {titre}
        </p>
        <p className="flex-1 text-xs text-background text-center font-arapey">
          {description}
        </p>
        <div className="flex items-center justify-center gap-0.5 text-xs text-[#8a8a8a] text-center">
          <p className="font-abhaya-libre font-bold">Objectif :</p>
          <p className="font-abhaya-libre">{objectif}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1.5 h-5 w-full">
        <button className="w-6 h-6 bg-[#cccccc] rounded-full flex items-center justify-center p-1">
          <Image alt="Delete" src={tablerTrash} width={16} height={16} />
        </button>
        <button className="flex-1 bg-[#8df3d8] rounded-full flex items-center justify-center px-2 py-1">
          <Image alt="Edit" src={lucideEdit} width={16} height={16} />
        </button>
        <button className="w-6 h-6 bg-[#fcb8b8] rounded-full flex items-center justify-center p-1">
          <Image alt="Reset" src={qlementineReset} width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
