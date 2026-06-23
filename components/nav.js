"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const links = [
  { label: "Work", href: "#work" },
  { label: "Products", href: "#products" },
  { label: "Systems", href: "#systems" },
  { label: "About", href: "#about" }
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a className="nav-brand" href="#top">
          <span className="nav-mark" aria-hidden="true" />
          Jaiten Kang
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a className="hide-sm" href={l.href} key={l.href}>
              {l.label}
            </a>
          ))}
          <a className="nav-cta" href="#contact">
            Contact
          </a>
        </nav>
      </div>
      <motion.div className="nav-progress" style={{ scaleX: progress }} />
    </header>
  );
}
