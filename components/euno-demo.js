"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* A small, working slice of Euno: the library, all-term search across title,
   transcript, topics, mood and reflection (the same rule as the app), a mood
   filter, and a note with timestamped segments that play back in order. */

const NOTES = [
  {
    id: 1,
    title: "Walk home after the demo",
    date: "Oct 28",
    duration: 104,
    mood: "excited",
    topics: ["work", "launch", "team"],
    sentiment: 0.62,
    wpm: 164,
    quiet: 0.18,
    reflection: "Remember this feeling next time a launch looks scary.",
    segments: [
      [0, "Okay, the demo actually went well. Like, really well."],
      [12, "They asked about the sync conflicts and I had an answer ready."],
      [27, "I think the launch can happen next week if the team is up for it."],
      [45, "Need to write down the three questions they asked before I forget."]
    ]
  },
  {
    id: 2,
    title: "Sunday reset",
    date: "Oct 26",
    duration: 156,
    mood: "calm",
    topics: ["routine", "sleep", "week"],
    sentiment: 0.31,
    wpm: 118,
    quiet: 0.34,
    reflection: "",
    segments: [
      [0, "Slow morning. Coffee on the balcony, no phone for an hour."],
      [18, "Sleep has been better since I stopped working past ten."],
      [36, "Plan for the week is small on purpose: three things, that's it."],
      [58, "Call my sister about the trip in December."]
    ]
  },
  {
    id: 3,
    title: "Before the interview",
    date: "Oct 21",
    duration: 71,
    mood: "anxious",
    topics: ["interview", "work"],
    sentiment: -0.18,
    wpm: 182,
    quiet: 0.09,
    reflection: "It went fine. The nerves were louder than the actual thing.",
    segments: [
      [0, "Twenty minutes until the interview and my hands are cold."],
      [11, "I know the material. I just keep replaying the system design part."],
      [26, "Breathe. Say the tradeoffs out loud. Ask what they care about."]
    ]
  },
  {
    id: 4,
    title: "Thinking about the move",
    date: "Oct 14",
    duration: 132,
    mood: "mixed",
    topics: ["move", "family", "city"],
    sentiment: 0.04,
    wpm: 131,
    quiet: 0.27,
    reflection: "",
    segments: [
      [0, "Vancouver or Montréal again, I keep going back and forth."],
      [20, "Family is here, but the city there felt more like mine."],
      [41, "Maybe the answer is to stop deciding in the abstract and visit."]
    ]
  },
  {
    id: 5,
    title: "Long day, short note",
    date: "Oct 9",
    duration: 48,
    mood: "frustrated",
    topics: ["work", "sleep"],
    sentiment: -0.41,
    wpm: 149,
    quiet: 0.21,
    reflection: "",
    segments: [
      [0, "The build broke three times today for three different reasons."],
      [14, "Not sleeping until it's green is a bad plan. Going to bed."]
    ]
  }
];

const MOODS = ["all", "excited", "calm", "anxious", "mixed", "frustrated"];

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const matches = (note, query) =>
  query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) =>
      [note.title, note.segments.map((s) => s[1]).join(" "), note.topics.join(" "), note.mood, note.reflection]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

function Highlight({ text, query }) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    terms.includes(part.toLowerCase()) ? <mark key={i}>{part}</mark> : part
  );
}

function snippet(note, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hit = terms.length
    ? note.segments.find((s) => terms.some((t) => s[1].toLowerCase().includes(t)))
    : null;
  return (hit || note.segments[0])[1];
}

