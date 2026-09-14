"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import {
  TrendingUp,
  Users,
  Wallet,
  Star,
  ArrowRight,
  ChevronRight,
  Bell,
  Wrench,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function ProviderDashboardPage() {
  const [showNotification, setShowNotification] = useState(false);

  const stats = [
    {
      label: "This Week",
      value: "$1,248",
      change: "+18%",
      icon: Wallet,
      sub: "3 jobs completed",
    },
    {
      label: "Active Jobs",
      value: "2",
      change: "+1 today",
      icon: Wrench,
      sub: "1 in progress",
    },
    {
      label: "Rating",
      value: "4.9",
      change: "+0.2",
      icon: Star,
      sub: "127 reviews",
    },
    {
      label: "Repeat Clients",
      value: "64%",
      change: "+5%",
      icon: Users,
      sub: "32 returning",
    },
  ];

  const upcomingJobs = [
    {
      id: "j1",
      title: "Kitchen Faucet Repair",
      client: "David Chen",
      time: "Today, 10:00 AM",
      price: "$120",
      distance: "1.2 mi",
      status: "Confirmed",
    },
    {
      id: "j2",
      title: "Bathroom Leak Fix",
      client: "Maria Lopez",
      time: "Today, 3:30 PM",
      price: "$95",
      distance: "2.4 mi",
      status: "Pending",
    },
    {
      id: "j3",
      title: "Water Heater Install",
      client: "James Wilson",
      time: "Tomorrow, 9:00 AM",
      price: "$350",
      distance: "3.1 mi",
      status: "Confirmed",
    },
  ];

  const weeklyEarnings = [
    { day: "M", amount: 180, active: false },
    { day: "T", amount: 240, active: false },
    { day: "W", amount: 190, active: false },
    { day: "T", amount: 320, active: false },
    { day: "F", amount: 278, active: true },
    { day: "S", amount: 0, active: false },
    { day: "S", amount: 0, active: false },
  ];

  const maxEarning = Math.max(...weeklyEarnings.map((e) => e.amount));

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="provider" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header
            title="Dashboard"
            avatar={{ name: "Marcus Johnson" }}
            showNotifications
          />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-8">
            {/* Welcome banner */}
            <section className="rounded-3xl bg-primary-900 p-6 sm:p-8 text-white overflow-hidden relative">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 90% 10%, #10B981 0%, transparent 40%), radial-gradient(circle at 10% 100%, #3B5AA8 0%, transparent 35%)",
                }}
              />
              <div className="relative flex items-center gap-4">
                <Avatar name="Marcus Johnson" size="lg" online />
                <div>
                  <p className="text-sm text-accent-300 font-medium">Welcome back, Marcus</p>
                  <h2 className="text-xl sm:text-2xl font-bold mt-0.5">You&apos;re available</h2>
                  <p className="text-xs text-primary-100/70 mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-pulse-dot" />
                    Accepting new jobs · Online status: On
                  </p>
                </div>
                <Link
                  href="/provider/availability"
                  className="ml-auto hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Manage Schedule
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            {/* Stats grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="card p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent-50">
                        <Icon className="w-4.5 h-4.5 text-accent-600" />
                      </div>
                      <span className="text-[11px] font-semibold text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary-900 mt-3">{stat.value}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{stat.label}</p>
                    <p className="text-[11px] text-surface-400 mt-1">{stat.sub}</p>
                  </div>
                );
              })}
            </section>

            {/* Weekly earnings chart */}
            <section className="card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-primary-900">Weekly Earnings</h3>
                  <p className="text-xs text-surface-500">Jul 7 - Jul 13</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                  <TrendingUp className="w-4 h-4" />
                  $1,248
                </span>
              </div>
              <div className="flex items-end justify-between h-32">
                {weeklyEarnings.map((day) => (
                  <div key={day.day} className="flex flex-col items-center gap-2 w-full">
                    <span className="text-[10px] text-surface-400">
                      {day.amount > 0 ? `$${day.amount}` : ""}
                    </span>
                    <div
                      className={
                        day.active
                          ? "w-full max-w-8 rounded-full bg-accent-500"
                          : "w-full max-w-8 rounded-full bg-accent-300/60"
                      }
                      style={{
                        height: day.amount > 0 ? `${Math.max(12, (day.amount / maxEarning) * 100)}px` : "6px",
                        minHeight: "6px",
                      }}
                    />
                    <span className="text-xs font-medium text-surface-500">{day.day}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Today's schedule */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary-900">Today&apos;s Schedule</h3>
                <Link href="/provider/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:text-accent-700">
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingJobs.map((job) => (
                  <Link key={job.id} href="/provider/jobs" className="card flex items-center gap-4 w-full text-left hover:border-accent-200">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary-900/5 text-primary-900 shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-surface-900 truncate">{job.title}</h4>
                      <p className="text-xs text-surface-500 mt-0.5 flex items-center gap-2">
                        <span>{job.client}</span>
                        <span className="text-surface-300">•</span>
                        <span>{job.distance}</span>
                      </p>
                      <p className="text-[11px] text-surface-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.time}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary-900">{job.price}</p>
                      <span
                        className={
                          job.status === "Confirmed"
                            ? "badge-green mt-1"
                            : "badge-yellow mt-1"
                        }
                      >
                        {job.status}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-300 shrink-0" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Achievement */}
            <section className="card border border-accent-200 bg-gradient-to-br from-accent-50 to-white flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-500 text-white shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-primary-900">Top 5% Provider</h3>
                <p className="text-sm text-surface-500 mt-0.5">
                  You&apos;re in the top 5% of providers this month. Keep it up!
                </p>
              </div>
              <Bell className="w-5 h-5 text-accent-400 shrink-0" />
            </section>
          </main>

          <BottomNav role="provider" />

          <Modal isOpen={showNotification} onClose={() => setShowNotification(false)} title="Notifications">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">Booking confirmed</p>
                  <p className="text-xs text-surface-500">David confirmed the 10am repair</p>
                  <span className="text-[11px] text-surface-400">2 min ago</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">Payout sent</p>
                  <p className="text-xs text-surface-500">$278 from Friday&apos;s jobs</p>
                  <span className="text-[11px] text-surface-400">1 day ago</span>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}