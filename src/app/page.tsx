"use client";

import Link from "next/link";
import {
  Shield,
  Clock,
  Star,
  MapPin,
  MessageCircle,
  Wallet,
  Check,
  ArrowRight,
  Sparkles,
  Wrench,
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/data";
import { ServiceIcon } from "@/components/ui/icons";

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    description: "Choose from plumbing, cleaning, tutoring, beauty, and more. Get prices upfront.",
  },
  {
    number: "02",
    title: "Get matched with a pro",
    description: "We connect you with verified, background-checked providers near you.",
  },
  {
    number: "03",
    title: "Track your booking live",
    description: "Follow your provider in real-time, chat in-app, and pay securely.",
  },
];

const stats = [
  { value: "10M+", label: "Tasks completed" },
  { value: "50K+", label: "Vetted providers" },
  { value: "4.9★", label: "Average rating" },
  { value: "30min", label: "Avg. response time" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-surface-50/80 backdrop-blur-lg border-b border-surface-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-accent-500/25">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-xl font-bold text-primary-900">
              Task<span className="text-accent-500">Now</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-600">
            <Link href="#services" className="hover:text-primary-900 transition-colors">Services</Link>
            <Link href="#how-it-works" className="hover:text-primary-900 transition-colors">How it works</Link>
            <Link href="/pricing" className="hover:text-primary-900 transition-colors">Pricing</Link>
            <Link href="#providers" className="hover:text-primary-900 transition-colors">For Pros</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="hidden sm:inline-block text-sm font-semibold text-primary-900 hover:text-accent-600 px-4 py-2 rounded-lg transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 badge-green">
                <Sparkles className="w-3.5 h-3.5" />
                Vetted local professionals
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-900 mt-5 leading-tight">
                Home services,
                <br />
                <span className="text-accent-500">on demand.</span>
              </h1>
              <p className="text-lg text-surface-500 mt-5 max-w-md leading-relaxed">
                Book trusted plumbers, cleaners, tutors, and more in minutes. Track them live. Pay securely — all in one app.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/auth/signup" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4">
                  Book a Service
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="btn-outline flex items-center justify-center gap-2 text-base px-8 py-4">
                  View Pricing
                </Link>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-3">
                  {["MJ", "SC", "EW", "AO"].map((n, i) => (
                    <div
                      key={n}
                      className="w-10 h-10 rounded-full border-2 border-white bg-primary-900 text-white flex items-center justify-center text-xs font-bold"
                      style={{ zIndex: 4 - i }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-1 text-sm font-bold text-primary-900">4.9</span>
                  </div>
                  <p className="text-xs text-surface-500 mt-0.5">
                    Trusted by 50,000+ pros & 1M+ customers
                  </p>
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="hidden sm:flex justify-center">
              <div className="relative w-[320px]">
                <div className="absolute -inset-8 bg-gradient-to-tr from-accent-500/10 via-primary-900/5 to-accent-500/10 rounded-full blur-3xl" />
                <div className="relative bg-primary-900 rounded-[2.5rem] p-3 shadow-2xl shadow-primary-900/30 border-8 border-primary-950">
                  <div className="w-full rounded-[1.8rem] overflow-hidden bg-surface-50">
                    {/* Status bar */}
                    <div className="bg-white px-5 pt-3 pb-2 flex items-center justify-between text-[10px] text-primary-900">
                      <span className="font-semibold">9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-primary-900 rounded-sm opacity-80" />
                        <span className="w-3 h-3 bg-primary-900 rounded-sm opacity-60" />
                        <span className="w-3 h-3 bg-primary-900 rounded-sm opacity-40" />
                      </div>
                    </div>

                    {/* App content */}
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-surface-400">Good morning 👋</p>
                          <p className="text-sm font-bold text-primary-900">Sarah Johnson</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-[10px] font-bold text-white">
                          SJ
                        </div>
                      </div>

                      <div className="bg-accent-500 rounded-2xl p-3.5 text-white">
                        <p className="text-[10px] text-white/80">Plumber en route</p>
                        <p className="text-sm font-bold mt-0.5">Marcus 💧</p>
                        <div className="mt-3 bg-white/20 rounded-xl p-2 flex items-center gap-2">
                          <div className="flex-1 bg-white/30 rounded-full h-1.5 relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 w-2/3 bg-white rounded-full" />
                          </div>
                          <span className="text-[9px] font-bold">12 min</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-3.5 shadow-sm">
                        <p className="text-[10px] font-bold text-primary-900 uppercase tracking-wider">Services</p>
                        <div className="grid grid-cols-3 gap-2 mt-2.5">
                          {SERVICE_CATEGORIES.slice(0, 6).map((s) => (
                            <div key={s.category} className="bg-surface-50 rounded-xl p-2.5 flex flex-col items-center gap-1">
                              <ServiceIcon name={s.icon} className="w-4 h-4 text-primary-900" />
                              <span className="text-[8px] text-surface-500 font-medium">{s.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-3.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-primary-900 uppercase tracking-wider">Active</p>
                          <span className="text-[8px] text-accent-600 font-semibold bg-accent-50 px-2 py-0.5 rounded-full">
                            LIVE
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 mt-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-[9px] font-bold text-white">
                            MJ
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-primary-900">Kitchen Faucet Repair</p>
                            <p className="text-[9px] text-surface-400">123 Main St</p>
                          </div>
                          <span className="text-[10px] font-bold text-primary-900">$120</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-surface-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary-900">{stat.value}</p>
              <p className="text-sm text-surface-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-xl mx-auto">
          <span className="badge-blue">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mt-4">
            One app, every home need
          </h2>
          <p className="text-surface-500 mt-3">
            From urgent repairs to regular upkeep, find the right pro in seconds.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-12">
          {SERVICE_CATEGORIES.map((service) => (
            <Link
              key={service.category}
              href="/auth/signup"
              className="card group hover:border-accent-300 hover:-translate-y-1 text-center"
            >
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-primary-900/5 group-hover:bg-accent-500 group-hover:text-white text-primary-900 transition-all">
                <ServiceIcon name={service.icon} className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-surface-900 mt-3">{service.name}</h3>
              <p className="text-xs text-surface-500 mt-1">{service.description}</p>
              <p className="text-xs font-bold text-accent-600 mt-2">
                From ${service.startingPrice}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-primary-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 90% 10%, #10B981 0%, transparent 45%), radial-gradient(circle at 10% 90%, #3B5AA8 0%, transparent 40%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-xl mx-auto">
            <span className="badge-green">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">
              Book in minutes, not days
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {steps.map((step) => (
              <div key={step.number} className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur">
                <span className="text-4xl font-bold text-accent-400">{step.number}</span>
                <h3 className="text-lg font-bold mt-4">{step.title}</h3>
                <p className="text-sm text-primary-100/80 mt-2 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="badge-blue">Why TaskNow</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mt-4">
            Built for reliability
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Shield, title: "Fully vetted", text: "Every provider passes background checks and skill verification." },
            { icon: MapPin, title: "Live GPS tracking", text: "Follow your provider from dispatch to your door." },
            { icon: MessageCircle, title: "In-app chat", text: "Message your pro instantly. No phone tag." },
            { icon: Wallet, title: "Secure payments", text: "Pay in-app only when the job is done right." },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="card hover:-translate-y-1 p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-50">
                  <Icon className="w-6 h-6 text-accent-500" />
                </div>
                <h3 className="font-bold text-primary-900 mt-4">{feature.title}</h3>
                <p className="text-sm text-surface-500 mt-2 leading-relaxed">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Providers CTA */}
      <section id="providers" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="rounded-3xl bg-surface-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <span className="badge-green flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                For Providers
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mt-4 leading-tight">
                Turn your skills into steady income
              </h2>
              <p className="text-surface-500 mt-4 leading-relaxed">
                Join thousands of independent pros earning more with TaskNow. Set your own hours, get matched with quality jobs, and get paid fast.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Flexible schedule — work when you want",
                  "Reliable job flow in your area",
                  "Fast payouts with weekly direct deposit",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-500 shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-surface-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link href="/auth/role-select" className="btn-primary mt-8 inline-flex items-center gap-2">
                Start Earning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative min-h-[300px] bg-primary-900 p-8 sm:p-12 flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, #10B981 0%, transparent 45%), radial-gradient(circle at 90% 80%, #3B5AA8 0%, transparent 40%)",
                }}
              />
              <div className="relative card w-full max-w-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-900 text-white flex items-center justify-center text-xs font-bold">
                      MJ
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-900">Marcus Johnson</p>
                      <p className="text-xs text-accent-600">Top 5% Provider</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-accent-600">$1,248</span>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-surface-50 text-xs text-surface-600 flex items-center justify-between">
                  <span>Week earnings</span>
                  <span className="font-bold text-primary-900">+18%</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-surface-500">
                  <Clock className="w-3.5 h-3.5" /> Next payout Monday
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="rounded-3xl bg-accent-500 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 10% 20%, #ffffff 0%, transparent 40%), radial-gradient(circle at 90% 80%, #0F172A 0%, transparent 40%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to get things done?</h2>
            <p className="text-white/90 mt-3 max-w-md mx-auto">
              Join TaskNow today and experience the easiest way to book trusted local help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link href="/auth/signup" className="bg-primary-900 hover:bg-primary-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors w-full sm:w-auto">
                Create Free Account
              </Link>
              <Link href="/pricing" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-colors w-full sm:w-auto">
                See Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-primary-100/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-white font-bold">TaskNow</span>
              </div>
              <p className="text-sm text-primary-100/60 mt-3 leading-relaxed">
                On-demand local services connecting people with trusted pros.
              </p>
            </div>
            {[
              { title: "Services", links: ["Plumbing", "Cleaning", "Tutoring", "Beauty"] },
              { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
              { title: "Support", links: ["Help Center", "Safety", "Contact", "Legal"] },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="text-white font-semibold text-sm">{col.title}</h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p>© 2026 TaskNow. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}