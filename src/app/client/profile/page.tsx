"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import {
  CreditCard,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
  Heart,
} from "lucide-react";

export default function ClientProfilePage() {
  const [showLogout, setShowLogout] = useState(false);

  const menuItems = [
    {
      label: "Payment Methods",
      icon: CreditCard,
      href: "#",
      description: "Visa •••• 4242",
    },
    {
      label: "Saved Addresses",
      icon: MapPin,
      href: "#",
      description: "3 addresses",
    },
    {
      label: "Notifications",
      icon: Settings,
      href: "#",
      description: "Push, email",
    },
    {
      label: "Safety Center",
      icon: Shield,
      href: "#",
      description: "Privacy & trust tools",
    },
    {
      label: "Help & Support",
      icon: HelpCircle,
      href: "#",
      description: "FAQs, contact us",
    },
    {
      label: "Invite Friends",
      icon: Heart,
      href: "#",
      description: "Earn $10 credit",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="client" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header title="Profile" showBack />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-6">
            {/* Profile card */}
            <section className="card p-6">
              <div className="flex items-center gap-4">
                <Avatar name="Sarah Johnson" size="xl" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-primary-900">Sarah Johnson</h2>
                  <p className="text-sm text-surface-500">sarah.johnson@email.com</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="badge-green">Basic Member</span>
                    <span className="badge-gray">Client</span>
                  </div>
                </div>
                <Link
                  href="#"
                  className="text-sm font-semibold text-accent-600 hover:text-accent-700 px-3 py-2 rounded-lg hover:bg-accent-50"
                >
                  Edit
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { value: "12", label: "Services booked" },
                  { value: "4.9", label: "Avg rating" },
                  { value: "$840", label: "Total spent" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-surface-50 py-3">
                    <p className="text-lg font-bold text-primary-900">{stat.value}</p>
                    <p className="text-[11px] text-surface-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Subscription upsell */}
            <Link href="/pricing" className="card bg-primary-900 text-white p-6 flex items-center justify-between border-0">
              <div>
                <h3 className="font-bold">Upgrade to Pro</h3>
                <p className="text-sm text-primary-100/70 mt-1">
                  Unlimited bookings & top providers
                </p>
              </div>
              <span className="bg-accent-500 text-white text-sm font-semibold px-4 py-2 rounded-xl">
                View Plans
              </span>
            </Link>

            {/* Menu */}
            <section className="card p-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-50">
                      <Icon className="w-5 h-5 text-surface-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-surface-900">{item.label}</p>
                      <p className="text-xs text-surface-500">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-300" />
                  </Link>
                );
              })}
            </section>

            {/* Logout */}
            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-red-100 bg-red-50/50 text-red-600 font-semibold hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </main>

          <BottomNav role="client" />

          <Modal isOpen={showLogout} onClose={() => setShowLogout(false)} title="Sign Out">
            <p className="text-surface-600 text-sm">Are you sure you want to sign out?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.location.href = "/auth/login";
                }}
                className="btn-primary flex-1 bg-red-500 hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}