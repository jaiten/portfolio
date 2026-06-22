"use client";

import { useEffect, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildInitialState(length) {
  return {
    activeIndex: 0,
    itemProgress: Array.from({ length }, (_, i) => (i === 0 ? 1 : 0))
  };
}

function isSameState(a, b) {
  if (a.activeIndex !== b.activeIndex || a.itemProgress.length !== b.itemProgress.length) return false;
  return a.itemProgress.every((v, i) => Math.abs(v - b.itemProgress[i]) < 0.01);
}

function getNextState(nodes) {
  const vh = window.innerHeight || 1;
  const start = vh * 0.88;
  const end = vh * 0.22;

  const itemProgress = nodes.map((node, i) => {
    if (i === 0) return 1;
    if (!node) return 0;
    const rect = node.getBoundingClientRect();
    return clamp((start - rect.top) / (start - end), 0, 1);
  });

  const activeIndex = itemProgress.reduce((cur, p, i) => (p >= 0.58 ? i : cur), 0);
  return { activeIndex, itemProgress };
}

export default function ResumeScrollStack({ items }) {
  const rowRefs = useRef([]);
  const [state, setState] = useState(() => buildInitialState(items.length));

  rowRefs.current = rowRefs.current.slice(0, items.length);

  useEffect(() => { setState(buildInitialState(items.length)); }, [items.length]);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          const next = getNextState(rowRefs.current);
          setState((cur) => isSameState(cur, next) ? cur : next);
        });
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items.length]);

  return (
    <section className="section" id="work">
      <div className="section-label">Selected Work</div>
      <h2 className="work-heading">Things I&apos;ve built.</h2>
      <p className="work-subheading">
        Browser extensions, AI systems, and web products — shipped to real users.
      </p>

      <div className="resume-stack-list" role="list">
        {items.map((item, index) => {
          const progress = state.itemProgress[index] ?? (index === 0 ? 1 : 0);
          const pastDepth = Math.max(state.activeIndex - index, 0);
          const futureDepth = Math.max(index - state.activeIndex, 0);
          const stackedDepth = Math.min(pastDepth, 3);

          const cardShift = pastDepth > 0
            ? -20 * stackedDepth
            : (1 - progress) * (118 + futureDepth * 12);
          const cardScale = pastDepth > 0
            ? 1 - stackedDepth * 0.04
            : 0.9 + progress * 0.1 - Math.min(futureDepth, 2) * 0.012;
          const cardOpacity = pastDepth > 0
            ? Math.max(0.2, 1 - stackedDepth * 0.2)
            : 0.35 + progress * 0.65;
          const cardTilt = pastDepth > 0 ? stackedDepth * 2 : (1 - progress) * 9;
          const cardBlur = pastDepth > 0 ? stackedDepth * 0.4 : (1 - progress) * 4;

          return (
            <div
              className={[
                "resume-stack-row",
                index === state.activeIndex ? "is-current" : "",
                pastDepth > 0 ? "is-past" : ""
              ].filter(Boolean).join(" ")}
              key={`${item.kind}-${item.title}`}
              ref={(n) => { rowRefs.current[index] = n; }}
              role="listitem"
              style={{ "--index": index + 1, "--z-index": items.length - index }}
            >
              <article
                className="resume-stack-item"
                style={{
                  "--card-progress": progress.toFixed(3),
                  "--card-scale": cardScale.toFixed(3),
                  "--card-shift": `${cardShift.toFixed(1)}px`,
                  "--card-opacity": cardOpacity.toFixed(3),
                  "--card-tilt": `${cardTilt.toFixed(2)}deg`,
                  "--card-blur": `${cardBlur.toFixed(2)}px`
                }}
              >
                <div className="card-top">
                  <div className="card-top-left">
                    <span className="card-kind-badge">{item.kind}</span>
                    {item.live && <span className="card-live">Live</span>}
                  </div>
                  <span className="card-period">{item.period}</span>
                </div>

                <div className="card-body">
                  <div className="card-number">0{index + 1}</div>
                  <div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-role">{item.role}</p>
                    <p className="card-summary">{item.summary}</p>
                  </div>
                </div>

                <ul className="card-bullets">
                  {item.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <div className="card-footer">
                  {item.projectLink?.href?.trim() && (
                    <a
                      className="card-link"
                      href={item.projectLink.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.projectLink.label || "View →"}
                    </a>
                  )}
                  <div className="tag-row">
                    {item.tags.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
