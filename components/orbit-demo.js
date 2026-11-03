"use client";

import { useEffect, useRef, useState } from "react";
import { parse, chipParts, dayKey } from "@/lib/quick-add";

/* A small, working slice of Orbit: Today, habits and the quick add bar.
   Quick add runs the same phrase parser as the real apps. */

const EXAMPLES = ["Call mom tomorrow 6pm", "Stretch every day", "Dentist fri 9am #health", "Book ideas someday"];

const START_TASKS = [
  { id: 1, title: "Send the invoice to Gravity", time: 600, list: "work", done: true },
  { id: 2, title: "Groceries for the week", time: null, list: null, done: false },
  { id: 3, title: "Review the onboarding copy", time: 900, list: "work", done: false }
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

const Check = () => (
  <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function OrbitDemo() {
  const [tasks, setTasks] = useState(START_TASKS);
  const [habits, setHabits] = useState(START_HABITS);
  const [text, setText] = useState("");
  const [toast, setToast] = useState(null);
  const [today, setToday] = useState(null);
  const nextId = useRef(10);
  const toastTimer = useRef(null);

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    );
    return () => clearTimeout(toastTimer.current);
  }, []);

  const result = text.trim() ? parse(text) : null;
  const chip = result ? chipParts(result) : [];

  const flash = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!result || !result.title) return;
    const id = nextId.current++;
    if (result.kind === "habit") {
      setHabits((h) => [
        ...h,
        { id, title: result.title, days: [0, 0, 0, 0, 0, 0, 0], color: HABIT_COLORS[id % HABIT_COLORS.length], fresh: true }
      ]);
      flash(`New habit · ${chip.slice(1).join(" · ")}`);
    } else if (result.date === dayKey(new Date())) {
      setTasks((t) => [...t, { id, title: result.title, time: result.time, list: result.list, done: false, fresh: true }]);
    } else {
      flash(`Added to ${chip.slice(1).join(" · ")}`);
    }
    setText("");
  };

  const toggleTask = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const toggleHabit = (id) =>
    setHabits((h) =>
      h.map((x) => (x.id === id ? { ...x, days: x.days.map((d, i) => (i === 6 ? (d ? 0 : 1) : d)) } : x))
    );

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? done / tasks.length : 0;

  return (
    <div className="odemo" aria-label="Interactive Orbit demo">
      <div className="odemo-bar">
        <span className="odemo-mark" aria-hidden="true">
          <svg viewBox="0 0 128 128" width="22" height="22">
            <rect width="128" height="128" rx="30" fill="#C43B33" />
            <path d="M93 64a29 29 0 1 1-29-29" fill="none" stroke="#FFF9F2" strokeWidth="12" strokeLinecap="round" />
            <circle cx="87" cy="41" r="8" fill="#FFF9F2" />
          </svg>
        </span>
        <span className="odemo-app">Orbit</span>
        <span className="odemo-nav">
          <b>Today</b>
          <span>Calendar</span>
          <span>Notes</span>
        </span>
      </div>

      <div className="odemo-body">
        <div className="odemo-head">
          <div>
            <strong>Today</strong>
            <span suppressHydrationWarning>{today || " "}</span>
          </div>
          <div className="odemo-progress" aria-label={`${done} of ${tasks.length} done`}>
            <svg viewBox="0 0 36 36" width="34" height="34" aria-hidden="true">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#E4E4E8" strokeWidth="4" />
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
                style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)" }}
              />
            </svg>
            <span>
              {done}/{tasks.length}
            </span>
          </div>
        </div>

        <ul className="odemo-tasks">
          {tasks.map((t) => (
            <li key={t.id} className={`${t.done ? "is-done" : ""} ${t.fresh ? "is-fresh" : ""}`}>
              <button type="button" onClick={() => toggleTask(t.id)} aria-pressed={t.done}>
                <span className="odemo-tick">{t.done ? <Check /> : null}</span>
                <span className="odemo-title">{t.title}</span>
                <span className="odemo-meta">
                  {t.time !== null ? <span>{clock(t.time)}</span> : null}
                  {t.list ? <span className="odemo-tag">#{t.list}</span> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="odemo-label">Habits</div>
        <ul className="odemo-habits">
          {habits.map((h) => {
            const count = h.days.reduce((a, b) => a + b, 0);
            return (
              <li key={h.id} className={h.fresh ? "is-fresh" : ""}>
                <button type="button" onClick={() => toggleHabit(h.id)} aria-pressed={!!h.days[6]}>
                  <span className="odemo-title">{h.title}</span>
                  <span className="odemo-week" aria-hidden="true">
                    {h.days.map((d, i) => (
                      <span
                        key={i}
                        className={i === 6 ? "is-today" : ""}
                        style={{ background: d ? h.color : undefined }}
                      />
                    ))}
                  </span>
                  <span className="odemo-count">{count} of 7</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <form className="odemo-add" onSubmit={submit}>
        <div className="odemo-field">
          <span className="odemo-plus" aria-hidden="true">+</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task or habit…"
            aria-label="Quick add"
            maxLength={80}
          />
          {chip.length ? (
            <span className="odemo-chip" aria-live="polite">
              {chip.map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </span>
          ) : null}
        </div>
        <div className="odemo-try">
          <span>Try</span>
          {EXAMPLES.map((ex) => (
            <button type="button" key={ex} onClick={() => setText(ex)}>
              {ex}
            </button>
          ))}
        </div>
        <div className={`odemo-toast${toast ? " is-on" : ""}`} role="status">
          {toast}
        </div>
      </form>
    </div>
  );
}
