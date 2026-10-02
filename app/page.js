import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import Cursor from "@/components/cursor";
import CopyEmail from "@/components/copy-email";
import ProjectShot from "@/components/project-shot";
import SkillsGrid from "@/components/skills-grid";

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
      "Rebuilt the company’s marketing site end-to-end, owning brand, copy, design, build, and deploy. Faster load times and a clearer conversion flow lifted client inquiries.",
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
      "A refined, type-forward site for a team of writers, editors, and designers who help companies win work. Built to feel as considered as the service it sells.",
    tags: ["Next.js", "TypeScript", "Editorial", "Motion"],
    url: "https://winratio.vercel.app/",
    label: "winratio.ca",
    shot: "/shots/winratio.png",
    role: "Design → Build"
  },
  {
    title: "North",
    kicker: "A product site with a point of view",
    desc:
      "The marketing home for my focus extension. A calm, dark-green editorial identity, a clear point of view, and a live preview of the pause screen that sells the idea before the install.",
    tags: ["Next.js", "Product", "Motion", "Branding"],
    url: "https://northfocus.app/",
    label: "northfocus.app",
    shot: "/shots/north.png",
    role: "End-to-end product"
  },
  {
    title: "Shoebox Investments",
    kicker: "Patient capital, presented with weight",
    desc:
      "A premium site for a Vancouver investment firm that acquires MSPs, backs real estate development, and offers private lending. Forest green and gold, serif-led, and built to earn the trust of sellers and partners.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    url: "https://shoebox-six.vercel.app/",
    label: "shoeboxinvestments.com",
    shot: "/shots/shoebox.png",
    role: "Design → Build → Deploy"
  },
  {
    title: "Wilco Civil",
    kicker: "Heavy civil, built to last",
    desc:
      "A bold, image-led site for a heavy-civil construction firm on Vancouver Island. Earthworks, parks, and waterfront work, framed to win bigger contracts.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    url: "https://wilco-rho.vercel.app/",
    label: "wilcocivil.ca",
    shot: "/shots/wilco.png",
    role: "Design → Build → Deploy"
  }
];

