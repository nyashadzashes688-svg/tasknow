"use client";

import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types";

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "badge-yellow" },
  accepted: { label: "Accepted", className: "badge-blue" },
  en_route: { label: "On the Way", className: "badge-blue" },
  arrived: { label: "Arrived", className: "badge-blue" },
  in_progress: { label: "In Progress", className: "badge-green" },
  completed: { label: "Completed", className: "badge-green" },
  cancelled: { label: "Cancelled", className: "badge-red" },
};

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn(config.className, className)}>
      {status === "en_route" || status === "in_progress" ? (
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" />
      ) : null}
      {config.label}
    </span>
  );
}
