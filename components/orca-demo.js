"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

/* Orca's flow: tap one of the model's 75 regions, answer the app's guided
   survey (its own options and prompts), and read the results the way the app
   shows them: a likelihood ring, "Our best guess", other possibilities, and
   anything at 10% or less grouped as "Unsure / Something Else".
   The app sends the answers to an LLM backend; this demo scores a small
   hand-written table instead, so it runs in the page. Not medical advice. */

const OrcaBody = dynamic(() => import("./orca-body"), {
  ssr: false,
  loading: () => <div className="orca-canvas orca-loading">Loading 3D model…</div>
});

// Shortcuts to a representative region of the model.
const QUICK = {
  Head: "Skull (Frontal)",
  Face: "Face (Sinuses)",
  Neck: "Neck (Posterior)",
  Shoulder: "Right Shoulder",
  Chest: "Left Chest",
  Abdomen: "Abdomen (RLQ)",
  "Lower back": "Back (Lower)",
  Wrist: "Right Wrist",
  Hip: "Right Hip",
  Knee: "Right Anterior Knee",
  Calf: "Left Calf",
  Ankle: "Right Lateral Ankle"
};

// The app's own answer options (app/survey.tsx).
const SWELLING = ["Swelling", "Discoloration", "Bruising", "None of those"];
const PAIN = ["Radiating", "Aching/Dull", "Throbbing", "Crushing", "Burning", "Stinging", "Sharp/Shooting", "Tingling", "Stiff / Tight", "None of those"];
const ONSET = ["I got injured", "All of a sudden / Overnight", "It's gotten worse over time", "None of the above"];
const CONSTANT = ["Yes, it's constant", "It comes up intermittently", "It worsens with certain actions", "None of those"];
const SEV_COLORS = ["#22c55e", "#65a30d", "#84cc16", "#eab308", "#f59e0b", "#f97316", "#ea580c", "#dc2626", "#b91c1c", "#991b1b"];

const STEPS = [
  { key: "swelling", head: "Sorry to hear!\nLet's find out why...", q: "Do you notice any of these?", options: SWELLING, multi: true },
  { key: "pain", head: "Interesting,\nlet's try these questions...", q: "How would you describe the pain?", options: PAIN, multi: true },
  { key: "severity", head: "Tell us a little\nmore about this...", q: "How bad is it, from 1 to 10?" },
  { key: "onset", head: "Almost there,\njust a few more things...", q: "How did it start?", options: ONSET, multi: true },
  { key: "constant", head: "Just one\nmore step...", q: "Is it constant?", options: CONSTANT }
];

// Region groups by model region name.
const groupOf = (r) => {
  if (/^Skull|Forehead/.test(r)) return "head";
  if (/^Face/.test(r)) return "face";
  if (/^Neck/.test(r)) return "neck";
  if (/Shoulder|Axilla/.test(r)) return "shoulder";
  if (/Chest/.test(r)) return "chest";
  if (/Back \((Upper|Middle)\)/.test(r)) return "upper back";
  if (/Back \(Lower\)|Buttocks/.test(r)) return "lower back";
  if (/^Abdomen/.test(r)) return "abdomen";
  if (/Elbow|Arm|Forearm/.test(r)) return "arm";
  if (/Wrist|Hand|Thumb|Fingers/.test(r)) return "hand";
  if (/Hip|Groin/.test(r)) return "hip";
  if (/Thigh/.test(r)) return "thigh";
  if (/Knee/.test(r)) return "knee";
  if (/Calf|Shin/.test(r)) return "lower leg";
  return "foot";
};

