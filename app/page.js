import ResumeScrollStack from "@/components/resume-scroll-stack";
import SocialLinks from "@/components/social-links";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Focus", href: "#focus" },
  { label: "Skills", href: "#skills" }
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/jaiten" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jaitenk" },
  { label: "Email", href: "mailto:jaitenkangis@gmail.com" }
];

const timelineItems = [
  {
    kind: "Experience",
    title: "Orca Medical",
    role: "Co-Founder / Lead Frontend Developer",
    period: "May-Dec 2025",
    location: "Montreal, Canada",
    summary:
      "Co-founded a health-tech startup and built the frontend for a mobile self-triage app focused on non-emergency care.",
    bullets: [
      "Built the app in React Native and Expo, including multi-step symptom intake and triage flows.",
      "Integrated a 3D body model with Blender and Three.js to make symptom selection easier.",
      "Handled product direction, Figma prototyping, and frontend architecture as the product took shape."
    ],
    projectLink: {
      label: "View Project",
      href: "",
      enabled: false
    },
    tags: ["React Native", "Expo", "Three.js", "Figma"]
  },
  {
    kind: "Experience",
    title: "Gravity Computers",
    role: "Desktop Support Technician / Team Lead",
    period: "Summer 2020-2025",
    location: "Vancouver, Canada",
    summary:
      "Provided day-to-day IT support across business environments while taking on deployments, escalations, and team coordination.",
    bullets: [
      "Supported more than 250 devices across hardware, software, and network issues.",
      "Set up operating systems, SaaS accounts, and workstation rollouts, cutting setup time by 15%.",
      "Led teammates and improved support processes, reducing recurring issues by 20%."
    ],
    projectLink: {
      label: "View Project",
      href: "",
      enabled: false
    },
    tags: ["Windows", "Microsoft 365", "Google Workspace", "IT Ops"]
  },
  {
    kind: "Project",
    title: "Gravity Computers Website",
    role: "Website Design / Development",
    period: "Sep-Nov 2025",
    location: "Client Work",
    summary: "Built the company website for an IT and cybersecurity business.",
    bullets: [
      "Built the site with Next.js App Router, TypeScript, and Tailwind CSS.",
      "Implemented a secure contact flow with serverless routes, validation, and Google reCAPTCHA.",
      "Focused on responsive layout, performance, and interaction details."
    ],
    projectLink: {
      label: "View Project",
      href: "https://www.gravitycomputers.com/",
      enabled: true
    },
    tags: ["Next.js", "TypeScript", "Tailwind", "reCAPTCHA"]
  },
  {
    kind: "Project",
    title: "ADVSB",
    role: "Full-Stack Web Application",
    period: "Sep-Dec 2024",
    location: "Academic Project",
    summary:
      "Built a full-stack platform for course planning, schedule building, and degree progress tracking.",
    bullets: [
      "Implemented authentication, scheduling, and student management features with JavaScript, PHP, and SQL.",
      "Added charts and PDF exports with Chart.js and jsPDF.",
      "Designed the interface around complex scheduling flows so it stayed usable."
    ],
    projectLink: {
      label: "View Project",
      href: "",
      enabled: false
    },
    tags: ["JavaScript", "PHP", "SQL", "Chart.js"]
  },
  {
    kind: "Project",
    title: "RxRemind",
    role: "Prescription Reminder Web App",
    period: "Jan-Feb 2023",
    location: "Healthcare Web App",
    summary:
      "Built a web app for managing prescriptions and sending SMS medication reminders.",
    bullets: [
      "Built the React frontend for doctor and patient workflows.",
      "Used Node.js and MongoDB for backend logic and data storage.",
      "Integrated Twilio for automated reminder delivery and status tracking."
    ],
    projectLink: {
      label: "View Project",
      href: "",
      enabled: false
    },
    tags: ["React", "Node.js", "MongoDB", "Twilio"]
  }
];

