"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Premium custom cursor. A small floating label that trails the pointer with
 * eased motion and reveals over any element carrying `data-cursor="…"`.
 * Desktop / fine-pointer only; bows out for touch and reduced-motion users so
 * the native cursor is never taken away when the effect can't be appreciated.
 */
export default function Cursor() {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    setEnabled(true);
    document.body.classList.add("cursor-enabled");

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let raf;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const onOver = (e) => {
      const hit = e.target.closest?.("[data-cursor]");
      if (hit) {
        // Use the event's own coordinates — target can be stale at entry
        pos.x = e.clientX;
        pos.y = e.clientY;
        target.x = e.clientX;
        target.y = e.clientY;
        const el = ref.current;
        if (el) el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        setLabel(hit.getAttribute("data-cursor") || "");
        setActive(true);
      }
    };

    const onOut = (e) => {
      const hit = e.target.closest?.("[data-cursor]");
      if (hit && !hit.contains(e.relatedTarget)) setActive(false);
    };

    const tick = () => {
      // ease toward the pointer for a soft, trailing follow
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.body.classList.remove("cursor-enabled");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className={`cursor ${active ? "is-active" : ""}`}
      aria-hidden="true"
    >
      <span className="cursor-label">
        {label}
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 13L13 3M13 3H5M13 3V11"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}
