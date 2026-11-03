"use client";

import { useEffect, useRef, useState } from "react";

/* A working slice of RxRemind: schedule a prescription and watch the reminder
   arrive as a text. The message uses the app's own template (buildMessage in
   back/app2.js); the clock runs fast so a reminder lands within seconds. */

const buildMessage = (name, med, dose) => `Hello ${name}, it's time to take ${dose} of ${med}`;

const START = [
  { id: 1, med: "Amoxicillin", dose: "500 mg", time: 8 * 60 },
  { id: 2, med: "Vitamin D", dose: "1 capsule", time: 8 * 60 + 30 }
];

const fmt = (m) => {
  const h = Math.floor(m / 60) % 24;
  const mm = String(m % 60).padStart(2, "0");
  return `${((h + 11) % 12) + 1}:${mm} ${h < 12 ? "AM" : "PM"}`;
};

const toMinutes = (v) => {
  const [h, m] = v.split(":").map(Number);
  return h * 60 + m;
};

const MINUTE_MS = 160;
const START_CLOCK = 7 * 60 + 52;

export default function RxDemo() {
  const [clock, setClock] = useState(START_CLOCK);
  const [running, setRunning] = useState(false);
  const [rx, setRx] = useState(START);
  const [sent, setSent] = useState([]);
  const [name, setName] = useState("Jaiten");
  const [med, setMed] = useState("Ibuprofen");
  const [dose, setDose] = useState("200 mg");
  const [time, setTime] = useState("08:45");
  const root = useRef(null);
  const thread = useRef(null);
  const nextId = useRef(10);
  const fired = useRef(new Set());

  // Only run the clock while the demo is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setInterval(() => setClock((c) => (c + 1) % (24 * 60)), reduced ? MINUTE_MS * 3 : MINUTE_MS);
    return () => clearInterval(t);
  }, [running]);

  // Fire any reminder whose time has come; a new day starts the schedule over.
  useEffect(() => {
    if (clock === 0) fired.current.clear();
    rx.forEach((r) => {
      const key = `${r.id}@${r.time}`;
      if (r.time === clock && !fired.current.has(key)) {
        fired.current.add(key);
        setSent((s) => [...s.slice(-5), { id: `${key}-${clock}`, text: buildMessage(name || "there", r.med, r.dose), at: clock }]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock]);

  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [sent]);

  const add = (e) => {
    e.preventDefault();
    if (!med.trim() || !dose.trim() || !time) return;
    const id = nextId.current++;
    setRx((list) => [...list.slice(-3), { id, med: med.trim(), dose: dose.trim(), time: toMinutes(time) }].sort((a, b) => a.time - b.time));
    // Put the clock a couple of minutes before the new dose so it arrives soon.
    const target = toMinutes(time);
    setClock((c) => ((target - c + 1440) % 1440 > 4 ? (target - 3 + 1440) % 1440 : c));
  };

  const remove = (id) => setRx((list) => list.filter((r) => r.id !== id));

  const next = [...rx].sort((a, b) => ((a.time - clock + 1440) % 1440) - ((b.time - clock + 1440) % 1440))[0];

  return (
    <div className="rxdemo" ref={root} aria-label="Interactive RxRemind demo">
      <div className="rx-panel">
        <div className="rx-head">
          <span className="rx-logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="15" height="15">
              <g transform="rotate(-45 12 12)">
                <rect x="3" y="8" width="18" height="8" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v8" stroke="currentColor" strokeWidth="2" />
              </g>
            </svg>
          </span>
          <strong>RxRemind</strong>
          <span className="rx-clock" aria-live="off">
            <i className={running ? "is-on" : ""} /> {fmt(clock)}
          </span>
        </div>

        <form className="rx-form" onSubmit={add}>
          <label>
            <span>Patient</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} />
          </label>
          <label>
            <span>Medication</span>
            <input value={med} onChange={(e) => setMed(e.target.value)} maxLength={24} />
          </label>
          <label>
            <span>Dose</span>
            <input value={dose} onChange={(e) => setDose(e.target.value)} maxLength={16} />
          </label>
          <label>
            <span>Time</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <button type="submit">Schedule reminder</button>
        </form>

        <div className="rx-label">Today’s schedule</div>
        <ul className="rx-list">
          {rx.map((r) => {
            const due = r.time <= clock;
            return (
              <li key={r.id} className={`${due ? "is-sent" : ""} ${next && next.id === r.id && !due ? "is-next" : ""}`}>
                <span className="rx-time">{fmt(r.time)}</span>
                <span className="rx-med">
                  {r.med} <em>{r.dose}</em>
                </span>
                <span className="rx-state">{due ? "Sent" : next && next.id === r.id ? "Next" : "Queued"}</span>
                <button type="button" onClick={() => remove(r.id)} aria-label={`Remove ${r.med}`}>
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rx-phone" aria-label="Text messages">
        <div className="rx-screen">
          <div className="rx-contact">
            <span className="rx-avatar" aria-hidden="true">Rx</span>
            <strong>RxRemind</strong>
            <span>Text message</span>
          </div>
          <div className="rx-thread" ref={thread} aria-live="polite">
            {!sent.length ? <p className="rx-empty">Reminders arrive here at dose time.</p> : null}
            {sent.map((m) => (
              <div className="rx-bubble" key={m.id}>
                {m.text}
                <span>{fmt(m.at)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
