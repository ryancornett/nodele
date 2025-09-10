import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function OverlayBase({
  title,
  onClose,
  children,
  wide = false
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-6">
        <div
          ref={containerRef}
          className={`w-full ${wide ? "max-w-3xl" : "max-w-xl"} rounded-2xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b dark:bg-black/80">
            <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
            <button
              className="px-2 py-1 rounded-md hover:bg-black/5 dark:text-white dark:hover:text-white/80 cursor-pointer"
              aria-label="Close overlay"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <div className="p-4 sm:p-6 dark:bg-black/80">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
