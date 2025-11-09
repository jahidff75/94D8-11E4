import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/layout/bottom-nav";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Doxpow Arena",
  description: "Doxpow Arena - The Complete Visual & Experience Blueprint",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "font-body antialiased bg-black",
          poppins.variable
        )}
      >
        <div className="relative mx-auto flex h-dvh max-w-md flex-col bg-background text-foreground shadow-2xl">
          <main className="flex-1 overflow-y-auto pb-24">{children}</main>
          <BottomNav />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
