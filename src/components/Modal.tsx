"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Native dialogs isolate the background; restore the opener when React removes the portal. */
export function Modal({ open, onClose, label, children, className = "", backdropClassName = "bg-black/50" }: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  backdropClassName?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <dialog
      ref={ref}
      aria-label={label}
      aria-modal="true"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const dialog = event.currentTarget;
        const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]'
        )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first) { event.preventDefault(); return; }
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }}
      className={`fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-foreground backdrop:bg-transparent open:flex ${className}`}
    >
      <button type="button" tabIndex={-1} aria-label="Close" onClick={onClose} className={`absolute inset-0 ${backdropClassName}`} />
      {children}
    </dialog>,
    document.body
  );
}
