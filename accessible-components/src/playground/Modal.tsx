import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]'
].join(",");

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleIdRef = useRef<string>(`modal-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
      if (!root) return [];
      const nodeList = root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      return Array.from(nodeList).filter((el) => {
        // Elements that are not visible should be excluded
        const style = window.getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden";
      });
    }

    function focusFirstElement() {
      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else if (dialogRef.current) {
        // If no focusable elements inside, focus the dialog container itself
        dialogRef.current.focus();
      }
    }

    function keydownHandler(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusable = getFocusableElements(dialogRef.current);

        /*
          FOCUS TRAP EXPLANATION:
          The focus trap inspects all focusable elements inside the dialog. On Tab/Shift+Tab
          keydown it determines whether the currently focused element is the first or last
          in that list. If the user presses Tab while focused on the last focusable element,
          focus is moved to the first element and the event is prevented. If the user presses
          Shift+Tab while focused on the first element, focus is moved to the last element.
          This prevents focus from leaving the dialog. If there are no focusable elements,
          Tab is prevented entirely and the dialog itself remains focused.
        */

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const active = document.activeElement as HTMLElement | null;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!active) {
          // If nothing is focused, move to the first
          e.preventDefault();
          first.focus();
          return;
        }

        if (!e.shiftKey && active === last) {
          // Tab on the last element -> cycle to first
          e.preventDefault();
          first.focus();
          return;
        }

        if (e.shiftKey && active === first) {
          // Shift+Tab on the first element -> cycle to last
          e.preventDefault();
          last.focus();
          return;
        }

        // Otherwise allow normal tab behavior within the dialog
      }
    }

    if (isOpen) {
      // Store the element that had focus before opening so we can restore it on close
      triggerRef.current = document.activeElement as HTMLElement | null;

      // Move focus into the dialog after paint so children are available
      requestAnimationFrame(() => focusFirstElement());

      // Attach keydown listener to enforce Escape and the focus trap
      document.addEventListener("keydown", keydownHandler);

      return () => {
        document.removeEventListener("keydown", keydownHandler);
      };
    }

    // On close, restore focus to the trigger element if available
    if (!isOpen) {
      if (triggerRef.current) {
        try {
          triggerRef.current.focus();
        } catch {
          // ignore focus errors
        }
      }
    }

    return undefined;
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        // Clicking the backdrop (overlay) closes the dialog. Only close when clicking the overlay itself,
        // not when clicking inside the dialog content.
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleIdRef.current}
        ref={dialogRef}
        tabIndex={-1}
        style={{
          background: "white",
          padding: "1rem",
          borderRadius: 6,
          maxWidth: "90%",
          maxHeight: "90%",
          overflow: "auto",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
        }}
        onMouseDown={(e) => {
          // Prevent overlay mousedown from being considered a backdrop click when clicking inside dialog
          e.stopPropagation();
        }}
      >
        <h2 id={titleIdRef.current} style={{ marginTop: 0 }}>
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
