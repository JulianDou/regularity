import type { Metadata } from "next";
import { Inter, Pixelify_Sans, Press_Start_2P} from "next/font/google";
import "./globals.css";

// Mobile UI assets
import { getSession } from "@/app/lib/session";

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
  title: "Regularity - Tracker d'habitudes",
  description: "Suivez vos habitudes et objectifs quotidiens avec Regularity. Visualisez votre progression et restez motivé.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  return (
    <html lang="en" className="h-screen">
      <body
        className={`${inter.variable} ${pixelifySans.variable} ${pressStart2P.variable} antialiased h-full font-press-start-2p`}
      >
        <div className="flex flex-col h-full p-4 border-2 border-foreground bg-background text-foreground pb-28">
          {
            user &&
            <p className="text-xs text-intermediate mb-2">Utilisateur <span className="text-foreground">{user?.username}</span> connecté</p>
          }
          <div className="flex flex-col grow overflow-y-scroll">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
