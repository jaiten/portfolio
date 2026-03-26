"use client";

import { useEffect, useRef } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function HeroScrollIndicator() {
  const fillRef = useRef(null);
  const dotRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const hero = document.getElementById("top");
    const fill = fillRef.current;
    const dot = dotRef.current;
    const root = rootRef.current;

    if (!hero || !fill || !dot || !root) {
      return undefined;
    }

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const rect = hero.getBoundingClientRect();
      const total = Math.max(rect.height - window.innerHeight * 0.35, 1);
      const progress = clamp(-rect.top / total, 0, 1);

      fill.style.transform = `scaleY(${progress})`;
      dot.style.top = `${progress * 88}px`;
      root.style.opacity = `${1 - progress * 1.15}`;
    };

    const requestUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <a className="hero-scroll-indicator" href="#experience" ref={rootRef}>
      <span className="hero-scroll-label">Scroll to explore</span>
      <span className="hero-scroll-line" aria-hidden="true">
        <span className="hero-scroll-line-fill" ref={fillRef} />
        <span className="hero-scroll-dot" ref={dotRef} />
      </span>
    </a>
  );
}
