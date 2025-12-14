import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google"; // Using Google Fonts as planned
import "./globals.css";
import Link from "next/link"; // Import Link

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Portfolio '26",
  description: "Interactive Portfolio with Next.js and Three.js",
};

import { CursorSparkles } from "@/components/CursorSparkles";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased text-foreground overflow-x-hidden`}>
        <CursorSparkles />
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-[100] mix-blend-difference text-white">
          <Link href="/" className="text-xl font-bold tracking-tighter hover:scale-105 transition-transform">
            PATIHARN PORTFOLIO '26
          </Link>
          <div className="flex gap-6">
            <Link href="#projects" className="hover:underline underline-offset-4 font-medium">Projects</Link>
            <Link href="#experience" className="hover:underline underline-offset-4 font-medium">Experience</Link>
            <Link href="#about" className="hover:underline underline-offset-4 font-medium">About</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
