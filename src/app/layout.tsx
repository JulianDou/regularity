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
        {/* Main content area */}
        <main className="flex-1 overflow-hidden h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
