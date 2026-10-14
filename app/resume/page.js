const Arrow = () => (
  <svg className="arrow" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const metadata = {
  title: "Résumé | Jaiten Kang",
  description: "Jaiten Kang's résumé: software engineer focused on applied AI, product engineering, and forward-deployed work."
};

export default function ResumePage() {
  return (
    <main className="resume-page">
      <div className="wrap">
        <header className="section-head">
          <div>
            <span className="section-index">Jaiten Kang · Résumé</span>
            <h1>
              The full <span className="serif">story</span>
            </h1>
          </div>
          <a className="project-link" href="/">
            Back to portfolio <Arrow />
          </a>
        </header>

        <section className="resume-viewer" aria-label="Jaiten Kang résumé">
          <div className="resume-bar">
            <span>Jaiten Kang · Résumé</span>
            <a href="/JaitenKang_Resume.pdf" download>
              Download PDF <Arrow />
            </a>
          </div>
          <iframe src="/JaitenKang_Resume.pdf#view=FitH" title="Jaiten Kang résumé">
            <a href="/JaitenKang_Resume.pdf">Open Jaiten Kang’s résumé</a>
          </iframe>
        </section>
      </div>
    </main>
  );
}
