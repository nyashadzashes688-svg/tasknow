"use client";

import { cn } from "@/lib/utils";
import { SubscriptionPlan } from "@/types";
import { Check, Sparkles, Loader2 } from "lucide-react";

interface PricingCardProps {
  plan: SubscriptionPlan;
  billingPeriod: "month" | "year";
  current?: boolean;
  loading?: boolean;
  onSelect?: (plan: SubscriptionPlan) => void;
}

export function PricingCard({ plan, billingPeriod, current, loading, onSelect }: PricingCardProps) {
  const isHighlighted = plan.highlighted;
  const price =
    billingPeriod === "year"
      ? Math.round(plan.price * 12 * 0.8 * 100) / 100
      : plan.price;

  return (
    <div
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300",
        isHighlighted
          ? "bg-primary-900 border-primary-900 text-white shadow-card-hover scale-[1.02]"
          : "bg-white border-surface-100 shadow-card hover:shadow-card-hover"
      )}
    >
      {isHighlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> MOST POPULAR
        </span>
      )}

      <h3 className={cn("text-lg font-semibold", isHighlighted ? "text-white" : "text-primary-900")}>
        {plan.name}
      </h3>
      <p className={cn("text-sm mt-1", isHighlighted ? "text-primary-100/70" : "text-surface-500")}>
        {plan.jobLimit
          ? `Up to ${plan.jobLimit} bookings per month`
          : "Unlimited bookings"}
      </p>

      <div className="flex items-baseline gap-2 mt-5">
        <span className={cn("text-4xl font-bold", isHighlighted ? "text-white" : "text-primary-900")}>
          ${price.toFixed(2)}
        </span>
        <span className={cn("text-sm", isHighlighted ? "text-primary-100/70" : "text-surface-400")}>
          / {billingPeriod === "year" ? "year" : "month"}
        </span>
      </div>

      {billingPeriod === "year" && plan.price > 0 && (
        <p className={cn("text-xs mt-1 flex items-center gap-1", isHighlighted ? "text-accent-300" : "text-accent-600")}>
          <Check className="w-3 h-3" /> Save 20% with annual billing
        </p>
      )}

      <ul className="mt-6 space-y-2.5 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex items-center justify-center w-4 h-4 rounded-full shrink-0",
                isHighlighted ? "bg-accent-500/20 text-accent-300" : "bg-accent-50 text-accent-600"
              )}
            >
              <Check className="w-3 h-3" />
            </span>
            <span className={cn("text-sm", isHighlighted ? "text-primary-100/90" : "text-surface-600")}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onSelect?.(plan)}
        className={cn(
          "mt-8 w-full font-semibold py-3 rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2",
          current
            ? "bg-surface-100 cursor-default"
            : isHighlighted
              ? "bg-accent-500 hover:bg-accent-600 text-white"
              : "bg-white border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white",
          loading && "opacity-60 pointer-events-none"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Redirecting…
          </>
        ) : current ? (
          "Current Plan"
        ) : (
          `Get ${plan.name}`
        )}
      </button>
    </div>
  );
}