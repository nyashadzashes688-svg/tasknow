"use client";

import { cn } from "@/lib/utils";

interface Slot {
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  selected: string | null;
  onSelect: (time: string) => void;
}

const mockSlots: Slot[] = [
  { time: "09:00 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "12:00 PM", available: true },
  { time: "01:00 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "03:00 PM", available: false },
  { time: "04:00 PM", available: true },
];

export function TimeSlotPicker({ selected, onSelect }: TimeSlotPickerProps) {
  return (
    <div>
      <p className="label">Pick a time</p>
      <div className="grid grid-cols-3 gap-2">
        {mockSlots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
            className={cn(
              "text-sm font-medium py-2.5 px-3 rounded-xl border-2 transition-all duration-200",
              slot.available
                ? selected === slot.time
                  ? "border-accent-500 bg-accent-50 text-accent-700"
                  : "border-surface-200 hover:border-accent-300 hover:bg-accent-50/50 text-surface-700"
                : "border-surface-100 bg-surface-50 text-surface-300 cursor-not-allowed opacity-60"
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
}