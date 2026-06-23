import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";

/* ----------------------------- data ----------------------------- */

const marquee = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "Playwright",
  "Chrome Extensions",
  "Gemini 2.5",
  "Whisper",
  "PostgreSQL",
  "AWS"
];

const websites = [
  {
    title: "Gravity Computers",
    kicker: "Managed IT, made effortless",
    desc:
      "Rebuilt the company’s marketing site end-to-end — brand, copy, design, build, and deploy. Faster load times and a clearer conversion flow lifted client inquiries.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Brand"],
    url: "https://www.gravitycomputers.com/",
    label: "gravitycomputers.com",
    shot: "/shots/gravity.png",
    role: "Brand → Build → Deploy"
  },
  {
    title: "Win / Ratio",
    kicker: "An editorial studio identity",
    desc:
      "A refined, type-forward site for a team of writers, editors, and designers who help companies win work — built to feel as considered as the service it sells.",
    tags: ["Next.js", "TypeScript", "Editorial", "Motion"],
    url: "https://winratio.vercel.app/",
    label: "winratio.vercel.app",
    shot: "/shots/winratio.png",
    role: "Design → Build"
  },
  {
    title: "North",
    kicker: "A product site with a point of view",
    desc:
      "The marketing home for my focus extension — sharp positioning, soft gradients, and an interactive product demo that sells the idea before the install.",
    tags: ["Next.js", "Product", "Motion", "Branding"],
    url: "https://northfocus.app/",
    label: "northfocus.app",
    shot: "/shots/north.png",
    role: "End-to-end product"
  },
  {
    title: "Shoebox Investments",
    kicker: "Private capital, presented with weight",
    desc:
      "A premium site for a private equity and asset-management firm — dark, grounded, and built to signal trust to high-net-worth partners across the US and Canada.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    url: "https://shoebox-six.vercel.app/",
    label: "shoebox-six.vercel.app",
    shot: "/shots/shoebox.png",
    role: "Design → Build → Deploy"
  },
  {
    title: "Wilco Civil",
    kicker: "Heavy civil, built to last",
    desc:
      "A bold, image-led site for a heavy-civil construction firm on Vancouver Island — earthworks, parks, and waterfront work framed to win bigger contracts.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    url: "https://wilco-rho.vercel.app/",
    label: "wilco-rho.vercel.app",
    shot: "/shots/wilco.png",
    role: "Design → Build → Deploy"
  }
];

const products = [
  {
    glyph: "↑",
    glow: "rgba(59, 130, 246, 0.22)",
    type: "Chrome + Firefox · Live",
    live: true,
    title: "North — Focus & Distraction Blocker",
    desc:
      "A distraction-blocking extension that reduces impulsive browsing through focus sessions, schedules, and behavioral friction. A priority-based rule engine enforces lockdowns, content filters, time limits, and temporary unlocks — even across SPAs like YouTube and Instagram that change without reloading. All data stays local; no backend, no accounts.",
    tags: ["JavaScript", "Manifest V3", "Rule Engine"],
    url: "https://chromewebstore.google.com/detail/bbfpkfifjmcebiobbmfhdgpnclegaedo",
    label: "Chrome Web Store"
  },
  {
    glyph: "¶",
    glow: "rgba(34, 197, 94, 0.2)",
    type: "Chrome Web Store · Live",
    live: true,
    title: "Word Count for Google Docs",
    desc:
      "A zero-config extension that injects a live word counter into Google Docs by watching the editor DOM with a MutationObserver. No accounts, no backend — it just works, every time the page loads.",
    tags: ["TypeScript", "Chrome APIs", "MutationObserver"],
    url: "https://chromewebstore.google.com/detail/okjgpepodicdbadoeolkipidpeocneoi",
    label: "Chrome Web Store"
  }
];

