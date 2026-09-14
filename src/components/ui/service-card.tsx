"use client";

import { cn } from "@/lib/utils";
import { ServiceItem } from "@/types";
import { ServiceIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceItem;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ServiceCard({ service, selected, onClick, className }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 bg-white text-left w-full",
        className,
        selected
          ? "border-accent-500 bg-accent-50 shadow-card"
          : "border-transparent hover:border-accent-200 hover:bg-surface-50 shadow-card hover:shadow-card-hover"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl transition-colors",
          selected ? "bg-accent-500 text-white" : "bg-primary-900/5 text-primary-900"
        )}
      >
        <ServiceIcon name={service.icon} className="w-6 h-6" />
      </div>
      <span className="text-sm font-semibold text-surface-900 text-center">
        {service.name}
      </span>
      <span className="text-xs text-surface-500">
        From {formatCurrency(service.startingPrice)}
      </span>
    </button>
  );
}