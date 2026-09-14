"use client";

import {
  Droplets,
  Sparkles,
  BookOpen,
  Scissors,
  Wrench,
  Zap,
  Paintbrush,
  Truck,
  Trees,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  droplets: Droplets,
  sparkles: Sparkles,
  "book-open": BookOpen,
  scissors: Scissors,
  wrench: Wrench,
  zap: Zap,
  paintbrush: Paintbrush,
  truck: Truck,
  trees: Trees,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] || Wrench;
  return <Icon className={className} />;
}

export {
  Droplets,
  Sparkles,
  BookOpen,
  Scissors,
  Wrench,
  Zap,
  Paintbrush,
  Truck,
  Trees,
  type LucideIcon,
};
