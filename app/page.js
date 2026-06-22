import ResumeScrollStack from "@/components/resume-scroll-stack";
import SocialLinks from "@/components/social-links";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" }
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/jaiten" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jaitenk" },
  { label: "Email", href: "mailto:jaitenkangis@gmail.com" }
];

const shippedItems = [
  { icon: "🧱", name: "North Extension", sub: "Chrome + Firefox · Live" },
  { icon: "🤖", name: "AI Browser Agent", sub: "Gemini 2.5 + Playwright" },
  { icon: "💻", name: "gravitycomputers.com", sub: "Next.js · Live" },
  { icon: "📝", name: "Word Count for Docs", sub: "Chrome Web Store · Live" }
];

const timelineItems = [
  {
    kind: "Extension",
    live: true,
    title: "North",
    role: "Focus & Distraction Blocker",
    period: "2026",
    summary:
      "Built and shipped a distraction-blocking browser extension for Chrome and Firefox — focus sessions, schedules, site limits, keyword rules, and local-only storage.",
    bullets: [
      "Engineered a priority-based rule evaluator in a background service worker that handles SPA route changes, webNavigation events, content-script URL polling, and browser cache guards.",
      "Added behavioral friction through a breathing timer and persistent journal unlock flow — time limits count only against the active focused tab and pause on browser idle.",
      "Shipped to the Chrome Web Store and Firefox Add-ons with no backend, no accounts, all local."
    ],
    projectLink: { label: "Chrome Web Store →", href: "" },
    tags: ["JavaScript", "Manifest V3", "Chrome Extension APIs", "Firefox"]
  },
  {
    kind: "AI System",
    live: false,
    title: "Agentic Browser Automation",
    role: "AI + Playwright System",
    period: "March 2026",
    summary:
      "An AI agent that reads live browser UI state through accessibility trees and executes multi-step workflows across dynamic interfaces.",
    bullets: [
      "Combined structured LLM planning (Gemini 2.5) with deterministic Playwright actions — model calls reserved for decisions only, not execution.",
      "Handles form-filling, navigation, and dynamic interfaces; reduced token usage by ~33% by separating planning from action loops.",
      "Reads real accessibility trees so it understands any interface without fragile selectors or screenshots."
    ],
    projectLink: { label: "", href: "" },
    tags: ["TypeScript", "Playwright", "Gemini 2.5", "Accessibility Trees"]
  },
  {
    kind: "Role",
    live: true,
    title: "Gravity Computers",
    role: "Software Engineer & IT Lead",
    period: "2020 – Present",
    summary:
      "Building and shipping web products for clients while running IT support across 250+ managed devices in Vancouver.",
    bullets: [
      "Designed and deployed production websites with Next.js, TypeScript, and Tailwind CSS — managing projects from client discovery through production.",
      "Delivered sites for Gravity Computers, Win Ratio, Shoebox Investments, North, and Wilco Civil.",
      "Reduced recurring IT issues by 20% and cut device setup times by 15% through proactive monitoring and process improvements."
    ],
    projectLink: { label: "gravitycomputers.com →", href: "https://www.gravitycomputers.com/" },
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "IT Operations"]
  },
  {
    kind: "Web App",
    live: false,
    title: "ADVSB",
    role: "Advanced Schedule Builder",
    period: "Sept – Dec 2024",
    summary:
      "Full-stack course planning and social platform for McGill students — scheduling logic, authentication, friend-based features.",
    bullets: [
      "Built with JavaScript, PHP, and SQL; includes real-time validation, authentication, and student management.",
      "Chart.js visualizations and jsPDF export for schedule sharing.",
      "Designed the interface around complex scheduling constraints so it stayed usable under load."
    ],
    projectLink: { label: "", href: "" },
    tags: ["JavaScript", "PHP", "SQL", "Chart.js", "jsPDF"]
  }
];

