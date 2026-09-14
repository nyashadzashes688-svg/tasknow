"use client";

import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotifications?: boolean;
  avatar?: { src?: string; name: string };
  rightAction?: React.ReactNode;
}

export function Header({ title, showBack, showNotifications, avatar, rightAction }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-surface-100">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href="#"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
              className="p-2 -ml-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-surface-700" />
            </Link>
          )}
          <h1 className="text-lg font-semibold text-primary-900">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {rightAction}
          {showNotifications && (
            <button className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors">
              <Bell className="w-5 h-5 text-surface-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
            </button>
          )}
          {avatar && (
            <Avatar src={avatar.src} name={avatar.name} size="sm" online />
          )}
        </div>
      </div>
    </header>
  );
}
