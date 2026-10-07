"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Modal } from "./Modal";

export function Sheet({
  open,
  onClose,
  children,
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
}) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} label={label} className="items-end justify-center sm:items-center">
      <div className="nice-scroll relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-5 pb-8 shadow-xl sm:rounded-2xl">
        <button type="button" onClick={onClose} aria-label={`Close ${label}`} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card-2 text-muted">
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-track" />
        {children}
      </div>
    </Modal>
  );
}
