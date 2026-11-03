"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/* Orca: tap where it hurts on a 3D body, answer the intake questions a doctor
   would ask, and get likely causes plus a summary written for the clinician.
   This demo scores a small hand-written table so it runs in the page; it is an
   illustration of the flow, not medical advice. */

const OrcaBody = dynamic(() => import("./orca-body"), {
  ssr: false,
  loading: () => <div className="orca-canvas orca-loading">Loading 3D model…</div>
});

const REGIONS = ["head", "neck", "chest", "upper back", "abdomen", "lower back", "shoulder", "arm", "hip", "leg", "knee"];

const QUESTIONS = [
  { key: "onset", label: "How did it start?", options: ["sudden", "gradual"] },
  { key: "quality", label: "What does it feel like?", options: ["sharp", "dull ache", "burning", "pressure", "throbbing"] },
  { key: "worse", label: "What makes it worse?", options: ["movement", "eating", "breathing", "lying down", "nothing"] },
  { key: "duration", label: "How long has it lasted?", options: ["hours", "days", "weeks"] },
  { key: "spreads", label: "Does it spread anywhere?", options: ["no", "yes"] }
];

// weights: "key:value" -> points; sev: points per severity step above 5
const C = (name, note, w, sev = 0) => ({ name, note, w, sev });
const CONDITIONS = {
  head: [
    C("Tension headache", "Band-like pressure, often with stress or screen time", { "quality:pressure": 3, "quality:dull ache": 2, "onset:gradual": 2, "duration:days": 1 }, -0.3),
    C("Migraine", "Throbbing, often one-sided, can come with light sensitivity", { "quality:throbbing": 4, "duration:hours": 2, "worse:movement": 1 }, 0.4),
    C("Sinusitis", "Pressure around the eyes and forehead, worse bending over", { "quality:pressure": 2, "duration:days": 2, "worse:lying down": 2 })
  ],
  neck: [
    C("Muscle strain", "Stiffness after sleep, posture or exercise", { "worse:movement": 3, "quality:dull ache": 2, "onset:sudden": 1 }),
    C("Tension and posture", "Builds through the day, eases with rest", { "onset:gradual": 2, "quality:dull ache": 2, "duration:weeks": 2 }),
    C("Pinched nerve", "Pain that travels into the shoulder or arm", { "spreads:yes": 4, "quality:sharp": 1, "quality:burning": 2 })
  ],
  chest: [
    C("Chest wall strain", "Tender to touch, worse with movement", { "worse:movement": 3, "quality:sharp": 2 }),
    C("Acid reflux", "Burning behind the breastbone after meals", { "quality:burning": 4, "worse:eating": 3, "worse:lying down": 2 }),
    C("Costochondritis", "Sharp pain where ribs meet the breastbone", { "quality:sharp": 2, "worse:breathing": 3, "duration:days": 1 })
  ],
  "upper back": [
    C("Muscle strain", "Usually after lifting or a long day at a desk", { "worse:movement": 3, "onset:sudden": 1, "quality:dull ache": 1 }),
    C("Postural strain", "Aches that build over weeks of sitting", { "onset:gradual": 2, "duration:weeks": 3, "quality:dull ache": 2 }),
    C("Nerve irritation", "Pain that wraps around or travels", { "spreads:yes": 4, "quality:burning": 2 })
  ],
  abdomen: [
    C("Indigestion or gastritis", "Burning or fullness linked to meals", { "quality:burning": 3, "worse:eating": 4 }),
    C("Gastroenteritis", "Cramping that comes on fast, often with nausea", { "onset:sudden": 2, "duration:hours": 2, "duration:days": 1, "quality:dull ache": 1, "quality:sharp": 1, "worse:eating": 1 }),
    C("Constipation", "Dull, crampy discomfort that builds slowly", { "onset:gradual": 2, "quality:dull ache": 2, "duration:days": 1 }),
    C("Appendicitis", "Sharp pain that worsens, often lower right", { "quality:sharp": 2, "worse:movement": 2, "duration:days": 1 }, 0.7)
  ],
  "lower back": [
    C("Muscle strain", "After lifting or twisting; eases with gentle movement", { "worse:movement": 3, "onset:sudden": 2, "quality:dull ache": 1 }),
    C("Disc irritation", "Sharp or burning pain that travels down a leg", { "spreads:yes": 4, "quality:sharp": 1, "quality:burning": 2 }),
    C("Kidney stone", "Severe waves of pain in the flank, nothing helps", { "onset:sudden": 2, "quality:sharp": 2, "worse:nothing": 3 }, 0.6)
  ],
  shoulder: [
    C("Rotator cuff strain", "Pain lifting the arm or reaching overhead", { "worse:movement": 4, "quality:sharp": 1 }),
    C("Bursitis", "Dull ache, worse lying on that side", { "quality:dull ache": 2, "worse:lying down": 3, "onset:gradual": 1 }),
    C("Frozen shoulder", "Stiffness that slowly limits movement", { "duration:weeks": 3, "onset:gradual": 2 })
  ],
  arm: [
    C("Muscle strain", "After exercise or carrying something heavy", { "worse:movement": 3, "onset:sudden": 1 }),
    C("Tendinitis", "Overuse pain near the elbow or wrist", { "onset:gradual": 2, "worse:movement": 2, "duration:weeks": 1 }),
    C("Nerve compression", "Burning, tingling or pain that travels", { "quality:burning": 3, "spreads:yes": 3 })
  ],
  hip: [
    C("Hip bursitis", "Ache on the outside of the hip, worse lying on it", { "worse:lying down": 3, "quality:dull ache": 2 }),
    C("Muscle strain", "After running, twisting or a new workout", { "worse:movement": 3, "onset:sudden": 2 }),
    C("Osteoarthritis", "Stiff and achy, slowly worse over months", { "duration:weeks": 3, "onset:gradual": 2, "quality:dull ache": 1 })
  ],
  leg: [
    C("Muscle strain or cramp", "Tight, sore muscle after activity", { "worse:movement": 2, "onset:sudden": 2, "duration:hours": 1 }),
    C("Shin splints", "Ache along the shin from running or impact", { "worse:movement": 3, "onset:gradual": 2 }),
    C("Sciatica", "Pain running from the buttock down the leg", { "spreads:yes": 4, "quality:burning": 1, "quality:sharp": 1 })
  ],
  knee: [
    C("Sprain", "Twisted or knocked; swelling and pain moving it", { "onset:sudden": 3, "worse:movement": 2, "quality:sharp": 1 }),
    C("Patellar tendinitis", "Pain below the kneecap with stairs or jumping", { "onset:gradual": 2, "worse:movement": 3 }),
    C("Osteoarthritis", "Stiff and achy, worse in the morning", { "duration:weeks": 3, "quality:dull ache": 2, "onset:gradual": 1 })
  ]
};

