"use client";

import { motion } from "framer-motion";

const lines = [
  [{ t: "I turn messy" }],
  [{ t: "workflows into" }],
  [{ t: "working", serif: true, accent: true }, { t: "software." }]
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-top">
          <span className="hero-status">
            <span className="status-dot" aria-hidden="true" />
            <span className="eyebrow">Available now · Forward-deployed + applied AI</span>
          </span>
          <span className="eyebrow">Vancouver · Montréal · Remote · Open to relocating</span>
        </div>

        <h1 className="hero-title" aria-label="I turn messy workflows into working software.">
          {lines.map((line, li) => (
            <span className="line" key={li} aria-hidden="true">
              <span className="hero-title-inner">
                {line.map((w, wi) => (
                  <span
                    key={wi}
                    className={`${w.serif ? "serif" : ""} ${w.accent ? "accent" : ""}`.trim()}
                  >
                    {w.t}
                    {wi < line.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
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
            I work where the problem is still fuzzy: talking to users, finding
            the real constraint, and shipping a useful system. My sweet spot is{" "}
            <span className="serif">applied AI with real-world edges</span>—browser
            automation, internal tools, and products people can actually use.
            <span className="hero-actions">
              <a className="hero-action primary" href="#work">Explore selected work</a>
              <a className="hero-action" href="/JaitenKang_Resume.pdf" download>Download résumé</a>
            </span>
          </motion.p>

          <motion.dl
            className="hero-facts"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-fact">
              <dt>Current</dt>
              <dd>Software Engineer · Gravity Computers</dd>
            </div>
            <div className="hero-fact">
              <dt>Mode</dt>
              <dd>Discover → Build → Deploy</dd>
            </div>
            <div className="hero-fact">
              <dt>Education</dt>
              <dd>B.Sc. Computer Science, McGill ’26</dd>
            </div>
            <div className="hero-fact">
              <dt>Seeking</dt>
              <dd>Forward-deployed · Applied AI · Product</dd>
            </div>
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
