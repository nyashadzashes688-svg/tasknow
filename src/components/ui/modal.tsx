"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={cn(
          "w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-surface-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-primary-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <X className="w-5 h-5 text-surface-500" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