const redFlag = (region, a) => {
  if (region === "chest" && (a.quality === "pressure" || a.spreads === "yes"))
    return "Chest pressure or pain that spreads can be an emergency. Call emergency services.";
  if (region === "head" && a.onset === "sudden" && a.severity >= 8)
    return "A sudden, severe headache needs urgent care today.";
  if (region === "abdomen" && a.quality === "sharp" && a.severity >= 7)
    return "Severe, sharp abdominal pain should be seen today.";
  if (a.severity >= 9) return "Pain this severe should be assessed by a clinician today.";
  return null;
};

const score = (region, a) => {
  const list = (CONDITIONS[region] || []).map((c) => {
    let s = 1;
    Object.entries(a).forEach(([k, v]) => (s += c.w[`${k}:${v}`] || 0));
    s += (a.severity - 5) * c.sev;
    return { ...c, s: Math.max(0.5, s) };
  });
  list.sort((x, y) => y.s - x.s);
  const top = list[0]?.s || 1;
  return list.slice(0, 3).map((c, i) => ({ ...c, pct: c.s / top, label: i === 0 ? "Most likely" : c.s / top > 0.7 ? "Possible" : "Less likely" }));
};

const START = { onset: null, quality: null, worse: null, duration: null, spreads: null, severity: 5 };

