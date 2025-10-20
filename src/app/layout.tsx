import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Adamina, Abhaya_Libre, Arapey } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const adamina = Adamina({
  variable: "--font-adamina",
  subsets: ["latin"],
  weight: "400",
});

const abhayaLibre = Abhaya_Libre({
  variable: "--font-abhaya-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const arapey = Arapey({
  variable: "--font-arapey",
  subsets: ["latin"],
  weight: "400",
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
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${adamina.variable} ${abhayaLibre.variable} ${arapey.variable} antialiased h-full`}
      >
        {children}
      </body>
    </html>
  );
}
