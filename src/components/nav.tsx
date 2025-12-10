"use client";

import CheckIcon from "../../assets/check-icon.svg";
import FlagIcon from "../../assets/flag-icon.svg";
import ProfileIcon from "../../assets/profile-icon.svg";
import { useRouter } from "next/navigation";

interface NavProps {
  className?: string;
  tab?: "Completed" | "Goals" | "Profile";
}

export default function Nav({ tab = "Goals" }: NavProps) {
  const router = useRouter();
  const isActive = (currentTab: string) => currentTab === tab;

  return (
    <nav className="fixed bottom-0 left-0 generic-bordered-container w-full bg-background flex gap-4 items-center justify-center">
      <button 
        className={isActive("Completed") 
          ? "border-4 border-foreground px-5 py-4" 
          : "border-2 border-foreground p-2 cursor-pointer"
        }
        aria-label="Completed goals"
        onClick={() => router.push('/completed')}
      >
        <CheckIcon className="w-6 h-6 text-foreground" />
      </button>

      <button 
        className={isActive("Goals") 
          ? "border-4 border-foreground px-5 py-4" 
          : "border-2 border-foreground p-2 cursor-pointer"
        }
        aria-label="Goals"
        onClick={() => router.push('/')}
      >
        <FlagIcon className="w-6 h-6 text-foreground" />
      </button>

      <button 
        className={isActive("Profile") 
          ? "border-4 border-foreground px-5 py-4" 
          : "border-2 border-foreground p-2.5 cursor-pointer"
        }
        aria-label="Profile"
        onClick={() => router.push('/profile')}
      >
        <ProfileIcon className="w-6 h-6 text-foreground" />
      </button>
    </nav>
  );
}
