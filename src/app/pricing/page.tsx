"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { PricingCard } from "@/components/ui/pricing-card";
import { Modal } from "@/components/ui/modal";
import { SUBSCRIPTION_PLANS } from "@/lib/data";
import { SubscriptionPlan } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  Shield,
  Star,
  Clock,
  Check,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isDemo } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleSelect = useCallback(
    async (plan: SubscriptionPlan) => {
      setSelectedPlan(plan);

      // Free plan: just record in DB and show success.
      if (plan.tier === "free") {
        if (!isDemo && user) {
          try {
            await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tier: "free" }),
            });
          } catch {}
        }
        setShowSuccess(true);
        return;
      }

      // Paid plan → create a Stripe Checkout session.
      if (isDemo || !user) {
        // Not logged in — send to signup.
        router.push("/auth/signup");
        return;
      }

      setCheckoutLoading(true);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier: plan.tier }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else if (data.error) {
          alert(data.error);
        }
      } catch {
        alert("Something went wrong. Please try again.");
      } finally {
        setCheckoutLoading(false);
      }
    },
    [isDemo, user, router]
  );

  // Handle returning from Stripe.
  useEffect(() => {
    if (searchParams.get("success") === "1") {
      setShowSuccess(true);
      router.replace("/pricing");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-surface-50">
      <header className="sticky top-0 z-30 bg-primary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-lg">
              Task<span className="text-accent-400">Now</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="text-sm font-semibold hover:text-accent-300 px-4 py-2 rounded-lg transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 badge-green">
            <Sparkles className="w-3.5 h-3.5" />
            Unlock the full TaskNow experience
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-primary-900 mt-4">
            Simple, transparent pricing
          </h1>
          <p className="text-surface-500 mt-4 text-lg">
            Choose the plan that fits your needs. Upgrade or cancel anytime — no hidden fees.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-white border border-surface-200 rounded-2xl p-1.5 mt-8">
            {(["month", "year"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBillingPeriod(period)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  billingPeriod === period
                    ? "bg-primary-900 text-white"
                    : "text-surface-500 hover:text-surface-700"
                )}
              >
                {period === "month" ? "Monthly" : "Yearly"}
                {period === "year" && (
                  <span className="ml-2 text-[10px] text-accent-400 font-bold">-20%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-12">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <PricingCard
              key={plan.tier}
              plan={plan}
              billingPeriod={billingPeriod}
              loading={checkoutLoading && selectedPlan?.tier === plan.tier}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Feature comparison */}
        <section className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 text-center">
            Everything you need to run your service business
          </h2>
          <p className="text-surface-500 text-center mt-3">
            Powerful features built-in at every tier
          </p>

          <div className="card mt-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="text-left py-4 px-4">Features</th>
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <th
                      key={plan.tier}
                      className={cn(
                        "text-center py-4 px-4",
                        plan.highlighted && "text-accent-600"
                      )}
                    >
                      <span className="font-bold">{plan.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Bookings per month", values: ["3", "15", "Unlimited", "Unlimited"] },
                  { label: "Priority matching", values: ["—", "✓", "✓", "✓"] },
                  { label: "Real-time GPS tracking", values: ["—", "✓", "✓", "✓"] },
                  { label: "In-app chat", values: ["✓", "✓", "✓", "✓"] },
                  { label: "Video calls", values: ["—", "—", "✓", "✓"] },
                  { label: "Advanced analytics", values: ["—", "—", "✓", "✓"] },
                  { label: "Priority support", values: ["—", "—", "✓", "✓"] },
                  { label: "Account manager", values: ["—", "—", "—", "✓"] },
                  { label: "API access", values: ["—", "—", "—", "✓"] },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-surface-50">
                    <td className="py-3.5 px-4 text-sm text-surface-700">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-3.5 px-4 text-center">
                        {v === "✓" ? (
                          <Check className={cn("mx-auto", SUBSCRIPTION_PLANS[i].highlighted ? "w-4 h-4 text-accent-500" : "w-4 h-4 text-surface-300")} />
                        ) : v === "—" ? (
                          <span className="text-surface-300 text-sm">—</span>
                        ) : (
                          <span className="text-sm font-medium text-surface-700">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Trust badges */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20">
          {[
            { icon: Shield, title: "Secure payments", text: "All payments handled securely. Cancel anytime with no penalty." },
            { icon: Star, title: "Satisfaction guarantee", text: "Not happy with a job? We'll make it right or refund you." },
            { icon: Clock, title: "24/7 support", text: "Our support team is here around the clock, seven days a week." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card text-center p-6">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-accent-50">
                  <Icon className="w-6 h-6 text-accent-600" />
                </div>
                <h3 className="font-bold text-primary-900 mt-4">{item.title}</h3>
                <p className="text-sm text-surface-500 mt-2">{item.text}</p>
              </div>
            );
          })}
        </section>

        {/* CTA */}
        <section className="mt-20 rounded-3xl bg-primary-900 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, #10B981 0%, transparent 50%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to get started?</h2>
            <p className="text-primary-100/80 mt-3 max-w-lg mx-auto">
              Join thousands of satisfied customers and independent professionals using TaskNow every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link href="/auth/signup?plan=pro" className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                Start Free Plan
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/auth/signup" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors w-full sm:w-auto">
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary-900 text-primary-100/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm">© 2026 TaskNow. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Success modal */}
      <Modal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Plan Selected"
      >
        <div className="text-center py-2">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-accent-50">
            <Check className="w-8 h-8 text-accent-600" />
          </div>
          <h3 className="text-xl font-bold text-primary-900 mt-4">
            {selectedPlan?.name} plan selected
          </h3>
          <p className="text-surface-500 mt-2 text-sm">
            You&apos;re one step away from unlocking {selectedPlan?.name} features.
            Create your account to continue.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/auth/signup" className="btn-primary flex-1 text-center">
              Create Account
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-50 grid place-items-center">
          <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}