"use client";

import { motion } from "framer-motion";

const lines = [
  [{ t: "I build" }, { t: "and ship" }],
  [{ t: "websites,", serif: false }],
  [{ t: "extensions", serif: false }, { t: "&", serif: true, accent: true }],
  [{ t: "AI systems.", serif: true, accent: true }]
];

const lineVariants = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: "0%",
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.95,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-top">
          <span className="hero-status">
            <span className="status-dot" aria-hidden="true" />
            <span className="eyebrow">Available for work — 2026</span>
          </span>
          <span className="eyebrow">Vancouver · Montréal · Remote</span>
        </div>

        <h1 className="hero-title" aria-label="I build and ship websites, extensions & AI systems.">
          {lines.map((line, li) => (
            <span className="line" key={li} aria-hidden="true">
              <motion.span
                style={{ display: "inline-block" }}
                custom={li}
                variants={lineVariants}
                initial="hidden"
                animate="show"
              >
                {line.map((w, wi) => (
                  <span
                    key={wi}
                    className={`${w.serif ? "serif" : ""} ${w.accent ? "accent" : ""}`.trim()}
                  >
                    {w.t}
                    {wi < line.length - 1 ? " " : ""}
                  </span>
                ))}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="hero-meta">
          <motion.p
            className="hero-lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Software engineer who turns ambiguous problems into{" "}
            <span className="serif">deployed products</span> — owning brand,
            design, build, and ship. I use AI to move fast and build above my
            weight class.
          </motion.p>

          <motion.dl
            className="hero-facts"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-fact">
              <dt>Role</dt>
              <dd>Software Engineer · Gravity Computers</dd>
            </div>
            <div className="hero-fact">
              <dt>Focus</dt>
              <dd>Web · Browser Extensions · AI Agents</dd>
            </div>
            <div className="hero-fact">
              <dt>Studying</dt>
              <dd>B.Sc. Computer Science, McGill ’26</dd>
            </div>
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
