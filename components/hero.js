const lines = [
  [{ t: "I talk to users," }],
  [{ t: "build the solution," }],
  [{ t: "and", serif: true }, { t: "ship it.", serif: true, accent: true }]
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

        <h1 className="hero-title" aria-label="I talk to users, build the solution, and ship it.">
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
          <p className="hero-lede">
            I’m a McGill CS grad and software engineer at Gravity Computers. I’ve
            launched client sites, published browser extensions, built AI
            automation, and managed IT across 300+ devices. Now I’m looking for a{" "}
            <span className="serif">forward-deployed or applied AI role</span> where
            I can own a problem from the first conversation to production.
            <span className="hero-actions">
              <a className="hero-action primary" href="#work">Explore selected work</a>
              <a className="hero-action" href="/JaitenKang_Resume.pdf" download>Download résumé</a>
            </span>
          </p>

          <dl className="hero-facts">
            <div className="hero-fact">
              <dt>Current</dt>
              <dd>Software Engineer · Gravity Computers</dd>
            </div>
            <div className="hero-fact">
              <dt>Shipped</dt>
              <dd>5 client sites · 2 browser extensions</dd>
            </div>
            <div className="hero-fact">
              <dt>Education</dt>
              <dd>B.Sc. Computer Science, McGill ’26</dd>
            </div>
            <div className="hero-fact">
              <dt>Seeking</dt>
              <dd>Forward-deployed · Applied AI · Product</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
