import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/provider/smooth-scroll-provider";


export const metadata: Metadata = {
  title: "Asad Khan — Backend Developer",
  description:
    "Asad Khan builds backend systems with Java & Spring Boot, focusing on performance, security, and products people actually use.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body className="bg-[#0a0a0a] font-[family-name:var(--font-inter)] text-[#f4f1ea] antialiased">
        <SmoothScroll> {children}</SmoothScroll>
        
        
      </body>
    </html>
  );
}