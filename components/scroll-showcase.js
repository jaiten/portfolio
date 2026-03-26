"use client";

import { useEffect, useRef, useState } from "react";

const storyFrames = [
  {
    step: "Phase 01",
    title: "Arrival",
    word: "ENTER",
    label: "Visual hook",
    copy:
      "The first movement should create tension immediately, with enough mystery to make the next scroll feel inevitable.",
    note: "Big type, deep contrast, and a shape system that feels authored instead of assembled."
  },
  {
    step: "Phase 02",
    title: "Lift",
    word: "DRIFT",
    label: "Motion cadence",
    copy:
      "As the user moves, the layout should shift around them. The site starts to feel kinetic without needing gimmicks.",
    note: "Sticky objects, soft parallax, and controlled transitions give the page a confident designer rhythm."
  },
  {
    step: "Phase 03",
    title: "Focus",
    word: "FRAME",
    label: "Story control",
    copy:
      "Once interest is there, the content should sharpen. The page narrows attention and makes each block feel curated.",
    note: "Editorial spacing and stronger hierarchy make the work itself feel more premium."
  },
  {
    step: "Phase 04",
    title: "Finish",
    word: "PULL",
    label: "Last impression",
    copy:
      "The final sections should still feel active, like the site is carrying you to the close instead of fading out.",
    note: "The sticky stage stays present long enough to make the whole experience feel connected."
  }
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ScrollShowcase() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const rect = section.getBoundingClientRect();
      const total = Math.max(rect.height - window.innerHeight, 1);
      const nextProgress = clamp(-rect.top / total, 0, 1);

      setProgress((current) =>
        Math.abs(current - nextProgress) > 0.001 ? nextProgress : current
      );
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

  const activeIndex = Math.min(
    storyFrames.length - 1,
    Math.floor(progress * storyFrames.length)
  );
  const activeFrame = storyFrames[activeIndex];

  const shellTransform = `translate3d(0, ${progress * -18}px, 0) scale(${0.96 + progress * 0.06})`;
  const orbitTransform = `translate(-50%, -50%) rotate(${progress * 260}deg)`;
  const needleTransform = `translate(-50%, -100%) rotate(${50 + progress * 240}deg)`;
  const progressTransform = `scaleY(${0.18 + progress * 0.82})`;

  return (
    <section className="story-shell" id="experience" ref={sectionRef}>
      <div className="story-intro">
        <div className="section-label">Guided Scroll</div>
        <h2>A persistent stage that follows you down the page.</h2>
        <p>
          This section is built to feel more like a designer portfolio reveal.
          The narrative scrolls. The stage stays with you. The mood changes as
          you descend.
        </p>
      </div>

      <div className="story-layout">
        <div className="story-steps">
          {storyFrames.map((frame, index) => (
            <article
              className={`story-step ${index === activeIndex ? "is-active" : ""}`}
              key={frame.title}
            >
              <div className="story-step-index">0{index + 1}</div>
              <div className="story-step-copy">
                <span>{frame.step}</span>
                <h3>{frame.title}</h3>
                <p>{frame.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="story-sticky">
          <div className="story-stage-shell" style={{ transform: shellTransform }}>
            <div className="story-stage-glow" />
            <div className="story-stage-grid" />
            <div className="story-stage-orbit" style={{ transform: orbitTransform }} />
            <div className="story-stage-orbit story-stage-orbit-small" />
            <div className="story-stage-needle" style={{ transform: needleTransform }} />
            <div className="story-stage-center" />
            <div className="story-stage-word">{activeFrame.word}</div>
            <div className="story-progress-rail">
              <span style={{ transform: progressTransform }} />
            </div>
          </div>

          <div className="story-meta">
            <div className="story-meta-top">
              <span>{activeFrame.step}</span>
              <strong>{activeFrame.label}</strong>
            </div>
            <p>{activeFrame.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