const miniProjects = [
  {
    type: "Chrome Extension",
    title: "Word Count for Google Docs",
    description:
      "Automatically enables live word count in Google Docs using DOM observation. No accounts, no backend, just works.",
    link: { label: "Chrome Web Store →", href: "" }
  },
  {
    type: "Website",
    title: "Win Ratio",
    description: "Production website for a sports analytics company. Built end-to-end with Next.js and Tailwind.",
    link: { label: "", href: "" }
  },
  {
    type: "Website",
    title: "Shoebox Investments",
    description: "Website for a real estate investment company.",
    link: { label: "", href: "" }
  },
  {
    type: "Website",
    title: "Wilco Civil",
    description: "Website for a civil engineering firm.",
    link: { label: "", href: "" }
  }
];

const skillGroups = [
  {
    title: "Languages",
    items: ["Python", "Java", "C", "JavaScript", "TypeScript", "SQL"]
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "React Native", "Tailwind CSS", "Framer Motion", "HTML/CSS"]
  },
  {
    title: "AI / LLM",
    items: ["LLM orchestration", "Agentic pipelines", "Prompt engineering", "Gemini", "GPT", "Whisper"]
  },
  {
    title: "Backend & Cloud",
    items: ["Node.js", "PHP", "PostgreSQL", "MongoDB", "AWS EC2", "Linux", "Playwright"]
  }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-noise" aria-hidden="true" />

      {/* ── Nav ── */}
      <header className="topbar">
        <a className="brand" href="#top">Jaiten Kang</a>
        <nav className="topnav" aria-label="Primary">
          {navLinks.map((l) => (
            <a href={l.href} key={l.href}>{l.label}</a>
          ))}
        </nav>
        <SocialLinks links={socialLinks} />
      </header>

      {/* ── Hero ── */}
      <section className="hero" id="top">
        <div className="hero-backdrop" aria-hidden="true">
          <div className="hero-backdrop-grid" />
          <div className="hero-backdrop-orb orb-one" />
          <div className="hero-backdrop-orb orb-two" />
        </div>

        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-status">
              <span className="status-dot" aria-hidden="true" />
              Montreal · Available
            </div>

            <h1>
              I build and ship
              <span className="h1-accent">AI tools that work.</span>
            </h1>

            <p className="hero-desc">
              Browser extensions, agentic systems, and web products — end to end,
              mostly alone, always in production. McGill CS &rsquo;26. I use AI
              to move fast and build above my weight class.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#work">See work →</a>
              <a className="btn btn-ghost" href="mailto:jaitenkangis@gmail.com">Get in touch</a>
            </div>
          </div>

          <aside>
            <div className="hero-aside-card">
              <div className="shipped-label">◉ Recently shipped</div>
              <div className="shipped-items">
                {shippedItems.map((item) => (
                  <div className="shipped-item" key={item.name}>
                    <div className="shipped-icon" aria-hidden="true">{item.icon}</div>
                    <div>
                      <p className="shipped-name">{item.name}</p>
                      <p className="shipped-sub">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Scroll stack ── */}
      <ResumeScrollStack items={timelineItems} />

      {/* ── Mini projects ── */}
      <section className="section mini-section">
        <div className="section-label">Also built</div>
        <div className="mini-grid">
          {miniProjects.map((p) => (
            <article className="mini-card" key={p.title}>
              <div className="mini-card-type">{p.type}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              {p.link.href ? (
                <a
                  className="mini-card-link"
                  href={p.link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.link.label}
                </a>
              ) : (
                <span className="mini-card-type" style={{ opacity: 0.5 }}>Next.js · Tailwind CSS</span>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ── Skills + Education ── */}
      <section className="section" id="skills">
        <div className="section-label">Skills &amp; Education</div>
        <div className="info-grid">
          <article className="info-card">
            <div className="section-label">Education</div>
            <h2>McGill University</h2>
            <p>
              B.Sc. Computer Science, 2021–2026. Coursework in applied machine
              learning, algorithm design, concurrent programming, software design,
              databases, and data structures.
            </p>
          </article>

          <article className="info-card">
            <div className="section-label">Skills</div>
            <div className="skills-grid">
              {skillGroups.map((g) => (
                <div className="skill-group" key={g.title}>
                  <h3>{g.title}</h3>
                  <div className="tag-row">
                    {g.items.map((s) => (
                      <span className="tag" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>jaitenkangis@gmail.com</span>
          <SocialLinks links={socialLinks} />
        </div>
      </footer>
    </main>
  );
}