// [name, description, weights, severity weight, only-for-region pattern]
const T = (name, desc, w, sev = 0, only = null) => ({ name, desc, w, sev, only });
const TABLE = {
  head: [
    T("Tension headache", "A band of pressure around the head, often linked to stress, posture or screens.", { "pain:Aching/Dull": 3, "pain:Stiff / Tight": 2, "onset:It's gotten worse over time": 2, "constant:Yes, it's constant": 1 }, -0.2),
    T("Migraine", "Throbbing pain, often on one side, sometimes with nausea or light sensitivity.", { "pain:Throbbing": 4, "onset:All of a sudden / Overnight": 1, "constant:It comes up intermittently": 2 }, 0.4),
    T("Head contusion", "A bruise from a knock to the head; watch for confusion or vomiting.", { "onset:I got injured": 5, "swelling:Swelling": 2, "swelling:Bruising": 2 })
  ],
  face: [
    T("Sinusitis", "Pressure behind the cheeks, nose and eyes, often after a cold.", { "pain:Aching/Dull": 2, "pain:Throbbing": 1, "onset:It's gotten worse over time": 2, "constant:Yes, it's constant": 2 }),
    T("TMJ dysfunction", "Jaw joint pain, worse chewing or yawning, sometimes with clicking.", { "constant:It worsens with certain actions": 3, "pain:Aching/Dull": 1, "pain:Stiff / Tight": 2 }),
    T("Dental infection", "Throbbing pain near a tooth, sometimes with facial swelling.", { "pain:Throbbing": 3, "swelling:Swelling": 2 }, 0.3)
  ],
  neck: [
    T("Neck muscle strain", "Stiffness after sleeping awkwardly, posture or exercise.", { "pain:Stiff / Tight": 3, "pain:Aching/Dull": 2, "constant:It worsens with certain actions": 2 }),
    T("Cervical radiculopathy", "A pinched nerve; pain or tingling that travels into the arm.", { "pain:Radiating": 4, "pain:Tingling": 3, "pain:Sharp/Shooting": 1 }),
    T("Swollen lymph nodes", "Tender lumps, usually from an infection nearby.", { "swelling:Swelling": 4, "onset:All of a sudden / Overnight": 1 })
  ],
  shoulder: [
    T("Rotator cuff tendinopathy", "Pain lifting or reaching overhead, often worse at night.", { "constant:It worsens with certain actions": 4, "pain:Aching/Dull": 2, "onset:It's gotten worse over time": 2 }),
    T("Shoulder sprain", "Overstretched ligaments after a fall or sudden pull.", { "onset:I got injured": 4, "swelling:Swelling": 1, "swelling:Bruising": 2, "pain:Sharp/Shooting": 1 }),
    T("Subacromial bursitis", "Inflamed cushioning in the shoulder; dull ache with movement.", { "pain:Aching/Dull": 2, "swelling:Swelling": 1, "constant:It comes up intermittently": 1 })
  ],
  chest: [
    T("Costochondritis", "Inflamed cartilage where the ribs meet the breastbone; tender to press.", { "pain:Sharp/Shooting": 3, "constant:It worsens with certain actions": 2 }),
    T("Chest wall strain", "A pulled muscle between or over the ribs.", { "onset:I got injured": 2, "constant:It worsens with certain actions": 3, "pain:Aching/Dull": 1 }),
    T("Acid reflux", "Burning behind the breastbone, often after meals or lying down.", { "pain:Burning": 5, "constant:It comes up intermittently": 2 })
  ],
  "upper back": [
    T("Thoracic muscle strain", "Aching between the shoulder blades from lifting or long desk days.", { "pain:Aching/Dull": 3, "pain:Stiff / Tight": 2, "constant:It worsens with certain actions": 2 }),
    T("Rib contusion", "A bruised rib after a fall or knock; hurts to breathe deeply.", { "onset:I got injured": 5, "swelling:Bruising": 2, "pain:Sharp/Shooting": 1 }),
    T("Thoracic nerve irritation", "Burning or shooting pain that wraps around the chest.", { "pain:Burning": 3, "pain:Radiating": 3 })
  ],
  abdomen: [
    T("Gastroenteritis", "Stomach bug: cramping that comes on fast, often with nausea.", { "onset:All of a sudden / Overnight": 3, "pain:Aching/Dull": 1, "constant:It comes up intermittently": 2 }),
    T("Indigestion", "Burning or fullness in the upper belly, linked to meals.", { "pain:Burning": 4, "constant:It comes up intermittently": 1 }, 0, /UQ/),
    T("Constipation", "Dull, crampy discomfort that builds over days.", { "pain:Aching/Dull": 2, "onset:It's gotten worse over time": 2 }, -0.2, /LQ/),
    T("Appendicitis", "Pain near the navel that moves to the lower right and keeps getting worse.", { "pain:Sharp/Shooting": 3, "onset:It's gotten worse over time": 1, "constant:Yes, it's constant": 2 }, 0.7, /RLQ/),
    T("Biliary colic", "Gallbladder pain under the right ribs, often after fatty meals.", { "pain:Sharp/Shooting": 1, "pain:Crushing": 2, "constant:It comes up intermittently": 2 }, 0.4, /RUQ/),
    T("Diverticulitis", "Lower left belly pain, sometimes with fever.", { "pain:Aching/Dull": 1, "constant:Yes, it's constant": 2, "onset:It's gotten worse over time": 1 }, 0.4, /LLQ/)
  ],
  "lower back": [
    T("Lumbar muscle strain", "After lifting or twisting; eases with gentle movement.", { "onset:I got injured": 2, "pain:Stiff / Tight": 2, "pain:Aching/Dull": 2, "constant:It worsens with certain actions": 2 }),
    T("Sciatica", "A pinched nerve; pain, burning or tingling that runs down the leg.", { "pain:Radiating": 4, "pain:Tingling": 2, "pain:Sharp/Shooting": 2 }),
    T("Kidney stone", "Severe waves of flank pain that nothing seems to ease.", { "onset:All of a sudden / Overnight": 3, "pain:Sharp/Shooting": 2, "constant:It comes up intermittently": 1 }, 0.6)
  ],
  arm: [
    T("Muscle strain", "After lifting, throwing or a new workout.", { "onset:I got injured": 2, "constant:It worsens with certain actions": 3 }),
    T("Lateral epicondylitis", "Tennis elbow: outer elbow pain when gripping or lifting.", { "onset:It's gotten worse over time": 3, "constant:It worsens with certain actions": 2 }, 0, /Elbow|Forearm/),
    T("Contusion", "A bruise from a knock; tender and discoloured.", { "onset:I got injured": 3, "swelling:Bruising": 3, "swelling:Discoloration": 1 })
  ],
  hand: [
    T("Carpal tunnel syndrome", "Tingling or numbness in the thumb and fingers, worse at night.", { "pain:Tingling": 5, "pain:Burning": 1, "onset:It's gotten worse over time": 2 }),
    T("Wrist sprain", "Overstretched ligaments, usually from a fall onto the hand.", { "onset:I got injured": 4, "swelling:Swelling": 2, "swelling:Bruising": 1 }),
    T("De Quervain's tenosynovitis", "Pain at the thumb side of the wrist when gripping.", { "constant:It worsens with certain actions": 3, "onset:It's gotten worse over time": 1 })
  ],
  hip: [
    T("Hip flexor strain", "Pain at the front of the hip after running or kicking.", { "onset:I got injured": 2, "constant:It worsens with certain actions": 3 }),
    T("Trochanteric bursitis", "Ache on the outside of the hip, worse lying on that side.", { "pain:Aching/Dull": 3, "onset:It's gotten worse over time": 2 }),
    T("Inguinal hernia", "A bulge in the groin that aches when lifting or coughing.", { "swelling:Swelling": 4, "constant:It worsens with certain actions": 2 }, 0, /Groin/)
  ],
  thigh: [
    T("Hamstring or quad strain", "A pulled muscle; sudden pain during a sprint or kick.", { "onset:I got injured": 3, "pain:Sharp/Shooting": 2, "constant:It worsens with certain actions": 1 }),
    T("Thigh contusion", "A dead leg: deep bruise from a direct knock.", { "onset:I got injured": 3, "swelling:Bruising": 3, "swelling:Swelling": 1 }),
    T("Meralgia paresthetica", "Burning or tingling on the outer thigh from a compressed nerve.", { "pain:Burning": 3, "pain:Tingling": 3 })
  ],
  knee: [
    T("Ligament sprain", "Twisted or knocked knee with swelling and pain moving it.", { "onset:I got injured": 4, "swelling:Swelling": 2, "swelling:Bruising": 1 }),
    T("Meniscus tear", "Twisting injury; swelling, catching or locking of the knee.", { "onset:I got injured": 3, "swelling:Swelling": 2, "constant:It worsens with certain actions": 2 }),
    T("Patellofemoral pain", "Ache around the kneecap with stairs, squats or sitting long.", { "pain:Aching/Dull": 2, "onset:It's gotten worse over time": 2, "constant:It worsens with certain actions": 2 }),
    T("Osteoarthritis", "Stiff, achy knee that builds over months, worse in the morning.", { "pain:Stiff / Tight": 3, "onset:It's gotten worse over time": 3 })
  ],
  "lower leg": [
    T("Shin splints", "Ache along the shin from running or impact.", { "onset:It's gotten worse over time": 2, "constant:It worsens with certain actions": 3 }, 0, /Shin/),
    T("Calf strain", "A sudden pull or pop in the calf while pushing off.", { "onset:I got injured": 3, "pain:Sharp/Shooting": 2 }, 0, /Calf/),
    T("Deep vein thrombosis", "A clot in a leg vein: a swollen, warm, aching calf. Needs prompt care.", { "swelling:Swelling": 3, "swelling:Discoloration": 2, "constant:Yes, it's constant": 2, "pain:Aching/Dull": 1 }, 0, /Calf/),
    T("Contusion", "A bruise from a knock; tender and discoloured.", { "onset:I got injured": 3, "swelling:Bruising": 3 })
  ],
  foot: [
    T("Ankle sprain", "Rolled ankle with swelling and bruising on the outside.", { "onset:I got injured": 4, "swelling:Swelling": 2, "swelling:Bruising": 2 }, 0, /Ankle/),
    T("Plantar fasciitis", "Heel pain, worst with the first steps in the morning.", { "pain:Stiff / Tight": 2, "pain:Sharp/Shooting": 2, "onset:It's gotten worse over time": 2 }, 0, /Heel|Plantar/),
    T("Achilles tendinopathy", "Pain and stiffness at the back of the heel.", { "pain:Stiff / Tight": 3, "constant:It worsens with certain actions": 2 }, 0, /Posterior|Heel/),
    T("Gout", "Sudden, very painful, red and swollen joint, often the big toe.", { "onset:All of a sudden / Overnight": 3, "swelling:Swelling": 2, "swelling:Discoloration": 2 }, 0.5, /Toes|Medial Foot/),
    T("Foot sprain or bruise", "Injury to the foot's ligaments or soft tissue.", { "onset:I got injured": 3, "swelling:Bruising": 1 })
  ]
};

