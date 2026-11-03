import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import Cursor from "@/components/cursor";
import CopyEmail from "@/components/copy-email";
import ProjectShot from "@/components/project-shot";
import SkillsGrid from "@/components/skills-grid";
import OrbitDemo from "@/components/orbit-demo";
import EunoDemo from "@/components/euno-demo";

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
  "SwiftUI",
  "Electron",
  "Supabase",
  "Gemini 2.5",
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
    url: "https://wilcocivil.ca/",
    label: "wilcocivil.ca",
    shot: "/shots/wilco.png",
    role: "Design → Build → Deploy"
  },
  {
    title: "Orbit",
    kicker: "A calm planner, sold calmly",
    desc:
      "The marketing home for Orbit, my planner for iPhone and Windows. Live device frames, a working quick-add demo that runs the app’s own parser, and motion that stays quiet enough to match the product.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Motion"],
    url: "https://orbit-web-inky.vercel.app/",
    label: "orbithabit.app",
    shot: "/shots/orbit.png",
    role: "End-to-end product"
  }
];

const features = {
  orbit: {
    logo: "/logos/orbit.svg",
    badge: "Beta",
    type: "iPhone + Windows · SwiftUI · Electron · Supabase",
    title: "Orbit: a calm daily planner",
    desc:
      "A local-first planner that turns one line of text into a task or a habit, keeps the day manageable, and syncs between an iPhone app and a Windows app. Works fully offline; sync adds a durable outbox, tombstones, revision checks, and conflict review on top.",
    points: [
      "One shared phrase parser and test suite drive quick add on both platforms",
      "Widgets, Live Activities, Siri and Shortcuts on iOS; tray, global shortcut and notifications on Windows",
      "Auto-updating Windows releases shipped from CI"
    ],
    tags: ["SwiftUI", "Electron", "Supabase", "Local-first"],
    links: [
      { label: "Visit orbithabit.app", href: "https://orbit-web-inky.vercel.app/" },
      { label: "Download for Windows", href: "https://github.com/jaiten/Orbit/releases/latest" }
    ]
  },
  euno: {
    logo: "/logos/euno.svg",
    badge: "In progress",
    type: "iOS · SwiftUI · On-device speech + NLP",
    title: "Euno: a private voice journal",
    desc:
      "An iPhone voice journal for finding what you talked about and noticing how you felt. Recordings are transcribed on the device in 45-second chunks, then searched, tagged with suggested topics, and measured for pace and quiet audio. No server, no accounts, no paid AI.",
    points: [
      "Persistent processing queue with restart recovery and per-note retries",
      "Voice Memos share extension and SHA-256 duplicate detection for large libraries",
      "Honest signals: mood is self-labelled, sentiment is lexical, nothing is diagnosed"
    ],
    tags: ["Swift", "Speech", "NaturalLanguage", "XCTest"],
    links: [{ label: "View on GitHub", href: "https://github.com/jaiten/euno" }]
  }
};

const products = [
  {
    logo: "/logos/north.svg",
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
    logo: "/logos/agent.svg",
    type: "Company build · TypeScript · Playwright · Gemini 2.5",
    live: false,
    status: "In production",
    title: "Agentic Browser Automation",
    desc:
      "Built for a company whose team was losing hours to repetitive work inside web portals. The agent navigates dynamic sites, fills forms, and carries multi-step workflows through to completion on the team’s behalf. A hybrid architecture reserves LLM calls for decisions while deterministic code handles execution, cutting token usage by ~33% and keeping runs predictable enough to trust in day-to-day operations.",
    tags: ["TypeScript", "Playwright", "Gemini 2.5"],
    url: null,
    label: "Client work · details on request"
  }
];

const skills = [
  { title: "Languages", items: ["TypeScript", "JavaScript", "Swift", "Python", "SQL", "Java"] },
  { title: "Frontend & Apps", items: ["React", "Next.js", "SwiftUI", "Electron", "Tailwind", "Framer Motion", "Chrome Extensions (MV3)"] },
  { title: "AI & Automation", items: ["Agentic pipelines", "LLM orchestration", "Gemini", "Playwright", "On-device speech", "Apple NaturalLanguage"] },
  { title: "Backend & Ops", items: ["Node.js", "Supabase", "PostgreSQL", "Offline-first sync", "GitHub Actions CI", "AWS EC2", "Linux"] }
];