export default function OrcaDemo() {
  const [region, setRegion] = useState(null);
  const [answers, setAnswers] = useState(START);
  const [step, setStep] = useState("pick");
  const [near, setNear] = useState(false);
  const root = useRef(null);

  // Load the 3D model only when the demo is close to the screen.
  useEffect(() => {
    const el = root.current;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (r) => {
    setRegion(r);
    setAnswers(START);
    setStep("ask");
  };
  const set = (k, v) => setAnswers((a) => ({ ...a, [k]: v }));
  const answered = QUESTIONS.every((q) => answers[q.key]);
  const results = step === "result" ? score(region, answers) : [];
  const flag = step === "result" ? redFlag(region, answers) : null;

  return (
    <div className="orca" ref={root} aria-label="Interactive Orca triage demo">
      <div className="orca-stage">
        {near ? <OrcaBody selected={region} onPick={pick} /> : <div className="orca-canvas orca-loading" />}
        <span className="orca-hint">{region ? `Selected: ${region.charAt(0).toUpperCase() + region.slice(1)}` : "Drag to turn · tap where it hurts"}</span>
      </div>

      <div className="orca-panel">
        <div className="orca-steps" aria-hidden="true">
          {["Where", "Describe", "Results"].map((s, i) => (
            <span key={s} className={["pick", "ask", "result"].indexOf(step) >= i ? "is-on" : ""}>
              {s}
            </span>
          ))}
        </div>

        {step === "pick" ? (
          <div className="orca-body">
            <strong className="orca-title">Where does it hurt?</strong>
            <p className="orca-sub">Tap the model, or choose an area.</p>
            <div className="orca-chips">
              {REGIONS.map((r) => (
                <button type="button" key={r} onClick={() => pick(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === "ask" ? (
          <div className="orca-body">
            <strong className="orca-title">
              Pain in the <em>{region}</em>
            </strong>
            {QUESTIONS.map((q) => (
              <div className="orca-q" key={q.key}>
                <span>{q.label}</span>
                <div className="orca-chips">
                  {q.options.map((o) => (
                    <button type="button" key={o} className={answers[q.key] === o ? "is-on" : ""} onClick={() => set(q.key, o)} aria-pressed={answers[q.key] === o}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="orca-q">
              <span>
                How bad is it? <b>{answers.severity}/10</b>
              </span>
              <input type="range" min="1" max="10" value={answers.severity} onChange={(e) => set("severity", Number(e.target.value))} aria-label="Severity" />
            </div>
          </div>
        ) : null}

        {step === "result" ? (
          <div className="orca-body">
            {flag ? <div className="orca-flag">{flag}</div> : null}
            <strong className="orca-title">Likely causes</strong>
            <ul className="orca-results">
              {results.map((r) => (
                <li key={r.name}>
                  <div>
                    <b>{r.name}</b>
                    <span>{r.label}</span>
                  </div>
                  <span className="orca-bar">
                    <span style={{ width: `${Math.round(r.pct * 100)}%` }} />
                  </span>
                  <p>{r.note}</p>
                </li>
              ))}
            </ul>
            <div className="orca-note">
              <span>For the clinician</span>
              <p>
                Patient reports {answers.quality} pain in the {region}, {answers.onset} onset, present for {answers.duration}. Severity {answers.severity}/10, worse with{" "}
                {answers.worse === "nothing" ? "nothing in particular" : answers.worse}, {answers.spreads === "yes" ? "radiating" : "not radiating"}.
              </p>
            </div>
          </div>
        ) : null}

        <div className="orca-foot">
          {step === "ask" ? (
            <>
              <button type="button" className="orca-ghost" onClick={() => setStep("pick")}>
                Back
              </button>
              <button type="button" className="orca-go" disabled={!answered} onClick={() => setStep("result")}>
                {answered ? "See results" : `${QUESTIONS.filter((q) => answers[q.key]).length}/${QUESTIONS.length} answered`}
              </button>
            </>
          ) : step === "result" ? (
            <>
              <button type="button" className="orca-ghost" onClick={() => setStep("ask")}>
                Edit answers
              </button>
              <button type="button" className="orca-go" onClick={() => { setRegion(null); setStep("pick"); }}>
                Start over
              </button>
            </>
          ) : (
            <span className="orca-disclaimer">Demo only, not medical advice.</span>
          )}
        </div>
      </div>
    </div>
  );
}
