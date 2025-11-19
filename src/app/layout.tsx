import type { Metadata } from "next";
import { Inter, Pixelify_Sans,  Press_Start_2P} from "next/font/google";
import Image from "next/image";
import "./globals.css";

// Mobile UI assets
import battery from "../../assets/layout/battery.svg";
import network from "../../assets/layout/network.svg";
import wifi from "../../assets/layout/wifi.svg";
import materialHome from "../../assets/layout/material-symbols_home-outline-rounded.svg";
import fluentTabs from "../../assets/layout/fluent_tabs-24-regular.svg";
import charmMenuKebab from "../../assets/layout/charm_menu-kebab.svg";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "HabitTracker - Mes Objectifs",
  description: "Suivez vos habitudes et objectifs quotidiens avec HabitTracker. Visualisez votre progression et restez motivé.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get current time for mobile status bar
  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${pixelifySans.variable} ${pressStart2P.variable} antialiased h-full font-press-start-2p`}
      >
        {/* Mobile smartphone UI wrapper - hidden on desktop */}
        <div className="bg-[#444444] flex flex-col h-full">
          {/* Mobile Status Bar - Top */}
          <div className="md:hidden flex items-center justify-between px-2.5 py-1.5 w-full">
            <p className="text-xs text-white font-medium font-inter">
              {currentTime}
            </p>
            <div className="flex items-center gap-1">
              <Image alt="Network" className="h-3 w-auto" src={network} width={16} height={12} />
              <Image alt="WiFi" className="h-3 w-auto" src={wifi} width={16} height={12} />
              <Image alt="Battery" className="h-3 w-auto" src={battery} width={24} height={12} />
            </div>
          </div>

          {/* Mobile Browser Header */}
          <div className="md:hidden flex items-center gap-2.5 p-2.5 w-full">
            <Image alt="Home icon" src={materialHome} width={24} height={24} className="shrink-0" />
            <div className="flex-1 bg-[#313131] px-5 py-2.5 rounded-full">
              <p className="text-xs text-white font-medium truncate font-inter">
                www.habittracker.app
              </p>
            </div>
            <Image alt="Tabs icon" src={fluentTabs} width={24} height={24} className="shrink-0" />
            <Image alt="Menu icon" src={charmMenuKebab} width={22} height={22} className="shrink-0" />
          </div>

          {/* Main content area */}
          <main className="flex-1 overflow-hidden">
            {children}
          </main>

          {/* Mobile Bottom Navigation Bar */}
          <div className="md:hidden flex items-center justify-center gap-2.5 px-15 py-2.5 w-full">
            <div className="flex-1 flex items-center justify-center py-2.5">
              <div className="bg-white rounded-sm w-4 h-4" />
            </div>
            <div className="flex-1 flex items-center justify-center py-2.5">
              <div className="bg-white rounded-full w-4 h-4" />
            </div>
            <div className="flex-1 flex items-center justify-center py-2.5">
              <div className="bg-white rounded-sm w-3 h-4" />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
