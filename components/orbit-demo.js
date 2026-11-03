"use client";

import { useEffect, useRef, useState } from "react";
import { parse, chipParts, dayKey } from "@/lib/quick-add";

/* A small, working slice of Orbit in its dark theme: Today, habits and the
   writing bar. Quick add runs the same phrase parser as the real apps. While
   the demo is on screen it types a few phrases itself, until the visitor
   takes over. */

const SCRIPT = ["gym tomorrow 6pm", "stretch every day", "call mum today 5pm"];
const EXAMPLES = ["dentist fri 9am #health", "book ideas someday", "water plants weekends"];

const START_TASKS = [
  { id: 1, title: "Send the invoice", time: 600, list: "work", done: true },
  { id: 2, title: "Groceries for the week", time: null, list: null, done: false },
  { id: 3, title: "Review onboarding copy", time: 900, list: "work", done: false }
];

const START_HABITS = [
  { id: 1, title: "Read 20 pages", days: [1, 1, 0, 1, 1, 1, 0], color: "#6E8C78" },
  { id: 2, title: "Walk outside", days: [0, 1, 1, 0, 1, 0, 0], color: "#8C85BF" }
];

const HABIT_COLORS = ["#D19E4D", "#53AAA4", "#729ED2", "#E87359"];

const clock = (m) =>
  new Date(2000, 0, 1, Math.floor(m / 60), m % 60).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const Tick = ({ done }) => (
  <span className={`odemo-tick${done ? " is-on" : ""}`} aria-hidden="true">
    <svg viewBox="0 0 16 16" width="11" height="11">
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export default function OrbitDemo() {
  const [tasks, setTasks] = useState(START_TASKS);
  const [habits, setHabits] = useState(START_HABITS);
  const [text, setText] = useState("");
  const [toast, setToast] = useState(null);
  const [today, setToday] = useState(null);
  const [pressing, setPressing] = useState(false);
  const [touched, setTouched] = useState(false);
  const nextId = useRef(10);
  const toastTimer = useRef(null);
  const root = useRef(null);
  const ran = useRef(false);
  const body = useRef(null);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    if (lastAdded === null) return;
    const el = body.current;
    const row = el && el.querySelector(`[data-id="${lastAdded}"]`);
    if (!row) return;
    const top = row.offsetTop - el.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < el.scrollTop || bottom > el.scrollTop + el.clientHeight) {
      el.scrollTo({ top: Math.max(0, bottom - el.clientHeight + 12), behavior: "smooth" });
    }
  }, [lastAdded]);
  const touchedRef = useRef(false);

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }));
    return () => clearTimeout(toastTimer.current);
  }, []);

  const result = text.trim() ? parse(text) : null;
  const chip = result ? chipParts(result) : [];

  const flash = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const add = (value) => {
    const r = value.trim() ? parse(value) : null;
    if (!r || !r.title) return;
    const parts = chipParts(r);
    r.title = r.title.charAt(0).toUpperCase() + r.title.slice(1);
    const id = nextId.current++;
    if (r.kind === "habit") {
      setHabits((h) => [
        ...h.slice(-7),
        { id, title: r.title, days: [0, 0, 0, 0, 0, 0, 0], color: HABIT_COLORS[id % HABIT_COLORS.length], fresh: true }
      ]);
      flash(`New habit · ${parts.slice(1).join(" · ")}`);
      setLastAdded(id);
    } else if (r.date === dayKey(new Date())) {
      setTasks((t) => [...t.slice(-11), { id, title: r.title, time: r.time, list: r.list, done: false, fresh: true }]);
      setLastAdded(id);
    } else {
      flash(`Added to ${parts.slice(1).join(" · ")}`);
    }
    setText("");
  };

  const takeOver = () => {
    touchedRef.current = true;
    setTouched(true);
  };

  // Type the script once while the demo is on screen, unless the visitor starts first.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || ran.current || touchedRef.current) return;
        ran.current = true;
        io.disconnect();
        if (reduced) {
          setText(SCRIPT[0]);
          return;
        }
        await wait(600);
        for (const phrase of SCRIPT) {
          for (let c = 1; c <= phrase.length; c++) {
            if (touchedRef.current) return;
            setText(phrase.slice(0, c));
            await wait(55 + Math.random() * 45);
          }
          await wait(1100);
          if (touchedRef.current) return;
          setPressing(true);
          await wait(150);
          setPressing(false);
          add(phrase);
          await wait(1300);
        }
      },
      { threshold: 0.55 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e) => {
    e.preventDefault();
    takeOver();
    add(text);
  };

  const toggleTask = (id) => {
    takeOver();
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  };
  const toggleHabit = (id) => {
    takeOver();
    setHabits((h) =>
      h.map((x) => (x.id === id ? { ...x, days: x.days.map((d, i) => (i === 6 ? (d ? 0 : 1) : d)) } : x))
    );
  };

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? done / tasks.length : 0;

  return (
    <div className="odemo" ref={root} aria-label="Interactive Orbit demo">
      <div className="odemo-bar">
        <span className="odemo-mark" aria-hidden="true">
          <svg viewBox="0 0 128 128" width="20" height="20">
            <rect width="128" height="128" rx="30" fill="#C43B33" />
            <path d="M93 64a29 29 0 1 1-29-29" fill="none" stroke="#FFF9F2" strokeWidth="12" strokeLinecap="round" />
            <circle cx="87" cy="41" r="8" fill="#FFF9F2" />
          </svg>
        </span>
        <span className="odemo-app">Orbit</span>
        <span className="odemo-nav" aria-hidden="true">
          <b>Today</b>
          <span>Calendar</span>
          <span>Notes</span>
          <span>Habits</span>
        </span>
        <span className="odemo-win" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="odemo-body" ref={body}>
        <div className="odemo-head">
          <div>
            <strong>Today</strong>
            <span suppressHydrationWarning>{today || " "}</span>
          </div>
          <div className="odemo-progress" aria-label={`${done} of ${tasks.length} done`}>
            <svg viewBox="0 0 36 36" width="34" height="34" aria-hidden="true">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#323236" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#E87359"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${pct * 94.25} 94.25`}
                transform="rotate(-90 18 18)"
                style={{ opacity: pct ? 1 : 0, transition: "stroke-dasharray 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease" }}
              />
            </svg>
            <span>
              {done}/{tasks.length}
            </span>
          </div>
        </div>

        <div className="odemo-cols">
          <ul className="odemo-card odemo-tasks">
            {tasks.map((t) => (
              <li key={t.id} data-id={t.id} className={`${t.done ? "is-done" : ""} ${t.fresh ? "is-fresh" : ""}`}>
                <button type="button" onClick={() => toggleTask(t.id)} aria-pressed={t.done}>
                  <Tick done={t.done} />
                  <span className="odemo-title">{t.title}</span>
                  <span className="odemo-meta">
                    {t.time !== null ? <span>{clock(t.time)}</span> : null}
                    {t.list ? <span className="odemo-tag">#{t.list}</span> : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="odemo-card odemo-habits">
            <div className="odemo-label">Habits</div>
            <ul>
              {habits.map((h) => {
                const count = h.days.reduce((a, b) => a + b, 0);
                return (
                  <li key={h.id} data-id={h.id} className={h.fresh ? "is-fresh" : ""}>
                    <button
                      type="button"
                      onClick={() => toggleHabit(h.id)}
                      aria-pressed={!!h.days[6]}
                      style={{ "--h": h.color }}
                    >
                      <span className={`odemo-dot${h.days[6] ? " is-on" : ""}`} aria-hidden="true" />
                      <span className="odemo-title">{h.title}</span>
                      <span className="odemo-week" aria-hidden="true">
                        {h.days.map((d, i) => (
                          <span key={i} className={`${i === 6 ? "is-today" : ""}${d ? " is-on" : ""}`} />
                        ))}
                      </span>
                      <span className="odemo-count">{count}/7</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <form className="odemo-add" onSubmit={submit}>
        <div className={`odemo-toast${toast ? " is-on" : ""}`} role="status">
          {toast}
        </div>
        <div className="odemo-field">
          <span className="odemo-plus" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={text}
            onChange={(e) => {
              takeOver();
              setText(e.target.value);
            }}
            onFocus={takeOver}
            placeholder="Add a task or habit…"
            aria-label="Quick add"
            autoComplete="off"
            spellCheck={false}
            maxLength={80}
          />
          <button type="submit" className={`odemo-go${pressing ? " is-pressed" : ""}`}>
            Add
          </button>
        </div>
        <div className="odemo-chiprow" aria-live={touched ? "polite" : "off"}>
          {chip.length ? (
            <span className="odemo-chip">
              {chip.map((c, i) => (
                <span key={c + i}>
                  {i > 0 ? <i aria-hidden="true">·</i> : null}
                  {c}
                </span>
              ))}
            </span>
          ) : (
            <span className="odemo-hint">
              Try
              {EXAMPLES.map((ex) => (
                <button
                  type="button"
                  key={ex}
                  onClick={() => {
                    takeOver();
                    setText(ex);
                  }}
                >
                  {ex}
                </button>
              ))}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