const redFlag = (region, group, a) => {
  if (group === "chest" && (a.pain.includes("Crushing") || a.pain.includes("Radiating")))
    return "Crushing or spreading chest pain can be a heart attack. Call emergency services now.";
  if (group === "lower leg" && /Calf/.test(region) && a.swelling.includes("Swelling"))
    return "A swollen, painful calf can mean a blood clot. Get it checked today.";
  if (/RLQ/.test(region) && a.severity >= 7) return "Severe lower-right belly pain should be seen today.";
  if (group === "head" && a.onset.includes("All of a sudden / Overnight") && a.severity >= 8)
    return "A sudden, severe headache needs urgent care.";
  if (a.severity >= 9) return "Pain this severe should be assessed by a clinician today.";
  return null;
};

function diagnose(region, a) {
  const group = groupOf(region);
  const pool = (TABLE[group] || []).filter((c) => !c.only || c.only.test(region));
  const scored = pool.map((c) => {
    let s = 1;
    const add = (k, v) => (s += c.w[`${k}:${v}`] || 0);
    a.swelling.forEach((v) => add("swelling", v));
    a.pain.forEach((v) => add("pain", v));
    a.onset.forEach((v) => add("onset", v));
    add("constant", a.constant);
    s += (a.severity - 5) * c.sev;
    return { ...c, s: Math.max(0.3, s) };
  });
  const unsure = 2.2;
  const total = scored.reduce((t, c) => t + c.s * c.s, 0) + unsure * unsure;
  const list = scored
    .map((c) => ({ name: c.name, desc: c.desc, likelihood: Math.round(((c.s * c.s) / total) * 100) }))
    .sort((x, y) => y.likelihood - x.likelihood);
  const shown = list.filter((c) => c.likelihood > 10);
  const rest = 100 - shown.reduce((t, c) => t + c.likelihood, 0);
  return { group, shown, rest, best: shown[0] || list[0] };
}

