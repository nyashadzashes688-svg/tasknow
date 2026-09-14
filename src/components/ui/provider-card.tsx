"use client";

import { cn } from "@/lib/utils";
import { Provider } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { MapPin, BadgeCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProviderCardProps {
  provider: Provider;
  selected?: boolean;
  onClick?: () => void;
}

export function ProviderCard({ provider, selected, onClick }: ProviderCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 bg-white w-full text-left",
        selected
          ? "border-accent-500 bg-accent-50/50"
          : "border-surface-100 hover:border-accent-200 shadow-card hover:shadow-card-hover"
      )}
    >
      <Avatar
        name={provider.name}
        size="lg"
        src={provider.isVerified ? undefined : undefined}
        online={provider.isAvailable}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-surface-900 truncate">{provider.name}</h3>
          {provider.isVerified && (
            <BadgeCheck className="w-4 h-4 text-accent-500 shrink-0" />
          )}
        </div>
        <StarRating
          rating={provider.rating}
          reviewCount={provider.reviewCount}
          size="sm"
          showValue
        />
        <p className="text-xs text-surface-500 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {provider.location?.address}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="font-semibold text-primary-900">
          {formatCurrency(provider.hourlyRate)}
          <span className="text-xs font-normal text-surface-400">/hr</span>
        </p>
        <p className="text-xs text-surface-400 mt-0.5">
          {provider.completedJobs} jobs
        </p>
      </div>
    </button>
  );
}