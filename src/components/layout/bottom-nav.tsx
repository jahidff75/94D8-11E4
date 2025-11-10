"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Swords, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/matches", label: "Matches", icon: Swords },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();

  if (!user || pathname === '/login') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bg-card border-t border-border z-20">
      <div className="grid h-full grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
