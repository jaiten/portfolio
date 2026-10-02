"use client";
import { useRef, useEffect, useCallback } from "react";

// ink-2: #3b382e   accent: #d6401e
const INK  = [59, 56, 46];
const ACCT = [214, 64, 30];

function lerp(a, b, t) { return a + (b - a) * t; }

function mix(t) {
  const r = Math.round(lerp(INK[0], ACCT[0], t));
  const g = Math.round(lerp(INK[1], ACCT[1], t));
  const b = Math.round(lerp(INK[2], ACCT[2], t));
  return `rgb(${r},${g},${b})`;
}

export default function SkillsGrid({ skills }) {
  const gridRef   = useRef(null);
  const itemRefs  = useRef({});
  const current   = useRef({});   // key → current proximity (for lerping)
  const mouse     = useRef({ x: -999, y: -999, inside: false });
  const rafId     = useRef(null);

  const tick = useCallback(() => {
    const { x, y, inside } = mouse.current;
    let anyActive = false;

    Object.entries(itemRefs.current).forEach(([key, li]) => {
      if (!li) return;
      const r   = li.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dist = inside ? Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) : 999;
      const target = Math.max(0, 1 - dist / 190);
      const prev   = current.current[key] ?? 0;
      // fast lerp: snappy toward target
      const next = prev + (target - prev) * 0.18;
      current.current[key] = next;

      const p = Math.max(0, Math.min(1, next));
      li.style.color = mix(p);
      li.style.setProperty("--proximity", p);

      if (Math.abs(next - target) > 0.002) anyActive = true;
    });

    if (anyActive || inside) {
      rafId.current = requestAnimationFrame(tick);
    } else {
      rafId.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!rafId.current) rafId.current = requestAnimationFrame(tick);
  }, [tick]);

  const handleMove = useCallback((e) => {
    const grid = gridRef.current;
    if (grid) {
      const r = grid.getBoundingClientRect();
      grid.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
      grid.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
      grid.style.setProperty("--active", "1");
    }
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
    mouse.current.inside = true;
    startLoop();
  }, [startLoop]);

  const handleLeave = useCallback(() => {
    gridRef.current?.style.setProperty("--active", "0");
    mouse.current.inside = false;
    startLoop();
  }, [startLoop]);

  useEffect(() => () => { if (rafId.current) cancelAnimationFrame(rafId.current); }, []);

  return (
    <div ref={gridRef} className="skills" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {skills.map((g, index) => (
        <div className="skill-col" key={g.title}>
          <h4>
            <span>{g.title}</span>
            <span className="skill-count">0{index + 1}</span>
          </h4>
          <ul>
            {g.items.map((s) => (
              <li
                key={s}
                ref={(el) => { itemRefs.current[`${g.title}·${s}`] = el; }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