const products = [
  {
    logo: "/logos/north.svg",
    glow: "rgba(49, 87, 68, 0.24)",
    type: "Chrome + Firefox · Live",
    title: "North: Focus & Distraction Blocker",
    desc:
      "A distraction-blocking extension that reduces impulsive browsing through focus sessions, schedules, and behavioral friction. A priority-based rule engine enforces lockdowns, content filters, time limits, and temporary unlocks, even across SPAs like YouTube and Instagram that change without reloading. All data stays local, with no backend and no accounts.",
    tags: ["JavaScript", "Manifest V3", "Rule Engine"],
    url: "https://chromewebstore.google.com/detail/bbfpkfifjmcebiobbmfhdgpnclegaedo",
    label: "See on Chrome Web Store"
  },
  {
    logo: "/logos/wordcount.svg",
    glow: "rgba(66, 133, 244, 0.2)",
    type: "Chrome Web Store · Live",
    title: "Word Count for Google Docs",
    desc:
      "A zero-config extension that injects a live word counter into Google Docs by watching the editor DOM with a MutationObserver. No accounts, no backend. It just works, every time the page loads.",
    tags: ["TypeScript", "Chrome APIs", "MutationObserver"],
    url: "https://chromewebstore.google.com/detail/okjgpepodicdbadoeolkipidpeocneoi",
    label: "See on Chrome Web Store"
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
      "An autonomous browser agent that completes real-world workflows across dynamic websites, including navigation, form completion, and multi-step task execution. A hybrid architecture reserves LLM calls for decision-making while deterministic systems handle execution, cutting token usage by ~33%.",
    tags: ["TypeScript", "Playwright", "Gemini 2.5"],
    url: null,
    label: "Private build · details on request"
  },
  {
    glyph: "◉",
    glow: "rgba(168, 85, 247, 0.18)",
    type: "React · Node.js · Whisper · Gemini",
    live: false,
    status: "In progress",
    title: "Voice Note Analyzer",
    desc:
      "A full-stack app that turns voice and text into structured insight: actions, mood, and themes. Audio runs through Whisper, semantic analysis through Gemini, with persistent storage for longitudinal tracking over time.",
    tags: ["React", "Node.js", "Whisper", "Gemini"],
    url: "https://github.com/jaiten/voicemood",
    label: "View on GitHub"
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
  { label: "Résumé", href: "/JaitenKang_Resume.pdf", download: true }
];

const proof = [
  { value: "5", label: "production sites shipped" },
  { value: "2", label: "browser extensions live" },
  { value: "300+", label: "devices managed" },
  { value: "20%", label: "fewer recurring IT issues" }
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
      <Cursor />
      <Nav />
      <main>
        <Hero />

        <div className="wrap">
          <Reveal className="proof-strip" aria-label="Selected outcomes">
            {proof.map((item) => (
              <div className="proof-item" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </Reveal>
        </div>

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
                <span className="section-index">01 · Client Deployments</span>
                <h2>
                  From brief to <span className="serif">production</span>
                </h2>
              </div>
              <p className="section-note">
                Five client sites taken from an ambiguous brief through brand,
                copy, design, build, and deployment.
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

                  <ProjectShot p={p} />
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
                <span className="section-index">02 · Product Engineering</span>
                <h2>
                  Browser <span className="serif">extensions</span>
                </h2>
              </div>
              <p className="section-note">
                Self-published tools with real users and real constraints—from
                rule-engine architecture to UX, branding, and distribution.
              </p>
            </Reveal>

            <div className="card-grid">
              {products.map((c) => (
                <Reveal
                  as="a"
                  className="scard product"
                  key={c.title}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${c.title}, see on Chrome Web Store`}
                  style={{ "--glow": c.glow }}
                >
                  <div className="scard-top">
                    <span className="scard-glyph logo" aria-hidden="true">
                      <img src={c.logo} alt="" width="54" height="54" />
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
                    <span className="scard-link">
                      {c.label} <Arrow />
                    </span>
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
                <span className="section-index">03 · Engineering</span>
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
              {systems.map((c) => {
                const linkProps = c.url
                  ? {
                      as: "a",
                      href: c.url,
                      target: "_blank",
                      rel: "noreferrer",
                      "aria-label": `${c.title}, view on GitHub`
                    }
                  : { as: "article" };

                return (
                <Reveal
                  className={`scard ${c.url ? "" : "is-static"}`.trim()}
                  key={c.title}
                  style={{ "--glow": c.glow }}
                  {...linkProps}
                >
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
                    <span className="scard-link">
                      {c.label} {c.url ? <Arrow /> : null}
                    </span>
                  </div>
                </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="section" id="about">
          <div className="wrap">
            <Reveal className="section-head">
              <div>
                <span className="section-index">04 · Profile</span>
                <h2>
                  About <span className="serif">me</span>
                </h2>
              </div>
            </Reveal>

            <div className="about-grid">
              <Reveal>
                <p className="about-lead">
                  I like the part before the requirements are obvious—and the
                  part after the demo has to <span className="serif">survive reality</span>.
                </p>
                <div className="about-body">
                  <p>
                    At Gravity Computers I sit close to customers, translate
                    loosely defined needs into software, and own the path from
                    first conversation to production. I also introduced LLM
                    tooling across the development workflow so a one-person
                    pipeline could move with the range of a larger team.
                  </p>
                  <p>
                    Before that, and still, I lead IT at Gravity Computers,
                    managing infrastructure across 300+ devices: a 20% drop in
                    recurring issues from proactive monitoring, and 15% faster
                    device setup from a standardized, repeatable workflow the
                    whole team now uses.
                  </p>
                  <p>
                    I graduated from McGill with a B.Sc. in Computer Science.
                    I’m looking for a team where engineering includes discovery,
                    deployment, and earning user trust—not just closing tickets.
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
                    <span className="cv-when">2025 – Now</span>
                  </div>
                  <div className="cv-row">
                    <div>
                      <strong>IT Lead</strong>
                      <p>Gravity Computers · Vancouver</p>
                    </div>
                    <span className="cv-when">2022 – Now</span>
                  </div>
                </div>
                <div className="about-block">
                  <span className="eyebrow">Education</span>
                  <div className="cv-row">
                    <div>
                      <strong>B.Sc. Computer Science</strong>
                      <p>McGill University · Montréal</p>
                    </div>
                    <span className="cv-when">2021 – 2026</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <SkillsGrid skills={skills} />
            </Reveal>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="contact" id="contact">
          <div className="wrap">
            <Reveal>
              <span className="eyebrow">05 · Contact</span>
              <p className="contact-note">
                Looking for forward-deployed, applied AI, and product engineering
                roles where I can stay close to the user and{" "}
                <span className="serif">own the outcome</span>.
              </p>
              <h2 className="contact-head">
                Let’s build
                <br />
                <span className="serif accent">something useful.</span>
              </h2>
            </Reveal>
            <Reveal className="contact-row" delay={100}>
              <CopyEmail email="jaitenkangis@gmail.com" />
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
