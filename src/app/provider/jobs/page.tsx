"use client";

import { useState } from "react";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";
import { MapView } from "@/components/ui/map-view";
import {
  MapPin,
  Clock,
  Wallet,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Phone,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

type JobFilter = "all" | "available" | "upcoming" | "completed";

interface Job {
  id: string;
  title: string;
  description: string;
  client: string;
  clientId: string;
  time: string;
  date: string;
  price: number;
  distance: string;
  status: "available" | "confirmed" | "pending" | "completed";
  address: string;
  location: { lat: number; lng: number };
}

const mockJobs: Job[] = [
  {
    id: "j1",
    title: "Kitchen Faucet Repair",
    description: "Leaking faucet in kitchen needs cartridge replacement. Customer has the part.",
    client: "David Chen",
    clientId: "c10",
    time: "10:00 AM",
    date: "Sep 14",
    price: 120,
    distance: "1.2 mi",
    status: "confirmed",
    address: "123 Main St, Apt 4B, New York, NY 10001",
    location: { lat: 40.7484, lng: -73.9967 },
  },
  {
    id: "j2",
    title: "Bathroom Leak Fix",
    description: "Slow leak under bathroom sink. Homeowner says it's been mild for about a week.",
    client: "Maria Lopez",
    clientId: "c11",
    time: "3:30 PM",
    date: "Sep 14",
    price: 95,
    distance: "2.4 mi",
    status: "available",
    address: "789 Pine Ave, Apt 12, New York, NY 10003",
    location: { lat: 40.7309, lng: -73.9872 },
  },
  {
    id: "j3",
    title: "Water Heater Install",
    description: "Full unit replacement. 50-gallon tank, closet on first floor.",
    client: "James Wilson",
    clientId: "c12",
    time: "9:00 AM",
    date: "Sep 15",
    price: 350,
    distance: "3.1 mi",
    status: "pending",
    address: "456 Oak Lane, New York, NY 10002",
    location: { lat: 40.7282, lng: -73.7949 },
  },
  {
    id: "j4",
    title: "Toilet Running Fix",
    description: "Toilet constantly running, likely flapper issue. Job completed same day.",
    client: "Ana Rodriguez",
    clientId: "c13",
    time: "2:00 PM",
    date: "Sep 12",
    price: 85,
    distance: "1.8 mi",
    status: "completed",
    address: "246 Elm Ct, New York, NY 10004",
    location: { lat: 40.7614, lng: -73.9776 },
  },
  {
    id: "j5",
    title: "Sink Drain Cleaning",
    description: "Clogged kitchen sink, needs auger. Completed. Customer left 5-star review.",
    client: "Tom Baker",
    clientId: "c14",
    time: "11:30 AM",
    date: "Sep 10",
    price: 110,
    distance: "0.9 mi",
    status: "completed",
    address: "999 Maple St, New York, NY 10005",
    location: { lat: 40.7081, lng: -74.0067 },
  },
];

export default function ProviderJobsPage() {
  const [filter, setFilter] = useState<JobFilter>("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<string[]>([]);

  const filters: { id: JobFilter; label: string; count: number }[] = [
    { id: "all", label: "All Jobs", count: mockJobs.length },
    { id: "available", label: "Available", count: mockJobs.filter((j) => j.status === "available").length },
    { id: "upcoming", label: "Upcoming", count: mockJobs.filter((j) => j.status !== "completed").length },
    { id: "completed", label: "Completed", count: mockJobs.filter((j) => j.status === "completed").length },
  ];

  const filteredJobs = mockJobs.filter((job) => {
    if (filter === "all") return true;
    if (filter === "available") return job.status === "available";
    if (filter === "upcoming") return job.status !== "completed";
    return job.status === "completed";
  });

  const handleAccept = (job: Job) => {
    setAcceptedJobs((prev) => [...prev, job.id]);
    setSelectedJob(null);
  };

  const handleDecline = (job: Job) => {
    setRejectedJobs((prev) => [...prev, job.id]);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="provider" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header title="Jobs" showBack />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto space-y-5">
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {filters.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200",
                      active
                        ? "bg-primary-900 border-primary-900 text-white"
                        : "bg-white border-surface-200 text-surface-600 hover:border-primary-300"
                    )}
                  >
                    {f.label}
                    <span className={cn("ml-1.5 text-xs", active ? "text-accent-300" : "text-surface-400")}>
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Job cards */}
            <div className="space-y-3">
              {filteredJobs.map((job) => {
                const isAvailable = job.status === "available";
                const isRejected = rejectedJobs.includes(job.id);
                const isAccepted = acceptedJobs.includes(job.id);

                return (
                  <div
                    key={job.id}
                    className={cn(
                      "card",
                      isAvailable && !isRejected && "border-2 border-accent-300 bg-accent-50/30",
                      isAccepted && "opacity-60"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="hidden sm:flex flex-col gap-2 mt-1 shrink-0">
                        <Calendar className="w-5 h-5 text-surface-400" />
                        <MapPin className="w-5 h-5 text-surface-400" />
                        <Wallet className="w-5 h-5 text-surface-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-surface-900">{job.title}</h3>
                            <p className="text-xs text-surface-500 mt-0.5">{job.description}</p>
                          </div>
                          <span
                            className={cn(
                              "shrink-0",
                              isAvailable && !isRejected ? "badge-green" : isRejected ? "badge-red" : isAccepted ? "badge-gray" : job.status === "completed" ? "badge-green" : "badge-blue"
                            )}
                          >
                            {isRejected
                              ? "Declined"
                              : isAccepted
                                ? "Accepted"
                                : job.status === "completed"
                                  ? "Completed"
                                  : job.status === "available"
                                    ? "Available"
                                    : job.status === "pending"
                                      ? "Pending"
                                      : "Confirmed"}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <Avatar name={job.client} size="sm" />
                          <span className="text-sm text-surface-600">{job.client}</span>
                          <span className="text-surface-300">•</span>
                          <span className="text-xs text-surface-500">{job.distance}</span>
                        </div>

                        <div className="mt-2 flex items-center gap-3 text-xs text-surface-500">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {job.date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {job.time}
                          </span>
                          <span className={cn("ml-auto text-base font-bold", isAvailable ? "text-accent-600" : "text-primary-900")}>
                            ${job.price}
                          </span>
                        </div>

                        {/* Action buttons */}
                        {(isAvailable || job.status === "pending") && !isRejected && !isAccepted && (
                          <div className="mt-4 flex items-center gap-2">
                            {isAvailable ? (
                              <>
                                <button
                                  onClick={() => setSelectedJob(job)}
                                  className="flex-1 flex items-center justify-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleDecline(job)}
                                  className="flex-1 flex items-center justify-center gap-1.5 border-2 border-surface-200 hover:border-red-300 hover:bg-red-50 text-surface-600 hover:text-red-600 text-sm font-semibold py-2.5 rounded-xl transition-all"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Decline
                                </button>
                              </>
                            ) : (
                              <>
                                <button className="flex-1 flex items-center justify-center gap-1.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Confirm Job
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-1.5 border-2 border-surface-200 hover:border-red-300 hover:bg-red-50 text-surface-600 hover:text-red-600 text-sm font-semibold py-2.5 rounded-xl transition-all">
                                  <XCircle className="w-4 h-4" />
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {isAccepted && (
                          <p className="mt-3 text-xs text-surface-400">
                            You&apos;ve accepted this job. The customer has been notified.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          <BottomNav role="provider" />

          {/* Job detail modal */}
          <Modal
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            title={selectedJob?.title}
          >
            {selectedJob && (
              <div className="space-y-4">
                <MapView
                  height="h-48"
                  center={selectedJob.location}
                  markerLabel={selectedJob.distance + " away"}
                />
                <p className="text-sm text-surface-600">{selectedJob.description}</p>

                <div className="rounded-xl bg-surface-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Address</span>
                    <span className="font-medium text-surface-900 text-right">{selectedJob.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Date & time</span>
                    <span className="font-medium text-surface-900">{selectedJob.date}, {selectedJob.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Client</span>
                    <span className="font-medium text-surface-900">{selectedJob.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-500">Payout</span>
                    <span className="font-bold text-accent-600">${selectedJob.price}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-surface-200 text-surface-600 font-semibold text-sm hover:bg-surface-50">
                    <MessageCircle className="w-4 h-4" /> Message
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-surface-200 text-surface-600 font-semibold text-sm hover:bg-surface-50">
                    <Phone className="w-4 h-4" /> Call
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDecline(selectedJob)}
                    className="flex-1 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(selectedJob)}
                    className="flex-1 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold text-sm"
                  >
                    Accept Job
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}