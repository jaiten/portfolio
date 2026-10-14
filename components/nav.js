"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const links = [
  { label: "Work", href: "#work" },
  { label: "Products", href: "#products" },
  { label: "Systems", href: "#systems" },
  { label: "About", href: "#about" },
  { label: "Résumé", href: "/resume" }
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

  const scrollToSection = (event, href) => {
    if (!href.startsWith("#")) return;

    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a className="nav-brand" href="#top" onClick={(event) => scrollToSection(event, "#top")}>
          <span className="nav-mark" aria-hidden="true" />
          Jaiten Kang
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a className="hide-sm" href={l.href} key={l.href} onClick={(event) => scrollToSection(event, l.href)}>
              {l.label}
            </a>
          ))}
          <a className="nav-cta" href="#contact" onClick={(event) => scrollToSection(event, "#contact")}>
            Contact
          </a>
        </nav>
      </div>
      <motion.div className="nav-progress" style={{ scaleX: progress }} />
    </header>
  );
}
