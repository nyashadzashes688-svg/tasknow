"use client";

import { useState } from "react";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import {
  Wallet,
  TrendingUp,
  Banknote,
  Download,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const timeRanges = ["Week", "Month", "Year"];

const earnings = [
  {
    id: "e1",
    title: "Kitchen Faucet Repair",
    date: "Oct 11, 2026",
    client: "David Chen",
    amount: 108.0,
    fee: 12.0,
    status: "completed",
  },
  {
    id: "e2",
    title: "Sink Drain Cleaning",
    date: "Oct 10, 2026",
    client: "Tom Baker",
    amount: 99.0,
    fee: 11.0,
    status: "completed",
  },
  {
    id: "e3",
    title: "Toilet Running Fix",
    date: "Oct 8, 2026",
    client: "Ana Rodriguez",
    amount: 76.5,
    fee: 8.5,
    status: "completed",
  },
  {
    id: "e4",
    title: "Bathroom Leak Fix",
    date: "Oct 6, 2026",
    client: "Maria Lopez",
    amount: 85.5,
    fee: 9.5,
    status: "pending",
  },
];

const weeklyBars = [
  { day: "Mon", amount: 180 },
  { day: "Tue", amount: 240 },
  { day: "Wed", amount: 190 },
  { day: "Thu", amount: 320 },
  { day: "Fri", amount: 278 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 0 },
];

export default function ProviderEarningsPage() {
  const [range, setRange] = useState("Week");
  const maxWeek = Math.max(...weeklyBars.map((b) => b.amount));

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="provider" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header title="Earnings" showBack />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-6">
            {/* Balance card */}
            <section className="rounded-3xl bg-primary-900 p-6 sm:p-8 text-white relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 85% 15%, #10B981 0%, transparent 40%), radial-gradient(circle at 10% 100%, #3B5AA8 0%, transparent 35%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-primary-100/80 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-accent-300" />
                    Available Balance
                  </p>
                  <span className="badge-green bg-accent-500/20 text-accent-300">Ready to withdraw</span>
                </div>
                <p className="text-4xl sm:text-5xl font-bold mt-3">$1,248.00</p>
                <p className="text-xs text-primary-100/60 mt-2">
                  Payouts sent every Monday · Next payout in 4 days
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 py-3 rounded-xl text-sm font-semibold transition-colors">
                    <Banknote className="w-4 h-4" />
                    Withdraw
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-semibold transition-colors">
                    <Download className="w-4 h-4" />
                    Statement
                  </button>
                </div>
              </div>
            </section>

            {/* Period selector */}
            <div className="flex gap-2">
              {timeRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all",
                    range === r
                      ? "bg-primary-900 border-primary-900 text-white"
                      : "bg-white border-surface-200 text-surface-600"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Chart */}
            <section className="card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-primary-900">{range}ly Earnings</h3>
                  <p className="text-xs text-surface-500">Oct {new Date().getFullYear()}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                  <TrendingUp className="w-4 h-4" />
                  +18.2%
                </span>
              </div>
              <div className="flex items-end justify-between h-32 cb">
                {weeklyBars.map((bar) => (
                  <div key={bar.day} className="flex flex-col items-center gap-2 flex-1 max-w-10">
                    <span className="text-[10px] text-surface-400">
                      {bar.amount > 0 ? `$${bar.amount}` : ""}
                    </span>
                    <div
                      className={cn(
                        "w-6 rounded-full transition-all",
                        bar.amount > 0 ? "bg-accent-500" : "bg-surface-200"
                      )}
                      style={{
                        height: bar.amount > 0 ? (bar.amount / maxWeek) * 100 : 6,
                      }}
                    />
                    <span className="text-xs font-medium text-surface-500">{bar.day}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary stats */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Total earned", value: "$4,215", sub: "+$640 vs last week" },
                { label: "Jobs done", value: "14", sub: "+3 this week" },
                { label: "Avg per job", value: "$92", sub: "+$8 vs last week" },
                { label: "Tips received", value: "$86", sub: "From 6 customers" },
              ].map((stat) => (
                <div key={stat.label} className="card p-4">
                  <p className="text-xs text-surface-500">{stat.label}</p>
                  <p className="text-xl font-bold text-primary-900 mt-1">{stat.value}</p>
                  <p className="text-[11px] text-accent-600 mt-1">{stat.sub}</p>
                </div>
              ))}
            </section>

            {/* Transaction history */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary-900">Transaction History</h3>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                  <Calendar className="w-4 h-4" />
                  Filter
                </button>
              </div>
              <div className="space-y-3">
                {earnings.map((e) => (
                  <div key={e.id} className="card flex items-center gap-4 hover:border-accent-200">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-50 shrink-0">
                      <Banknote className="w-5 h-5 text-accent-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-surface-900 truncate">{e.title}</h4>
                      <p className="text-xs text-surface-500">
                        {e.date} · {e.client}
                      </p>
                      <p className="text-[11px] text-surface-400 mt-0.5">
                        Fee: ${e.fee.toFixed(2)} ({Math.round((e.fee / (e.amount + e.fee)) * 100)}%)
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn("font-bold", e.status === "pending" ? "text-surface-400" : "text-accent-600")}>
                        +${e.amount.toFixed(2)}
                      </p>
                      <p className={cn("text-[10px] mt-0.5", e.status === "pending" ? "badge-yellow" : "badge-green")}>
                        {e.status}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-300" />
                  </div>
                ))}
              </div>
            </section>
          </main>

          <BottomNav role="provider" />
        </div>
      </div>
    </div>
  );
}