const RING = ["#4CAF50", "#8BC34A", "#FFC107", "#FFC107"];

function Ring({ shown, rest }) {
  const segs = [...shown.map((c, i) => ({ v: c.likelihood, color: RING[i] || "#FFC107" })), ...(rest > 0 ? [{ v: rest, color: "#F44336" }] : [])];
  const R = 38;
  const C = 2 * Math.PI * R;
  let off = 0;
  return (
    <svg viewBox="0 0 100 100" width="104" height="104" className="orca-ring" aria-hidden="true">
      <circle cx="50" cy="50" r={R} fill="none" stroke="#e8eef3" strokeWidth="11" />
      {segs.map((s, i) => {
        const len = (s.v / 100) * C;
        const el = (
          <circle key={i} cx="50" cy="50" r={R} fill="none" stroke={s.color} strokeWidth="11" strokeDasharray={`${Math.max(len - 1.5, 0)} ${C}`} strokeDashoffset={-off} transform="rotate(-90 50 50)" style={{ animationDelay: `${i * 0.08}s` }} />
        );
        off += len;
        return el;
      })}
      <text x="50" y="47" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0f1e2c">
        {shown[0] ? `${shown[0].likelihood}%` : "?"}
      </text>
      <text x="50" y="61" textAnchor="middle" fontSize="7.5" fill="#5d6d7c">
        best guess
      </text>
    </svg>
  );
}