const focusAreas = [
  {
    title: "Networking and concurrency",
    description:
      "Build a Linux-first HTTP server in C or C++ with epoll, keep-alive handling, routing, and a thread pool.",
    outcome:
      "I want this to sharpen my systems programming and performance fundamentals."
  },
  {
    title: "Storage and persistence",
    description:
      "Build a Redis-style key-value store with TCP command parsing, in-memory storage, TTL expiration, and append-only persistence.",
    outcome:
      "I want this to push me further on protocol design, data structures, and persistence."
  },
  {
    title: "Memory internals",
    description:
      "Write a custom allocator with free lists, coalescing, and fragmentation benchmarks.",
    outcome:
      "I want this to give me a better understanding of memory behavior at a lower level."
  }
];

const skillGroups = [
  {
    title: "Languages",
    items: ["Python", "Java", "C", "C++", "JavaScript", "TypeScript"]
  },
  {
    title: "Frontend + Product",
    items: ["React", "Next.js", "React Native", "Expo", "Three.js", "Figma"]
  },
  {
    title: "Backend + Ops",
    items: ["Node.js", "SQL", "PostgreSQL", "MongoDB", "AWS EC2", "Linux", "SSH"]
  }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-noise" />

      <header className="topbar">
        <a className="brand" href="#top">
          Jaiten Kang
        </a>
        <nav className="topnav" aria-label="Primary">
          {navLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <SocialLinks className="header-socials" links={socialLinks} />
      </header>

      <section className="hero" id="top">
        <div className="hero-backdrop" aria-hidden="true">
          <div className="hero-backdrop-orb orb-one" />
          <div className="hero-backdrop-orb orb-two" />
          <div className="hero-backdrop-grid" />
        </div>
        <div className="hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Software Engineer / Portfolio</span>
            <h1>
              I build clean software and care about{" "}
              <em>how it works underneath</em>.
            </h1>
            <p className="hero-text">
              I&apos;m a McGill computer science student with experience in
              startup product work, frontend engineering, and technical
              support. I like clean interfaces, straightforward code, and
              getting deeper into backend, systems, and performance work.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#experience">
                View Experience
              </a>
              <a className="button button-secondary" href="#focus">
                Current Focus
              </a>
            </div>
          </div>

          <aside className="hero-aside">
            <div className="hero-aside-card">
              <div className="section-label">At a Glance</div>
              <ul className="intro-points">
                <li>McGill University, B.Sc. Computer Science</li>
                <li>Startup, client, and support experience</li>
                <li>Interested in backend, systems, and performance</li>
              </ul>
              <p>
                This site is a selection of the work I&apos;ve done so far. Most
                of it has been frontend-heavy, but I&apos;m deliberately spending
                more time on lower-level and systems-oriented projects.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <ResumeScrollStack items={timelineItems} />

      <section className="section build-section" id="focus">
        <div className="section-heading">
          <div className="section-label">Current Focus</div>
          <h2>What I&apos;m focusing on next.</h2>
        </div>
        <div className="build-grid">
          {focusAreas.map((project, index) => (
            <article className="build-card" key={project.title}>
              <span className="project-index">0{index + 1}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <strong>{project.outcome}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section info-section" id="skills">
        <div className="info-grid">
          <article className="info-card education-card">
            <div className="section-label">Education</div>
            <h2>McGill University</h2>
            <p>
              B.Sc. in Computer Science, 2021-2026. Relevant coursework
              includes algorithm design, concurrent programming, software
              design, databases, machine learning, and data structures.
            </p>
          </article>

          <article className="info-card">
            <div className="section-label">Skills</div>
            <div className="skills-grid">
              {skillGroups.map((group) => (
                <div className="skill-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <div className="tag-row">
                    {group.items.map((item) => (
                      <span className="tag" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>jaitenkangis@gmail.com</p>
          <SocialLinks className="footer-socials" links={socialLinks} />
        </div>
      </footer>
    </main>
  );
}