export default function EunoDemo() {
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const timer = useRef(null);

  const list = useMemo(
    () => NOTES.filter((n) => (mood === "all" || n.mood === mood) && matches(n, query)),
    [query, mood]
  );
  const open = NOTES.find((n) => n.id === openId);

  useEffect(() => {
    if (!playing || !open) return;
    timer.current = setInterval(() => {
      setPos((p) => {
        const next = p + 1;
        if (next >= open.duration) {
          setPlaying(false);
          return 0;
        }
        return next;
      });
    }, 70);
    return () => clearInterval(timer.current);
  }, [playing, open]);

  const openNote = (id) => {
    setOpenId(id);
    setPos(0);
    setPlaying(false);
  };

  const topicCounts = useMemo(() => {
    const counts = {};
    NOTES.forEach((n) => n.topics.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, []);

  const current = open ? [...open.segments].reverse().find((s) => s[0] <= pos) : null;

  return (
    <div className="edemo" aria-label="Interactive Euno demo">
      <div className="edemo-phone">
        {!open ? (
          <div className="edemo-screen" key="list">
            <div className="edemo-top">
              <strong>Euno</strong>
              <span>{NOTES.length} notes · on device</span>
            </div>
            <label className="edemo-search">
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search what you said…"
                aria-label="Search notes"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                  ×
                </button>
              ) : null}
            </label>
            <div className="edemo-moods" role="group" aria-label="Filter by mood">
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m}
                  className={mood === m ? "is-on" : ""}
                  onClick={() => setMood(m)}
                  aria-pressed={mood === m}
                >
                  {m === "all" ? "All" : m}
                </button>
              ))}
            </div>
            <ul className="edemo-list">
              {list.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => openNote(n.id)}>
                    <span className="edemo-row">
                      <strong>
                        <Highlight text={n.title} query={query} />
                      </strong>
                      <span>{fmt(n.duration)}</span>
                    </span>
                    <span className="edemo-snip">
                      “<Highlight text={snippet(n, query)} query={query} />”
                    </span>
                    <span className="edemo-row edemo-sub">
                      <span>{n.date}</span>
                      <span className={`edemo-mood m-${n.mood}`}>{n.mood}</span>
                    </span>
                  </button>
                </li>
              ))}
              {!list.length ? (
                <li className="edemo-empty">No notes mention “{query}”{mood !== "all" ? ` with ${mood}` : ""}.</li>
              ) : null}
            </ul>
          </div>
        ) : (
          <div className="edemo-screen" key="detail">
            <button type="button" className="edemo-back" onClick={() => setOpenId(null)}>
              ‹ Library
            </button>
            <strong className="edemo-title">{open.title}</strong>
            <span className="edemo-when">
              {open.date} · {fmt(open.duration)} · <span className={`edemo-mood m-${open.mood}`}>{open.mood}</span>
            </span>
            <div className="edemo-player">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                    <rect x="3" y="2.5" width="3.4" height="11" rx="1" fill="currentColor" />
                    <rect x="9.6" y="2.5" width="3.4" height="11" rx="1" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                    <path d="M4 2.5l9.5 5.5L4 13.5z" fill="currentColor" />
                  </svg>
                )}
              </button>
              <span className="edemo-track">
                <span style={{ width: `${(pos / open.duration) * 100}%` }} />
              </span>
              <span className="edemo-time">{fmt(pos)}</span>
            </div>
            <ol className="edemo-segs">
              {open.segments.map((s) => (
                <li key={s[0]} className={current === s && (playing || pos > 0) ? "is-now" : ""}>
                  <button
                    type="button"
                    onClick={() => {
                      setPos(s[0]);
                      setPlaying(true);
                    }}
                  >
                    <span>{fmt(s[0])}</span>
                    {s[1]}
                  </button>
                </li>
              ))}
            </ol>
            <div className="edemo-stats">
              <span>
                <b>{open.wpm}</b> wpm
              </span>
              <span>
                <b>{Math.round(open.quiet * 100)}%</b> quiet
              </span>
              <span>
                <b>{open.sentiment > 0 ? "+" : ""}{open.sentiment.toFixed(2)}</b> wording
              </span>
            </div>
            <div className="edemo-topics">
              {open.topics.map((t) => (
                <button type="button" key={t} onClick={() => { setQuery(t); setMood("all"); setOpenId(null); }}>
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="edemo-side" aria-label="Recurring topics">
        <span className="edemo-side-label">Keeps coming up</span>
        {topicCounts.map(([t, c]) => (
          <button type="button" key={t} onClick={() => { setQuery(t); setMood("all"); setOpenId(null); }}>
            <span>{t}</span>
            <span className="edemo-bar">
              <span style={{ width: `${(c / NOTES.length) * 100}%` }} />
            </span>
            <span>{c}</span>
          </button>
        ))}
        <p>Mood is what you label. Wording and pace are measured, never diagnosed.</p>
      </aside>
    </div>
  );
}