const START = { swelling: [], pain: [], severity: 0, onset: [], constant: "" };

export default function OrcaDemo() {
  const [region, setRegion] = useState(null);
  const [a, setA] = useState(START);
  const [step, setStep] = useState(0); // 0 pick, 1..5 survey, 6 results
  const [near, setNear] = useState(false);
  const root = useRef(null);
  const body = useRef(null);

  useEffect(() => {
    const el = root.current;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [step]);

  const pick = (r) => {
    setRegion(r);
    setA(START);
    setStep(0);
  };
  const toggle = (key, v) =>
    setA((s) => {
      const none = /none|not applicable/i.test(v);
      const cur = s[key];
      const next = none ? [v] : cur.includes(v) ? cur.filter((x) => x !== v) : [...cur.filter((x) => !/none|not applicable/i.test(x)), v];
      return { ...s, [key]: next };
    });

  const cur = STEPS[step - 1];
  const answered = cur ? (cur.key === "severity" ? a.severity > 0 : cur.multi ? a[cur.key].length > 0 : !!a[cur.key]) : !!region;
  const result = useMemo(() => (step === 6 ? diagnose(region, a) : null), [step, region, a]);
  const flag = step === 6 ? redFlag(region, groupOf(region), a) : null;
  const side = region && /^(Left|Right)/.exec(region)?.[1];

  return (
    <div className="orca" ref={root} aria-label="Interactive Orca triage demo">
      <div className="orca-stage">
        {near ? <OrcaBody selected={region} onPick={pick} /> : <div className="orca-canvas orca-loading" />}
        <span className="orca-hint">{region ? `Selected: ${region}` : "Drag to turn · tap where it hurts"}</span>
      </div>

      <div className="orca-panel">
        <div className="orca-progress" aria-hidden="true">
          <span style={{ width: `${(Math.min(step, 6) / 6) * 100}%` }} />
        </div>

        <div className="orca-body" ref={body} key={step}>
          {step === 0 ? (
            <>
              <strong className="orca-title">{region ? "Is this where it hurts?" : "Where does it hurt?"}</strong>
              <p className="orca-sub">
                {region ? (
                  <>
                    <b>{region.replace(/^(Left|Right) /, "")}</b>
                    {side ? ` · ${side.toLowerCase()} side` : ""}. Tap again to change it.
                  </>
                ) : (
                  "Tap any of the model's 75 regions, or start from one of these."
                )}
              </p>
              <div className="orca-chips">
                {Object.entries(QUICK).map(([label, r]) => (
                  <button type="button" key={label} className={region === r ? "is-on" : ""} onClick={() => pick(r)}>
                    {label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {cur ? (
            <>
              <p className="orca-lead">{cur.head}</p>
              <strong className="orca-title">{cur.q}</strong>
              {cur.key === "severity" ? (
                <div className="orca-sev">
                  {SEV_COLORS.map((c, i) => (
                    <button type="button" key={i} style={{ "--c": c }} className={a.severity === i + 1 ? "is-on" : ""} onClick={() => setA((s) => ({ ...s, severity: i + 1 }))} aria-pressed={a.severity === i + 1}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`orca-grid${cur.options.length > 5 ? " is-two" : ""}`}>
                  {cur.options.map((o) => {
                    const on = cur.multi ? a[cur.key].includes(o) : a[cur.key] === o;
                    return (
                      <button type="button" key={o} className={on ? "is-on" : ""} aria-pressed={on} onClick={() => (cur.multi ? toggle(cur.key, o) : setA((s) => ({ ...s, [cur.key]: o })))}>
                        {o}
                      </button>
                    );
                  })}
                </div>
              )}
              {cur.multi ? <p className="orca-tip">Choose all that fit.</p> : null}
            </>
          ) : null}

          {result ? (
            <>
              {flag ? <div className="orca-flag">{flag}</div> : null}
              <div className="orca-best">
                <Ring shown={result.shown} rest={result.rest} />
                <div>
                  <span>Our best guess</span>
                  <strong>{result.best?.name}</strong>
                  <p>{result.best?.desc}</p>
                </div>
              </div>
              <div className="orca-label">Other possibilities</div>
              <ul className="orca-results">
                {result.shown.slice(1).map((r, i) => (
                  <li key={r.name}>
                    <i style={{ background: RING[i + 1] }} />
                    <div>
                      <b>{r.name}</b>
                      <p>{r.desc}</p>
                    </div>
                    <span>{r.likelihood}%</span>
                  </li>
                ))}
                {result.rest > 0 ? (
                  <li>
                    <i style={{ background: "#F44336" }} />
                    <div>
                      <b>Unsure / Something Else</b>
                    </div>
                    <span>{result.rest}%</span>
                  </li>
                ) : null}
              </ul>
              <div className="orca-note">
                <span>For the clinician</span>
                <p>
                  {region}: {a.pain.filter((p) => !/none/i.test(p)).join(", ").toLowerCase() || "unspecified"} pain, {a.severity}/10.{" "}
                  {a.onset.join(", ")}. {a.constant}.{" "}
                  {a.swelling.some((s) => !/none/i.test(s)) ? `Visible: ${a.swelling.join(", ").toLowerCase()}.` : "No visible swelling or bruising."}
                </p>
              </div>
            </>
          ) : null}
        </div>

        <div className="orca-foot">
          {step === 0 ? (
            <>
              <span className="orca-disclaimer">Demo only, not medical advice.</span>
              <button type="button" className="orca-go" disabled={!region} onClick={() => setStep(1)}>
                Continue
              </button>
            </>
          ) : step < 6 ? (
            <>
              <button type="button" className="orca-ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
              <span className="orca-count">
                {step} of 5
              </span>
              <button type="button" className="orca-go" disabled={!answered} onClick={() => setStep((s) => s + 1)}>
                {step === 5 ? "See results" : "Continue"}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="orca-ghost" onClick={() => setStep(1)}>
                Edit answers
              </button>
              <button type="button" className="orca-go" onClick={() => pick(null)}>
                New diagnosis
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