const systems = [
  {
    glyph: "◇",
    glow: "rgba(214, 64, 30, 0.18)",
    type: "TypeScript · Playwright · Gemini 2.5",
    live: false,
    status: "2026",
    title: "Agentic Browser Automation",
    desc:
      "An AI agent that reads live browser state through accessibility trees and executes multi-step workflows autonomously. The agent loop reserves LLM calls for decisions and uses deterministic actions for execution — cutting token usage ~33% while staying robust to interfaces that change without fragile selectors.",
    tags: ["TypeScript", "Playwright", "Gemini 2.5"],
    url: "",
    label: ""
  },
  {
    glyph: "◉",
    glow: "rgba(168, 85, 247, 0.18)",
    type: "React · Node.js · Whisper · Gemini",
    live: false,
    status: "In progress",
    title: "Voice Note Analyzer",
    desc:
      "A full-stack app that turns voice and text into structured insight — actions, mood, and themes. Audio runs through Whisper, semantic analysis through Gemini, with persistent storage for longitudinal tracking over time.",
    tags: ["React", "Node.js", "Whisper", "Gemini"],
    url: "",
    label: ""
  }
];

const skills = [
  { title: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "C", "SQL"] },
  { title: "Frontend", items: ["React", "Next.js", "React Native", "Tailwind", "Framer Motion"] },
  { title: "AI / LLM", items: ["Agentic pipelines", "LLM orchestration", "Prompt eng.", "Whisper", "Gemini"] },
  { title: "Backend & Cloud", items: ["Node.js", "PostgreSQL", "MongoDB", "AWS EC2", "Linux", "Playwright"] }
];

