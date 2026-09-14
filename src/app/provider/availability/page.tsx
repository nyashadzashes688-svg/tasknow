"use client";

import { useState } from "react";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import {
  Wrench,
  Sparkles,
  BookOpen,
  Scissors,
  Droplets,
  Zap,
  Paintbrush,
  Truck,
  Trees,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const serviceSkills = [
  { id: "plumbing", label: "Plumbing", icon: Droplets, rate: 65 },
  { id: "cleaning", label: "Cleaning", icon: Sparkles, rate: 45 },
  { id: "tutoring", label: "Tutoring", icon: BookOpen, rate: 40 },
  { id: "beauty", label: "Beauty", icon: Scissors, rate: 55 },
  { id: "handyman", label: "Handyman", icon: Wrench, rate: 55 },
  { id: "electrical", label: "Electrical", icon: Zap, rate: 70 },
  { id: "painting", label: "Painting", icon: Paintbrush, rate: 80 },
  { id: "moving", label: "Moving", icon: Truck, rate: 90 },
  { id: "landscaping", label: "Landscaping", icon: Trees, rate: 50 },
];

const weekDays = [
  { day: "Mon", label: "10 AM - 6 PM", enabled: true },
  { day: "Tue", label: "10 AM - 6 PM", enabled: true },
  { day: "Wed", label: "Off", enabled: false },
  { day: "Thu", label: "10 AM - 6 PM", enabled: true },
  { day: "Fri", label: "10 AM - 6 PM", enabled: true },
  { day: "Sat", label: "12 PM - 8 PM", enabled: true },
  { day: "Sun", label: "Off", enabled: false },
];

export default function ProviderAvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["plumbing", "handyman"]);
  const [schedule, setSchedule] = useState(weekDays);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === index ? { ...d, enabled: !d.enabled } : d))
    );
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="provider" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header title="Availability" showBack />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-6">
            {/* Master toggle */}
            <section className="card flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-900">Accepting Jobs</h3>
                <p className="text-sm text-surface-500 mt-0.5">
                  {isAvailable
                    ? "You're visible to customers looking for help"
                    : "Customers can't see you right now"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors relative",
                  isAvailable ? "bg-accent-500" : "bg-surface-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-6 h-6 bg-white rounded-full transition-all",
                    isAvailable ? "left-7" : "left-1"
                  )}
                />
              </button>
            </section>

            {/* Service areas */}
            <section className="card">
              <h3 className="font-bold text-primary-900 mb-1">Services You Offer</h3>
              <p className="text-xs text-surface-500 mb-4">
                Customers can book you for these services
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {serviceSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill.id);
                  const Icon = skill.icon;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left",
                        isSelected
                          ? "border-accent-500 bg-accent-50"
                          : "border-surface-200 hover:border-surface-300"
                      )}
                    >
                      <Icon className={cn("w-5 h-5 shrink-0", isSelected ? "text-accent-600" : "text-surface-400")} />
                      <span className={cn("text-sm font-medium", isSelected ? "text-accent-700" : "text-surface-600")}>
                        {skill.label}
                      </span>
                      <span className={cn("ml-auto text-xs font-semibold", isSelected ? "text-accent-600" : "text-surface-400")}>
                        ${skill.rate}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Weekly schedule */}
            <section className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-primary-900">Weekly Schedule</h3>
                  <p className="text-xs text-surface-500">Set your default working hours</p>
                </div>
                <button className="text-sm font-semibold text-accent-600 hover:text-accent-700">
                  Edit hours
                </button>
              </div>
              <div className="space-y-2">
                {schedule.map((day, i) => (
                  <div key={day.day} className="flex items-center gap-3 py-2">
                    <span className="w-10 font-semibold text-surface-800 text-sm">{day.day}</span>
                    <span className={`flex-1 text-sm ${day.enabled ? "text-surface-600" : "text-surface-300"}`}>
                      {day.label}
                    </span>
                    <button
                      onClick={() => toggleDay(i)}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative",
                        day.enabled ? "bg-accent-500" : "bg-surface-200"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all",
                          day.enabled ? "left-5.5" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Travel radius */}
            <section className="card">
              <h3 className="font-bold text-primary-900 mb-1">Travel Radius</h3>
              <p className="text-xs text-surface-500 mb-4">
                Maximum distance you&apos;re willing to travel for jobs
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={25}
                  defaultValue={10}
                  className="flex-1 accent-accent-500"
                />
                <span className="text-sm font-semibold text-primary-900 whitespace-nowrap">
                  10 miles
                </span>
              </div>
            </section>

            {/* Instant/advance notice */}
            <section className="card flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-900">Instant Job Alerts</h3>
                <p className="text-xs text-surface-500 mt-0.5">
                  Get pinged the moment a job matching your skills is posted
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-surface-300" />
            </section>

            <button className="btn-primary w-full">
              Save Changes
            </button>
          </main>

          <BottomNav role="provider" />
        </div>
      </div>
    </div>
  );
}