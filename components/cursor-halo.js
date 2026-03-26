"use client";

import { useEffect, useRef } from "react";

export default function CursorHalo() {
  const haloRef = useRef(null);

  useEffect(() => {
    const halo = haloRef.current;

    if (!halo || window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    let frameId = 0;
    let x = window.innerWidth * 0.7;
    let y = window.innerHeight * 0.24;

    const paint = () => {
      frameId = 0;
      halo.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`;
      halo.style.opacity = "1";
    };

    const queuePaint = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(paint);
      }
    };

    const onPointerMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      queuePaint();
    };

    const onPointerLeave = () => {
      halo.style.opacity = "0";
    };

    paint();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return <div aria-hidden="true" className="cursor-halo" ref={haloRef} />;
}