const contactLinks = [
  { label: "GitHub", href: "https://github.com/jaiten" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jaitenk" },
  { label: "Résumé", href: "/JaitenKang_Resume.docx", download: true }
];

const Arrow = () => (
  <svg className="arrow" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ----------------------------- page ----------------------------- */

export default function Page() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />

        {/* marquee */}
        <div className="wrap">
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {marquee.map((m, i) => (
                <span className="marquee-item" key={`a${i}`}>
                  {m}
                </span>
              ))}
            </div>
            <div className="marquee-track">
              {marquee.map((m, i) => (
                <span className="marquee-item" key={`b${i}`}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── WORK / WEBSITES ── */}
        <section className="section" id="work">
          <div className="wrap">
            <Reveal className="section-head">
              <div>
                <span className="section-index">01 — Selected Work</span>
                <h2>
                  Production <span className="serif">websites</span>
                </h2>
              </div>
              <p className="section-note">
                Client sites taken from brand and copy through design, build, and
                deploy. Every one is live.
              </p>
            </Reveal>

            <div className="projects">
              {websites.map((p, i) => (
                <Reveal
                  className={`project ${i % 2 === 1 ? "flip" : ""}`}
                  key={p.title}
                >
                  <div className="project-body">
                    <div className="project-head">
                      <span className="project-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="project-title">{p.title}</h3>
                    </div>
                    <p className="project-kicker">{p.kicker}</p>
                    <p className="project-desc">{p.desc}</p>
                    <div className="project-tags">
                      {p.tags.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <a
                      className="project-link"
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit live site <Arrow />
                    </a>
                  </div>

                  <div className="project-media">
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
                    <div className="project-caption">
                      <span>{p.role}</span>
                      <span>↗ {p.label}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS / EXTENSIONS ── */}
        <section className="section" id="products">
          <div className="wrap">
            <Reveal className="section-head">
              <div>
                <span className="section-index">02 — Shipped Products</span>
                <h2>
                  Browser <span className="serif">extensions</span>
                </h2>
              </div>
              <p className="section-note">
                Self-published tools on the Chrome Web Store and Firefox Add-ons —
                architecture, UX, branding, and publishing.
              </p>
            </Reveal>

            <div className="card-grid">
              {products.map((c) => (
                <Reveal className="scard" key={c.title} style={{ "--glow": c.glow }}>
                  <div className="scard-top">
                    <span className="scard-glyph" aria-hidden="true">
                      {c.glyph}
                    </span>
                    <span className="scard-badge">
                      <span className="status-dot" /> Live
                    </span>
                  </div>
                  <span className="scard-type">{c.type}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="scard-foot">
                    <div className="scard-tags">
                      {c.tags.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                    {c.url ? (
                      <a
                        className="scard-link"
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {c.label} <Arrow />
                      </a>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SYSTEMS / AI ── */}
        <section className="section" id="systems">
          <div className="wrap">
            <Reveal className="section-head">
              <div>
                <span className="section-index">03 — Engineering</span>
                <h2>
                  AI <span className="serif">systems</span>
                </h2>
              </div>
              <p className="section-note">
                Agentic pipelines that reserve LLM calls for judgment and lean on
                deterministic execution for everything else.
              </p>
            </Reveal>

            <div className="card-grid">
              {systems.map((c) => (
                <Reveal className="scard" key={c.title} style={{ "--glow": c.glow }}>
                  <div className="scard-top">
                    <span className="scard-glyph" aria-hidden="true">
                      {c.glyph}
                    </span>
                    <span className="scard-badge">{c.status}</span>
                  </div>
                  <span className="scard-type">{c.type}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="scard-foot">
                    <div className="scard-tags">
                      {c.tags.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="section" id="about">
          <div className="wrap">
            <Reveal className="section-head">
              <div>
                <span className="section-index">04 — Profile</span>
                <h2>
                  About <span className="serif">me</span>
                </h2>
              </div>
            </Reveal>

            <div className="about-grid">
              <Reveal>
                <p className="about-lead">
                  Software engineer, IT lead, and builder who turns ambiguous
                  problems into <span className="serif">deployed products</span>.
                </p>
                <div className="about-body">
                  <p>
                    At Gravity Computers I design, build, and ship production
                    websites for clients end-to-end, and pioneered LLM tooling
                    across the dev workflow — letting a one-person pipeline produce
                    agency-quality work at a fraction of the time.
                  </p>
                  <p>
                    Before that, and still, I own IT infrastructure across 300+
                    devices: a 20% drop in recurring issues from proactive
                    monitoring, and 15% faster device setup from a standardized,
                    repeatable workflow the whole team now uses.
                  </p>
                  <p>
                    Fluent in English and French, finishing a B.Sc. in Computer
                    Science at McGill. Happy to work anywhere.
                  </p>
                </div>
              </Reveal>

              <Reveal className="about-side" delay={120}>
                <div className="about-block">
                  <span className="eyebrow">Experience</span>
                  <div className="cv-row">
                    <div>
                      <strong>Software Engineer</strong>
                      <p>Gravity Computers · Vancouver</p>
                    </div>
                    <span className="cv-when">2025 — Now</span>
                  </div>
                  <div className="cv-row">
                    <div>
                      <strong>IT Lead</strong>
                      <p>Gravity Computers · Vancouver</p>
                    </div>
                    <span className="cv-when">2022 — Now</span>
                  </div>
                </div>
                <div className="about-block">
                  <span className="eyebrow">Education</span>
                  <div className="cv-row">
                    <div>
                      <strong>B.Sc. Computer Science</strong>
                      <p>McGill University · Montréal</p>
                    </div>
                    <span className="cv-when">2021 — 2026</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal className="skills">
              {skills.map((g) => (
                <div className="skill-col" key={g.title}>
                  <h4>{g.title}</h4>
                  <ul>
                    {g.items.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="contact" id="contact">
          <div className="wrap">
            <Reveal>
              <span className="eyebrow">05 — Contact</span>
              <h2 className="contact-head">
                Let’s build
                <br />
                <a className="contact-mail" href="mailto:jaitenkangis@gmail.com">
                  <span className="serif">something.</span>
                </a>
              </h2>
            </Reveal>
            <Reveal className="contact-row" delay={100}>
              <a className="contact-mail" href="mailto:jaitenkangis@gmail.com" style={{ fontSize: "1.25rem", fontWeight: 500 }}>
                jaitenkangis@gmail.com
              </a>
              <div className="contact-links">
                {contactLinks.map((l) => (
                  <a
                    className="contact-link"
                    key={l.label}
                    href={l.href}
                    download={l.download || undefined}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    {l.label} <Arrow />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="footer">
          <div className="wrap footer-inner">
            <span>© 2026 Jaiten Kang</span>
            <span>Built with Next.js · Designed & shipped end-to-end</span>
            <span>Vancouver / Montréal</span>
          </div>
        </footer>
      </main>
    </>
  );
}
