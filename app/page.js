import ResumeScrollStack from "@/components/resume-scroll-stack";
import HeroScrollIndicator from "@/components/hero-scroll-indicator";
import SocialLinks from "@/components/social-links";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Build Next", href: "#build-next" },
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
    role: "Co-Founder + Lead Frontend Developer",
    period: "May to Dec 2025",
    location: "Montreal, Canada",
    summary:
      "Co-founded a health-tech startup and led the mobile product experience for a self-triage app aimed at improving access to non-emergency care.",
    bullets: [
      "Built the app in React Native and Expo with multi-step symptom intake and triage workflows.",
      "Integrated a 3D anatomical body model using Blender and Three.js to make symptom selection more intuitive.",
      "Drove product direction through Figma prototypes, feature scoping, and frontend architecture decisions."
    ],
    tags: ["React Native", "Expo", "Three.js", "Figma"]
  },
  {
    kind: "Experience",
    title: "Gravity Computers",
    role: "Desktop Support Technician / Team Lead",
    period: "Summers 2020 to 2025",
    location: "Vancouver, Canada",
    summary:
      "Delivered support across business environments while taking ownership of troubleshooting, deployments, and operational improvements.",
    bullets: [
      "Supported more than 250 devices across hardware, software, and network issues.",
      "Configured operating systems, SaaS tooling, and workstation rollouts while cutting setup time by 15 percent.",
      "Led teammates and process improvements that reduced recurring technical issues by 20 percent."
    ],
    tags: ["Windows", "Microsoft 365", "Google Workspace", "IT Ops"]
  },
  {
    kind: "Project",
    title: "Gravity Computers Website",
    role: "Marketing Site / Production Build",
    period: "Sept to Nov 2025",
    location: "Client Work",
    summary:
      "Built a polished business website for an IT and cybersecurity company with a stronger focus on credibility, performance, and conversion.",
    bullets: [
      "Used Next.js App Router, TypeScript, and Tailwind CSS for a fast and accessible frontend.",
      "Implemented a secure contact flow with serverless routes, validation, and Google reCAPTCHA.",
      "Focused on responsive UI and motion details to make the brand feel more premium."
    ],
    tags: ["Next.js", "TypeScript", "Tailwind", "reCAPTCHA"]
  },
  {
    kind: "Project",
    title: "ADVSB",
    role: "Advanced Schedule Builder",
    period: "Sept to Dec 2024",
    location: "Academic Project",
    summary:
      "Created a full-stack student platform for course planning, schedule building, progress tracking, and lightweight social features.",
    bullets: [
      "Built authentication, course scheduling, and student management workflows with JavaScript, PHP, and SQL.",
      "Added analytics and exports using Chart.js and jsPDF to help students compare and save plans.",
      "Designed a responsive interface that kept complex scheduling flows usable."
    ],
    tags: ["JavaScript", "PHP", "SQL", "Chart.js"]
  },
  {
    kind: "Project",
    title: "RxRemind",
    role: "Prescription Reminder Platform",
    period: "Jan to Feb 2023",
    location: "Healthcare Web App",
    summary:
      "Built a doctor-facing web application for managing prescriptions and automating SMS medication reminders.",
    bullets: [
      "Created a React frontend for patient and prescription workflows.",
      "Used Node.js and MongoDB for backend processing and persistence.",
      "Integrated Twilio to trigger reminder delivery and support status tracking."
    ],
    tags: ["React", "Node.js", "MongoDB", "Twilio"]
  }
];

const nextBuilds = [
  {
    title: "Concurrent HTTP Server",
    description:
      "Build a Linux-first HTTP server in C or C++ with epoll, keep-alive connections, routing, and a thread pool.",
    outcome: "Strong signal for networking, concurrency, and performance engineering."
  },
  {
    title: "Redis-Style Key-Value Store",
    description:
      "Implement TCP command handling, in-memory storage, TTL expiration, and append-only persistence.",
    outcome: "Shows systems design, data structures, and storage fundamentals."
  },
  {
    title: "Custom Memory Allocator",
    description:
      "Write a malloc/free replacement with free lists, coalescing, and fragmentation benchmarks.",
    outcome: "High-value low-level project that stands out on systems-oriented resumes."
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
              Clean product work with a serious interest in <em>systems depth</em>.
            </h1>
            <p className="hero-text">
              I&apos;m a McGill computer science student with experience across
              startup product work, production frontend engineering, and
              technical operations. I care about clean interfaces, strong
              implementation, and pushing further into low-level systems and
              performance.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#experience">
                View Experience
              </a>
              <a className="button button-secondary" href="#build-next">
                Future Systems Projects
              </a>
            </div>
            <HeroScrollIndicator />
          </div>

          <aside className="hero-aside">
            <div className="hero-aside-card">
              <div className="section-label">Introduction</div>
              <ul className="intro-points">
                <li>McGill University, B.Sc. Computer Science</li>
                <li>Product-focused frontend engineering</li>
                <li>Growing into systems and low-level work</li>
              </ul>
              <p>
                I&apos;m targeting real full-time software roles and building this
                site to support that. I&apos;m still open to exceptional internships,
                but this is meant to read as a professional portfolio rather than
                an internship landing page.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <ResumeScrollStack items={timelineItems} />

      <section className="section build-section" id="build-next">
        <div className="section-heading">
          <div className="section-label">Build Next</div>
          <h2>Projects that would strengthen the systems side of my resume.</h2>
        </div>
        <div className="build-grid">
          {nextBuilds.map((project, index) => (
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
              Bachelor of Science in Computer Science, 2021 to 2026. Coursework
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
