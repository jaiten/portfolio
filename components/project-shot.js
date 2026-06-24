"use client";

import { useEffect, useRef, useState } from "react";

const Arrow = () => (
  <svg className="arrow" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ProjectShot({ p }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setActive(e.isIntersecting));
      },
      { threshold: 0.65 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <a
      ref={ref}
      className={`project-media${active ? " is-scrolled" : ""}`}
      href={p.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Visit ${p.title} live site`}
    >
      <div className="browser-frame">
        <div className="browser">
          <div className="browser-bar">
            <span className="browser-dot" />
            <span className="browser-dot" />
            <span className="browser-dot" />
            <span className="browser-url">{p.label}</span>
          </div>
          <img
            className="browser-shot"
            src={p.shot}
            alt={`${p.title} website`}
            loading="lazy"
          />
        </div>
      </div>
      <div className="project-caption">
        <span>{p.role}</span>
        <span className="project-caption-visit">
          <span className="visit-label">Visit {p.label}</span>
          <Arrow />
        </span>
      </div>
    </a>
  );
}
