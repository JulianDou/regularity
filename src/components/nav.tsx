import Image from "next/image";
import tablerCheck from "../../assets/tabler_check.svg";
import lucideGoal from "../../assets/lucide_goal.svg";
import iconamoonProfile from "../../assets/iconamoon_profile.svg";

interface NavProps {
  className?: string;
  tab?: "Completed" | "Goals" | "Profile";
}

export default function Nav({ tab = "Completed" }: NavProps) {
  const tablerCheckIcon = (
    <Image alt="Check icon" src={tablerCheck} width={24} height={24} />
  );
  
  const lucideGoalIcon = (
    <Image alt="Goal icon" src={lucideGoal} width={24} height={24} />
  );
  
  const profileIcon = (
    <Image alt="Profile icon" src={iconamoonProfile} width={24} height={24} />
  );

  if (tab === "Goals") {
    return (
      <div className="flex gap-4 h-[74px] items-center justify-center p-2.5">
        <button className="bg-white rounded-xl p-2.5 opacity-90">
          {tablerCheckIcon}
        </button>
        <button className="bg-white rounded-xl px-5 py-4">
          {lucideGoalIcon}
        </button>
        <button className="bg-white rounded-xl p-2.5 opacity-90">
          {profileIcon}
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex gap-4 h-[74px] items-center justify-center p-2.5">
      <button className="bg-white rounded-xl px-5 py-4">
        {tablerCheckIcon}
      </button>
      <button className="bg-white rounded-xl p-2.5 opacity-90">
        {lucideGoalIcon}
      </button>
      <button className="bg-white rounded-xl p-2.5 opacity-90">
        {profileIcon}
      </button>
    </div>
  );
}
