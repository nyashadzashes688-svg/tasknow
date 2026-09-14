"use client";

import { useState } from "react";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { StarRating } from "@/components/ui/star-rating";
import {
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
  Wallet,
  FileText,
  Image,
  Camera,
} from "lucide-react";
import Link from "next/link";

export default function ProviderProfilePage() {
  const [showLogout, setShowLogout] = useState(false);

  const menuItems = [
    { label: "Payout Settings", icon: Wallet, href: "#", description: "Bank •••• 4821" },
    { label: "Documents & Licenses", icon: FileText, href: "#", description: "Verified ✓" },
    { label: "Photos", icon: Image, href: "#", description: "6 photos" },
    { label: "Preferences", icon: Settings, href: "#", description: "Notifications, privacy" },
    { label: "Safety Center", icon: Shield, href: "#", description: "Trust & verification" },
    { label: "Help & Support", icon: HelpCircle, href: "#", description: "FAQs, contact us" },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="provider" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header title="Profile" showBack />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-6">
            {/* Profile card */}
            <section className="card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative self-start">
                  <Avatar name="Marcus Johnson" size="xl" />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent-500 hover:bg-accent-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-primary-900">Marcus Johnson</h2>
                    <span className="badge-green flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-sm text-surface-500 mt-1">marcus.johnson@email.com</p>
                  <div className="flex items-center gap-3 mt-2">
                    <StarRating rating={4.9} reviewCount={127} size="sm" />
                    <span className="text-xs text-surface-400">342 completed jobs</span>
                  </div>
                  <p className="text-sm text-surface-600 mt-3 leading-relaxed">
                    Licensed plumber and handyman with 12+ years of experience.
                    Quick, reliable, and professional.
                  </p>
                </div>
                <Link
                  href="#"
                  className="self-start sm:self-auto text-sm font-semibold text-accent-600 hover:text-accent-700 px-3 py-2 rounded-lg hover:bg-accent-50"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { value: "$65", label: "Hourly rate" },
                  { value: "4.9★", label: "Rating" },
                  { value: "64%", label: "Repeat clients" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-surface-50 py-3">
                    <p className="text-lg font-bold text-primary-900">{stat.value}</p>
                    <p className="text-[11px] text-surface-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pro upsell */}
            <Link href="/pricing" className="card bg-primary-900 p-6 flex items-center justify-between border-0">
              <div>
                <h3 className="font-bold text-white">Go Pro & save on fees</h3>
                <p className="text-sm text-primary-100/70 mt-1">
                  0% commission on your first 10 jobs
                </p>
              </div>
              <span className="bg-accent-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shrink-0">
                Upgrade
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

            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-red-100 bg-red-50/50 text-red-600 font-semibold hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </main>

          <BottomNav role="provider" />

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