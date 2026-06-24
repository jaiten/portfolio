"use client";

import { useEffect, useRef, useState } from "react";

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/**
 * The email shown as a mailto link, paired with a copy-to-clipboard button that
 * gives clear, accessible confirmation once the address is on the clipboard.
 */
export default function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // fallback for non-secure contexts / older browsers
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="copy-email">
      <a className="contact-mail copy-email-addr" href={`mailto:${email}`}>
        {email}
      </a>
      <button
        type="button"
        className={`copy-btn ${copied ? "is-copied" : ""}`}
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
      >
        <span className="copy-ic copy-ic-copy">
          <CopyIcon />
        </span>
        <span className="copy-ic copy-ic-check">
          <CheckIcon />
        </span>
      </button>
      <span className={`copy-feedback ${copied ? "show" : ""}`} aria-live="polite">
        Copied
      </span>
    </div>
  );
}
