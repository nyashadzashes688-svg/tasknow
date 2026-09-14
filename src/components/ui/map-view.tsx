"use client";

import { cn } from "@/lib/utils";

interface MapViewProps {
  className?: string;
  center?: { lat: number; lng: number };
  markerLabel?: string;
  showRoute?: boolean;
  routeProgress?: number;
  height?: string;
}

export function MapView({
  className,
  center,
  markerLabel,
  showRoute = false,
  routeProgress = 0,
  height = "h-64",
}: MapViewProps) {
  const lat = center?.lat ?? 40.7128;
  const lng = center?.lng ?? -74.006;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-surface-100", height, className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #E2E8F0 0%, transparent 25%), radial-gradient(circle at 80% 60%, #E2E8F0 0%, transparent 30%), linear-gradient(135deg, #F1F5F9 25%, transparent 25%), linear-gradient(225deg, #F1F5F9 25%, transparent 25%), linear-gradient(45deg, #F1F5F9 25%, transparent 25%), linear-gradient(315deg, #F1F5F9 25%, transparent 25%)",
          backgroundSize: "80px 80px, 90px 90px, 160px 160px",
          backgroundPosition: "0 0, 0 0, 80px 80px",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Cartographic lines */}
          <div className="h-40 w-40 rounded-full border-2 border-primary-900/10" />
          <div className="absolute inset-3 rounded-full border-2 border-primary-900/10" />
          <div className="absolute inset-6 rounded-full border-2 border-primary-900/10" />

          {/* Pulsing location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-accent-500/20 animate-ping" />
              <span className="relative flex h-8 w-8 rounded-full bg-accent-500 border-4 border-white shadow-lg items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Route line */}
      {showRoute && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250">
          <path
            d="M 60 190 C 120 200, 160 160, 200 130 S 300 70, 340 60"
            fill="none"
            stroke="#10B981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={routeProgress > 0 ? "8 6" : undefined}
          />
          <circle cx="60" cy="190" r="6" fill="#0F172A" />
          <circle cx="340" cy="60" r="7" fill="#10B981">
            {showRoute && <animate attributeName="r" values="5;8;5" dur="1.2s" repeatCount="indefinite" />}
          </circle>
          <circle
            cx="60"
            cy="190"
            r="0"
            fill="#0F172A"
          >
            {routeProgress > 0 && (
              <animateMotion dur="6s" repeatCount="indefinite" path="M 60 190 C 120 200, 160 160, 200 130 S 300 70, 340 60" />
            )}
          </circle>
        </svg>
      )}

      {/* Coordinate label */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 shadow-sm text-xs font-medium text-surface-600">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </div>

      {markerLabel && (
        <div className="absolute top-3 left-3 bg-primary-900 text-white rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-pulse-dot" />
          {markerLabel}
        </div>
      )}
    </div>
  );
}