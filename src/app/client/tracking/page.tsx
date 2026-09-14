"use client";

import { useRouter } from "next/navigation";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { MapView } from "@/components/ui/map-view";
import { Avatar } from "@/components/ui/avatar";
import { Phone, MessageCircle, Clock, Shield } from "lucide-react";

export default function TrackingPage() {
  const router = useRouter();

  const stages = [
    { label: "Provider assigned", time: "9:45 AM", done: true },
    { label: "On the way to you", time: "ETA 12 min", done: true },
    { label: "Arrived & in progress", time: "—", done: false },
    { label: "Job completed", time: "—", done: false },
  ];

  const stage = 1;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="client" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header title="Track Booking" showBack />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-4">
            <MapView
              height="h-72 sm:h-96"
              center={{ lat: 40.7484, lng: -73.9967 }}
              markerLabel="Marcus is 1.2 mi away"
              showRoute
              routeProgress={stage}
            />

            {/* Live ETA card */}
            <div className="card bg-primary-900 text-white border-0">
              <div className="flex items-center gap-4">
                <Avatar name="Marcus Johnson" size="lg" online />
                <div className="flex-1">
                  <h3 className="font-semibold">Marcus Johnson</h3>
                  <p className="text-sm text-primary-100/70 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" /> Arriving in ~12 min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">12:47</p>
                  <p className="text-[11px] text-primary-100/70">expected arrival</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-semibold transition-colors">
                  <Phone className="w-4 h-4" /> Call
                </button>
                <button
                  onClick={() => router.push("/client/chat")}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
              </div>
            </div>

            {/* Progress timeline */}
            <div className="card">
              <h3 className="font-bold text-primary-900 mb-5">Booking Progress</h3>
              <div className="space-y-0">
                {stages.map((stageItem, i) => (
                  <div key={stageItem.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={
                          stageItem.done
                            ? "w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center shrink-0"
                            : "w-5 h-5 rounded-full border-2 border-surface-200 shrink-0"
                        }
                      >
                        {stageItem.done && (
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      {i < stages.length - 1 && (
                        <div
                          className={
                            stageItem.done
                              ? "w-0.5 flex-1 bg-accent-500 min-h-10"
                              : "w-0.5 flex-1 bg-surface-200 min-h-10"
                          }
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${stageItem.done ? "text-surface-900" : "text-surface-400"}`}>
                        {stageItem.label}
                      </p>
                      <p className="text-xs text-surface-400 mt-0.5">{stageItem.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety info */}
            <div className="card border border-accent-200 bg-accent-50/50 flex gap-3">
              <Shield className="w-5 h-5 text-accent-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-accent-800">Vetted & insured provider</p>
                <p className="text-xs text-accent-700 mt-0.5">
                  Marcus completed 342 verified jobs with a 4.9★ rating and is fully background-checked.
                </p>
              </div>
            </div>
          </main>

          <BottomNav role="client" />
        </div>
      </div>
    </div>
  );
}