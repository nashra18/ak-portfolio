import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Asad Khan — Backend Developer",
  description:
    "Asad Khan builds backend systems with Java & Spring Boot, focusing on performance, security, and products people actually use.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} scroll-smooth motion-reduce:scroll-auto`}>
      <body className="bg-[#faf9f6] font-[family-name:var(--font-inter)] text-[#171717] antialiased">
        {children}
      </body>
    </html>
  );
}