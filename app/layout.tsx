import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
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
    <html lang="en" className={`${inter.variable} ${mono.variable} ${serif.variable} scroll-smooth bg-[#0a0a0a] [color-scheme:dark] motion-reduce:scroll-auto`}>
      <body className="bg-[#0a0a0a] font-[family-name:var(--font-inter)] text-[#f4f1ea] antialiased">
        {children}
      </body>
    </html>
  );
}