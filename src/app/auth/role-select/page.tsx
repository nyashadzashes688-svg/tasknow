"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Wrench, User, Check, ArrowRight, Shield, Clock, Star, Loader2 } from "lucide-react";
import type { UserRole } from "@/types";

const roleOptions: {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  cta: string;
}[] = [
  {
    role: "client",
    title: "I need services",
    description: "Book trusted local pros for repairs, cleaning, tutoring & more",
    icon: User,
    features: ["Instant booking", "Real-time tracking", "Vetted professionals"],
    cta: "Find a Provider",
  },
  {
    role: "provider",
    title: "I provide services",
    description: "Get steady jobs from local customers & grow your business",
    icon: Wrench,
    features: ["Steady job flow", "Flexible schedule", "Fast payouts"],
    cta: "Get Jobs",
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const { createProfile, role: existingRole, isDemo } = useAuth();
  const [selected, setSelected] = useState<UserRole | null>(
    existingRole as UserRole | null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);

    if (!isDemo) {
      const result = await createProfile(selected);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    }

    router.push(selected === "client" ? "/client/dashboard" : "/provider/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-surface-50">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-accent-500/25">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-3xl font-bold text-primary-900">
              Task<span className="text-accent-500">Now</span>
            </span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-900">
            How do you want to use TaskNow?
          </h1>
          <p className="text-surface-500 mt-2">
            Select the account type that fits you best
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roleOptions.map((option) => {
            const isSelected = selected === option.role;
            const Icon = option.icon;
            return (
              <button
                key={option.role}
                type="button"
                onClick={() => setSelected(option.role)}
                className={cn(
                  "relative p-6 rounded-2xl border-2 bg-white text-left transition-all duration-200",
                  isSelected
                    ? "border-accent-500 shadow-card-hover ring-4 ring-accent-500/10"
                    : "border-surface-100 shadow-card hover:border-accent-200 hover:shadow-card-hover"
                )}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </span>
                )}

                <div
                  className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-2xl mb-5 transition-colors",
                    isSelected ? "bg-accent-500 text-white" : "bg-primary-900/5 text-primary-900"
                  )}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h2 className="text-lg font-bold text-primary-900">{option.title}</h2>
                <p className="text-sm text-surface-500 mt-1">{option.description}</p>

                <div className="mt-4 space-y-2">
                  {option.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-xs text-surface-600">
                      <Star className="w-3.5 h-3.5 text-accent-500" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div
                  className={cn(
                    "mt-5 flex items-center gap-2 text-sm font-semibold transition-colors",
                    isSelected ? "text-accent-600" : "text-surface-400"
                  )}
                >
                  {option.cta}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-surface-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Fully background checked
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Average response under 5 min
          </span>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className={cn(
            "w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2",
            selected && !loading
              ? "bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/25 active:scale-[0.99]"
              : "bg-surface-200 text-surface-400 cursor-not-allowed"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}