const contactLinks = [
  { label: "GitHub", href: "https://github.com/jaiten" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jaitenk" },
  { label: "View résumé", href: "/resume" }
];

const proof = [
  { value: "6", label: "production sites shipped" },
  { value: "3", label: "apps & extensions shipped" },
  { value: "300+", label: "devices managed" },
  { value: "20%", label: "fewer recurring IT issues" }
];

const reasons = [
  {
    title: "I can talk to the customer",
    text: "I ask the questions, write the scope, and explain tradeoffs without hiding behind jargon."
  },
  {
    title: "I can build across the stack",
    text: "Interface, automation, backend, copy, deployment—I move to whichever layer gets the product over the line."
  },
  {
    title: "I operate what I ship",
    text: "Years in IT taught me to care about reliability, security, documentation, and the person using it on Monday."
  }
];

const Arrow = () => (
  <svg className="arrow" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Feature({ f, demo, label, stage = "" }) {
  return (
    <Reveal as="article" className="feature">
      <div className="feature-copy">
        <div className="scard-top">
          <span className="scard-glyph logo" aria-hidden="true">
            <img src={f.logo} alt="" width="54" height="54" />
          </span>
          <span className="scard-badge">{f.badge}</span>
        </div>
        <span className="scard-type">{f.type}</span>
        <h3>{f.title}</h3>
        <p>{f.desc}</p>
        <ul className="feature-points">
          {f.points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
        <div className="scard-tags">
          {f.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div className="feature-links">
          {f.links.map((l) => (
            <a className="scard-link" key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label} <Arrow />
            </a>
          ))}
        </div>
      </div>
      <div className={`feature-demo is-dark ${stage}`.trim()}>
        <span className="feature-demo-label">
          <span className="status-dot" /> {label}
        </span>
        {demo}
      </div>
    </Reveal>
  );
}

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

        <section className="value-section" aria-labelledby="why-hire-me">
          <div className="wrap">
            <Reveal className="value-intro">
              <span className="eyebrow">Why hire me</span>
              <h2 id="why-hire-me">
                I’m useful when the work doesn’t fit neatly in a ticket.
              </h2>
              <p>
                One person can carry the context from the customer conversation
                through the build, the launch, and the next iteration.
              </p>
            </Reveal>
            <div className="value-grid">
              {reasons.map((reason, index) => (
                <Reveal className="value-item" key={reason.title} delay={index * 80}>
                  <span>0{index + 1}</span>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

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
                Six client sites taken from an ambiguous brief through brand,
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
                  Apps &amp; <span className="serif">extensions</span>
                </h2>
              </div>
              <p className="section-note">
                Self-published tools with real users and real constraints—from
                sync engines and rule engines to UX, branding, and distribution.
              </p>
            </Reveal>

            <Feature f={features.orbit} demo={<OrbitDemo />} label="Live demo · try smart add" />

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
                Agents that reserve LLM calls for judgment, and on-device models
                that keep personal data where it belongs.
              </p>
            </Reveal>

            <Feature f={features.euno} demo={<EunoDemo />} label="Live demo · search the notes" stage="is-euno" />

            <div className="card-grid is-single">
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
                  {...linkProps}
                >
                  <div className="scard-top">
                    <span className="scard-glyph logo" aria-hidden="true">
                      <img src={c.logo} alt="" width="54" height="54" />
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
                  I learned software from both sides: building it, and being the
                  person people call when <span className="serif">it breaks</span>.
                </p>
                <div className="about-body">
                  <p>
                    I started at Gravity Computers in IT, supporting real people
                    and real businesses across more than 300 devices. That work
                    taught me where software fails: unclear handoffs, fragile
                    workflows, and tools designed without the user in the room.
                  </p>
                  <p>
                    I moved into software engineering and began shipping the
                    fixes myself—client websites, internal workflows, browser
                    extensions, and AI automation. I still think like an operator:
                    make it understandable, make it reliable, and make sure it
                    helps on Monday morning.
                  </p>
                  <p>
                    I graduated from McGill with a B.Sc. in Computer Science. I’m
                    looking for a small, ambitious team that wants an engineer who
                    can handle the customer conversation as well as the code.
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
                Need someone who can meet the customer, find the real problem,
                and come back with working software?{" "}
                <span className="serif">That’s the job I want.</span>
              </p>
              <h2 className="contact-head">
                Give me the problem.
                <br />
                <span className="serif accent">I’ll create the solution.</span>
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
