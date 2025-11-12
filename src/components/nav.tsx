import Image from "next/image";
import checkIcon from "../../assets/check-icon.svg";
import flagIcon from "../../assets/flag-icon.svg";
import profileIcon from "../../assets/profile-icon.svg";

interface NavProps {
  className?: string;
  tab?: "Completed" | "Goals" | "Profile";
}

export default function Nav({ tab = "Goals" }: NavProps) {
  const isActive = (currentTab: string) => currentTab === tab;

  return (
    <nav className="flex gap-4 items-center justify-center p-2.5">
      <button 
        className={isActive("Completed") 
          ? "border-4 border-white px-5 py-4" 
          : "border-2 border-white p-2.5"
        }
        aria-label="Completed goals"
      >
        <Image alt="" src={checkIcon} width={24} height={24} />
      </button>

      <button 
        className={isActive("Goals") 
          ? "border-4 border-white px-5 py-4" 
          : "border-2 border-white p-2.5"
        }
        aria-label="Goals"
      >
        <Image alt="" src={flagIcon} width={24} height={24} />
      </button>

      <button 
        className={isActive("Profile") 
          ? "border-4 border-white px-5 py-4" 
          : "border-2 border-white p-2.5"
        }
        aria-label="Profile"
      >
        <Image alt="" src={profileIcon} width={24} height={24} />
      </button>
    </nav>
  );
}
