"use client";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Booking, Provider } from "@/types";
import { getProviderById } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { ServiceIcon } from "@/components/ui/icons";
import { ArrowRight } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  onClick?: (booking: Booking) => void;
  compact?: boolean;
}

export function BookingCard({ booking, onClick, compact }: BookingCardProps) {
  const provider: Provider | undefined = getProviderById(booking.providerId);

  return (
    <button
      type="button"
      onClick={() => onClick?.(booking)}
      className={cn(
        "card w-full text-left",
        compact ? "p-4" : "p-5",
        onClick && "cursor-pointer hover:border-accent-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-primary-900/5 text-primary-900">
            <ServiceIcon name={booking.category} className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-surface-900 truncate">{booking.title}</h3>
            {provider && (
              <div className="flex items-center gap-2 mt-0.5">
                <Avatar name={provider.name} size="sm" />
                <span className="text-xs text-surface-500 truncate">{provider.name}</span>
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {!compact && (
        <div className="mt-4 pt-4 border-t border-surface-100 space-y-1.5">
          <p className="text-sm text-surface-600 line-clamp-2">{booking.description}</p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-surface-500">
        <span>{formatDate(booking.scheduledDate)}</span>
        <span>•</span>
        <span>{booking.scheduledTime}</span>
        <span className="ml-auto font-semibold text-primary-900">
          ${booking.estimatedCost}
        </span>
        {onClick && <ArrowRight className="w-3.5 h-3.5 text-surface-400" />}
      </div>
    </button>
  );
}