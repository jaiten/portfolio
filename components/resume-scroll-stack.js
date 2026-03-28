"use client";

import { useEffect, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildInitialStackState(length) {
  return {
    activeIndex: 0,
    itemProgress: Array.from({ length }, (_, index) => (index === 0 ? 1 : 0))
  };
}

function isSameStackState(currentState, nextState) {
  if (
    currentState.activeIndex !== nextState.activeIndex ||
    currentState.itemProgress.length !== nextState.itemProgress.length
  ) {
    return false;
  }

  return currentState.itemProgress.every(
    (value, index) => Math.abs(value - nextState.itemProgress[index]) < 0.01
  );
}

function getNextStackState(nodes) {
  const viewportHeight = window.innerHeight || 1;
  const revealStart = viewportHeight * 0.88;
  const revealEnd = viewportHeight * 0.22;

  const itemProgress = nodes.map((node, index) => {
    if (index === 0) {
      return 1;
    }

    if (!node) {
      return 0;
    }

    const rect = node.getBoundingClientRect();

    return clamp((revealStart - rect.top) / (revealStart - revealEnd), 0, 1);
  });

  const activeIndex = itemProgress.reduce((currentIndex, progress, index) => {
    return progress >= 0.58 ? index : currentIndex;
  }, 0);

  return { activeIndex, itemProgress };
}

function ProjectLinkButton({ projectLink }) {
  const href = projectLink?.href?.trim();

  if (!href) {
    return null;
  }

  return (
    <div className="resume-stack-actions">
      <a className="resume-project-link" href={href} rel="noreferrer" target="_blank">
        {projectLink.label || "View Project"}
      </a>
    </div>
  );
}

export default function ResumeScrollStack({ items }) {
  const rowRefs = useRef([]);
  const [stackState, setStackState] = useState(() =>
    buildInitialStackState(items.length)
  );

  rowRefs.current = rowRefs.current.slice(0, items.length);

  useEffect(() => {
    setStackState(buildInitialStackState(items.length));
  }, [items.length]);

  useEffect(() => {
    let frameId = 0;

    const requestSync = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(() => {
          frameId = 0;
          const nextState = getNextStackState(rowRefs.current);

          setStackState((currentState) =>
            isSameStackState(currentState, nextState) ? currentState : nextState
          );
        });
      }
    };

    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [items.length]);

  return (
    <section className="resume-shell section" id="experience">
      <div className="resume-intro">
        <div className="section-label">Experience / Projects</div>
        <h2>Work I&apos;ve done across startup, client, and academic projects.</h2>
        <p>
          Most of my experience so far has been frontend and product-focused,
          with a mix of startup work, shipped websites, IT support, and
          full-stack academic projects.
        </p>
      </div>

      <div className="resume-stack-list" role="list">
        {items.map((item, index) => {
          const revealProgress =
            stackState.itemProgress[index] ?? (index === 0 ? 1 : 0);
          const pastDepth = Math.max(stackState.activeIndex - index, 0);
          const futureDepth = Math.max(index - stackState.activeIndex, 0);
          const stackedDepth = Math.min(pastDepth, 3);

          const cardShift =
            pastDepth > 0
              ? -24 * stackedDepth
              : (1 - revealProgress) * (132 + futureDepth * 16);
          const cardScale =
            pastDepth > 0
              ? 1 - stackedDepth * 0.05
              : 0.9 + revealProgress * 0.1 - Math.min(futureDepth, 2) * 0.015;
          const cardOpacity =
            pastDepth > 0
              ? Math.max(0.24, 1 - stackedDepth * 0.22)
              : 0.38 + revealProgress * 0.62;
          const cardTilt =
            pastDepth > 0 ? stackedDepth * 2.4 : (1 - revealProgress) * 10;
          const cardBlur =
            pastDepth > 0 ? stackedDepth * 0.45 : (1 - revealProgress) * 4;

          return (
            <div
              className={[
                "resume-stack-row",
                index === stackState.activeIndex ? "is-current" : "",
                pastDepth > 0 ? "is-past" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              key={`${item.kind}-${item.title}`}
              ref={(node) => {
                rowRefs.current[index] = node;
              }}
              role="listitem"
              style={{
                "--index": index + 1,
                "--z-index": items.length - index
              }}
            >
              <article
                className={`resume-stack-item resume-stack-item-${index + 1}`}
                style={{
                  "--card-progress": revealProgress.toFixed(3),
                  "--card-scale": cardScale.toFixed(3),
                  "--card-shift": `${cardShift.toFixed(1)}px`,
                  "--card-opacity": cardOpacity.toFixed(3),
                  "--card-tilt": `${cardTilt.toFixed(2)}deg`,
                  "--card-blur": `${cardBlur.toFixed(2)}px`
                }}
              >
                <div className="resume-stack-header">
                  <div className="resume-stack-meta">
                    <span>{item.kind}</span>
                    <strong>{item.period}</strong>
                  </div>
                  <div className="resume-stack-location">{item.location}</div>
                </div>

                <div className="resume-stack-main">
                  <div className="resume-stack-index">0{index + 1}</div>
                  <div className="resume-stack-copy">
                    <h3>{item.title}</h3>
                    <h4>{item.role}</h4>
                    <p>{item.summary}</p>
                  </div>
                </div>

                <ul className="resume-bullets">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>

                <ProjectLinkButton projectLink={item.projectLink} />

                <div className="tag-row">
                  {item.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
