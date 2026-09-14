"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  MessageCircle,
  User,
  Briefcase,
  DollarSign,
  Calendar,
  LayoutDashboard,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const clientNavItems: NavItem[] = [
  { label: "Home", href: "/client/dashboard", icon: Home },
  { label: "Book", href: "/client/book", icon: Search },
  { label: "Chat", href: "/client/chat", icon: MessageCircle },
  { label: "Profile", href: "/client/profile", icon: User },
];

const providerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/provider/jobs", icon: Briefcase },
  { label: "Chat", href: "/provider/chat", icon: MessageCircle },
  { label: "Earnings", href: "/provider/earnings", icon: DollarSign },
  { label: "Profile", href: "/provider/profile", icon: User },
];

interface BottomNavProps {
  role: "client" | "provider";
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const items = role === "client" ? clientNavItems : providerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-100 shadow-bottom-nav safe-bottom sm:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]",
                isActive
                  ? "text-accent-500"
                  : "text-surface-400 hover:text-surface-600"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
              <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-5 h-0.5 bg-accent-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

interface SidebarProps {
  role: "client" | "provider";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = role === "client" ? clientNavItems : providerNavItems;

  return (
    <aside className="hidden sm:flex flex-col w-64 bg-white border-r border-surface-100 min-h-screen p-4 sticky top-0">
      <Link href={`/${role}/dashboard`} className="flex items-center gap-3 px-3 py-4 mb-4">
        <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <span className="text-xl font-bold text-primary-900">TaskNow</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-accent-50 text-accent-600 font-semibold"
                  : "text-surface-500 hover:bg-surface-50 hover:text-surface-700"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/pricing"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-500 hover:bg-surface-50 hover:text-surface-700 transition-all"
      >
        <Calendar className="w-5 h-5" />
        <span className="text-sm">Pricing</span>
      </Link>
    </aside>
  );
}
