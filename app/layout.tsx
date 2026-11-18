import type { Metadata } from "next";
import SmoothScroll from "@/provider/smooth-scroll-provider";
import "./globals.css";
import { Manrope, JetBrains_Mono, Orbitron } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-jetbrains",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Asad Khan — Backend Developer",
  description:
    "Asad Khan builds backend systems with Java & Spring Boot, focusing on performance, security, and products people actually use.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrains.variable} ${orbitron.variable}`}>
      <body className="bg-section-bg font-display text-heading antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}