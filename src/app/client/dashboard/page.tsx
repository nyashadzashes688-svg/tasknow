"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { ServiceCard } from "@/components/ui/service-card";
import { BookingCard } from "@/components/ui/booking-card";
import { Modal } from "@/components/ui/modal";
import { MapPin, ChevronRight, TrendingUp, Clock } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/data";
import { ServiceCategory, Booking } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { fetchBookingsForUser } from "@/lib/db";

const onboarding = {
  name: "Sarah",
  subscriptionTier: "basic",
};

export default function ClientDashboardPage() {
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!profile?.id) return;
    let mounted = true;
    fetchBookingsForUser(profile.id, "client").then((bookings) => {
      if (!mounted) return;
      setRecentBookings(bookings);
      if (bookings.length > 0 && !activeBookingId) {
        setActiveBookingId(bookings[0].id);
      }
    });
    return () => {
      mounted = false;
    };
  }, [profile?.id, activeBookingId]);

  const featuredProviders = [
    {
      id: "p1",
      name: "Marcus Johnson",
      avatar: "MJ",
      category: "Plumbing",
      rating: 4.9,
      price: 65,
      distance: "0.8 mi",
    },
    {
      id: "p2",
      name: "Sarah Chen",
      avatar: "SC",
      category: "Cleaning",
      rating: 4.8,
      price: 45,
      distance: "1.2 mi",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="client" />
        <div className="flex-1 pb-20 sm:pb-0">
          <Header
            title="TaskNow"
            avatar={{ name: "Sarah Johnson" }}
          />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-8">
            {/* Welcome */}
            <section className="relative overflow-hidden rounded-3xl bg-primary-900 p-6 sm:p-8 text-white">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 85% 20%, #10B981 0%, transparent 40%), radial-gradient(circle at 10% 90%, #3B5AA8 0%, transparent 40%)",
                }}
              />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="text-sm text-accent-300 font-medium">Good morning, {onboarding.name} 👋</p>
                  <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                    What do you need done today?
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 transition-colors px-5 py-2.5 rounded-xl text-sm font-semibold">
                      <MapPin className="w-4 h-4" />
                      Book a Service
                    </button>
                    <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-5 py-2.5 rounded-xl text-sm font-semibold backdrop-blur">
                      Track Booking
                    </button>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-2 text-right">
                  <span className="inline-flex items-center gap-1.5 text-sm text-accent-300 font-medium">
                    <TrendingUp className="w-4 h-4" />
                    Ongoing
                  </span>
                  <span className="text-4xl font-bold">3</span>
                  <span className="text-xs text-primary-100/70">active bookings</span>
                </div>
              </div>
            </section>

            {/* Active booking strip */}
            <button
              onClick={() => setShowBookingDetails(true)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-surface-100 shadow-card hover:border-accent-200 transition-all text-left"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-50">
                <span className="relative flex w-3 h-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-900 text-sm">Marcus is on the way</p>
                <p className="text-xs text-surface-500 mt-0.5">
                  Kitchen Faucet Repair · ETA 12 min
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-surface-400 shrink-0" />
            </button>

            {/* Categories */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary-900">Services</h3>
                <Link
                  href="/client/book"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700"
                >
                  See all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
                {SERVICE_CATEGORIES.slice(0, 8).map((service) => (
                  <ServiceCard
                    key={service.category}
                    service={service}
                    selected={selectedCategory === service.category}
                    onClick={() => setSelectedCategory(service.category)}
                  />
                ))}
              </div>
            </section>

            {/* Nearby providers */}
            <section className="hidden sm:block">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary-900">Nearby Providers</h3>
                <Link href="/client/book" className="text-sm font-semibold text-accent-600">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {featuredProviders.map((provider) => (
                  <div key={provider.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary-900 text-white flex items-center justify-center font-bold">
                          {provider.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-surface-900">{provider.name}</h4>
                          <p className="text-xs text-surface-500">{provider.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
                        {provider.distance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100">
                      <span className="text-sm font-semibold text-primary-900">
                        ${provider.price}/hr
                      </span>
                      <span className="text-xs text-surface-400 ml-auto">
                        ★ {provider.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent bookings */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary-900">Recent Bookings</h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-surface-500">
                  <Clock className="w-3.5 h-3.5" />
                  Last 7 days
                </span>
              </div>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    compact
                    onClick={(b) => setActiveBookingId(b.id)}
                  />
                ))}
              </div>
            </section>
          </main>

          <BottomNav role="client" />

          {/* Booking details modal */}
          <Modal
            isOpen={showBookingDetails}
            onClose={() => setShowBookingDetails(false)}
            title="Booking Details"
          >
            {(() => {
              const booking = recentBookings.find((b) => b.id === activeBookingId);
              return booking ? <BookingCard booking={booking} /> : null;
            })()}
          </Modal>
        </div>
      </div>
    </div>
  );
}