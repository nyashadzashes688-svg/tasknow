"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  online?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

export function Avatar({ src, name, size = "md", className, online }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={80}
          height={80}
          className={cn("rounded-full object-cover", sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-primary-900 font-semibold text-white",
            sizeClasses[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            online ? "bg-accent-500" : "bg-surface-300",
            size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"
          )}
        />
      )}
    </div>
  );
}
