"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { ServiceCard } from "@/components/ui/service-card";
import { ProviderCard } from "@/components/ui/provider-card";
import { TimeSlotPicker } from "@/components/ui/time-slot-picker";
import { Modal } from "@/components/ui/modal";
import { MapPin } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/data";
import { ServiceCategory, Provider } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { fetchProviders, createBooking } from "@/lib/db";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

const STEPS = ["Service", "Provider", "Schedule", "Confirm"];

export default function BookPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [address, setAddress] = useState("123 Main St, Apt 4B, New York, NY 10001");
  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    fetchProviders(category ?? undefined).then(setProviders);
  }, [category]);

  const selectedService = SERVICE_CATEGORIES.find((s) => s.category === category);
  const selectedProvider = providers.find((p) => p.id === providerId);

  const nextWeekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      full: d.toISOString(),
    };
  });

  const handleContinue = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else if (selectedProvider && profile?.id) {
      // Final step: persist the booking (or create a local demo booking).
      await createBooking({
        clientId: profile.id,
        providerId: selectedProvider.id,
        category: category ?? "handyman",
        title: `${selectedService?.name ?? category} Service`,
        description: notes || "",
        scheduledDate: new Date(selectedDate).toISOString().slice(0, 10),
        scheduledTime: selectedTime,
        address,
        estimatedCost: Math.round(selectedProvider.hourlyRate * 1.5),
      });
      setShowSuccess(true);
    } else {
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="client" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header title="Book a Service" showBack />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-8">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all",
                        i <= step
                          ? "bg-accent-500 border-accent-500 text-white"
                          : "bg-white border-surface-200 text-surface-400"
                      )}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-medium hidden sm:block",
                        i <= step ? "text-primary-900" : "text-surface-400"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-2 -mt-5 sm:-mt-4 rounded-full transition-colors",
                        i < step ? "bg-accent-500" : "bg-surface-200"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {step === 0 && (
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-primary-900">What do you need help with?</h2>
                  <p className="text-surface-500 mt-1 text-sm">Select the service category</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
                  {SERVICE_CATEGORIES.map((service) => (
                    <ServiceCard
                      key={service.category}
                      service={service}
                      selected={category === service.category}
                      onClick={() => setCategory(service.category)}
                    />
                  ))}
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-primary-900">Choose your provider</h2>
                  <p className="text-surface-500 mt-1 text-sm">
                    {selectedService?.name} providers near you
                  </p>
                </div>
                <div className="space-y-3">
                  {providers.filter((p) => p.isAvailable).map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      selected={providerId === provider.id}
                      onClick={() => setProviderId(provider.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-primary-900">Schedule your booking</h2>
                  <p className="text-surface-500 mt-1 text-sm">Pick a date and time</p>
                </div>

                <div>
                  <p className="label">Pick a date</p>
                  <div className="grid grid-cols-7 gap-2">
                    {nextWeekDates.map((date) => (
                      <button
                        key={date.full}
                        type="button"
                        onClick={() => setSelectedDate(date.full)}
                        className={cn(
                          "flex flex-col items-center py-3 rounded-xl border-2 transition-all duration-200",
                          selectedDate === date.full
                            ? "border-accent-500 bg-accent-50"
                            : "border-surface-200 hover:border-accent-300"
                        )}
                      >
                        <span className="text-[10px] font-medium text-surface-400">{date.label}</span>
                        <span className="text-lg font-bold text-primary-900">{date.day}</span>
                        <span className="text-[10px] text-surface-400">{date.month}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <TimeSlotPicker
                  selected={selectedTime}
                  onSelect={setSelectedTime}
                />
              </section>
            )}

            {step === 3 && (
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-primary-900">Review & confirm</h2>
                  <p className="text-surface-500 mt-1 text-sm">Double-check your booking details</p>
                </div>

                <div className="card space-y-4">
                  {selectedService && (
                    <div className="flex items-center gap-3">
                      <ServiceCard service={selectedService} className="w-16" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-surface-900">{selectedService.name}</h3>
                        <p className="text-xs text-surface-500">{selectedService.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-900 text-white flex items-center justify-center font-bold text-sm">
                      {selectedProvider?.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-surface-900">{selectedProvider?.name}</h3>
                      <p className="text-xs text-surface-500">
                        ★ {selectedProvider?.rating} · {formatCurrency(selectedProvider?.hourlyRate ?? 0)}/hr
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-surface-400 shrink-0" />
                    <span className="text-surface-600">Delivery to: {address}</span>
                  </div>

                  <div className="rounded-xl bg-surface-50 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-surface-500">Service base</span>
                      <span className="font-medium text-surface-900">
                        {formatCurrency(selectedProvider?.hourlyRate ?? 60)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-500">Estimated time</span>
                      <span className="font-medium text-surface-900">~1.5 hours</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-surface-200">
                      <span className="font-semibold text-surface-900">Estimated total</span>
                      <span className="font-bold text-primary-900">
                        {formatCurrency((selectedProvider?.hourlyRate ?? 60) * 1.5)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Notes for provider (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. Parking in rear, gate code 4821"
                    className="input-field resize-none"
                  />
                </div>
              </section>
            )}

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="btn-outline flex-1 sm:flex-none sm:w-32">
                  Back
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={
                  (step === 0 && !category) ||
                  (step === 1 && !providerId) ||
                  (step === 2 && (!selectedDate || !selectedTime))
                }
                className="btn-primary flex-1 sm:flex-none sm:w-40"
              >
                {step === STEPS.length - 1 ? "Confirm Booking" : "Continue"}
              </button>
            </div>
          </main>

          <BottomNav role="client" />

          {/* Success modal */}
          <Modal
            isOpen={showSuccess}
            onClose={() => router.push("/client/dashboard")}
            title="Booking Confirmed!"
          >
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-accent-50">
                <span className="w-4 h-4 bg-accent-500 rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mt-4">You&apos;re all set!</h3>
              <p className="text-surface-500 mt-2 text-sm">
                Your {selectedService?.name.toLowerCase()} booking with{" "}
                <span className="font-semibold text-surface-700">{selectedProvider?.name}</span>{" "}
                is confirmed for {selectedTime}.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => router.push("/client/tracking")}
                  className="btn-primary flex-1"
                >
                  Track Provider
                </button>
                <button
                  onClick={() => router.push("/client/dashboard")}
                  className="btn-outline flex-1"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}