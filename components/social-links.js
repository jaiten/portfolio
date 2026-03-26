"use client";

const icons = {
  GitHub: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M12 2C6.48 2 2 6.59 2 12.24c0 4.51 2.87 8.34 6.84 9.69.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.09 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.37 1.9-1.32 2.74-1.05 2.74-1.05.56 1.41.21 2.45.11 2.71.64.71 1.03 1.62 1.03 2.74 0 3.96-2.34 4.82-4.57 5.08.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.24C22 6.59 17.52 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  ),
  LinkedIn: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M6.94 8.47H3.56V19.5h3.38V8.47ZM5.25 3C4.17 3 3.3 3.88 3.3 4.98c0 1.09.87 1.97 1.95 1.97s1.95-.88 1.95-1.97C7.2 3.88 6.33 3 5.25 3ZM20.7 12.75c0-3.32-1.76-4.86-4.12-4.86-1.9 0-2.75 1.06-3.22 1.8V8.47H10v11.04h3.36v-6.16c0-1.62.3-3.18 2.28-3.18 1.96 0 1.99 1.88 1.99 3.28v6.06H21V12.75h-.3Z"
        fill="currentColor"
      />
    </svg>
  ),
  Email: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.13-.5 6.5 5.21a.6.6 0 0 0 .74 0l6.5-5.21H5.13Zm13.12 11.99c.69 0 1.25-.56 1.25-1.25V7.65l-6.19 4.95a2.1 2.1 0 0 1-2.62 0L4.5 7.65V17c0 .69.56 1.25 1.25 1.25h12.5Z"
        fill="currentColor"
      />
    </svg>
  )
};

export default function SocialLinks({ links, className = "" }) {
  return (
    <div className={`social-links ${className}`.trim()}>
      {links.map((link) => {
        const isMail = link.href.startsWith("mailto:");

        return (
          <a
            aria-label={link.label}
            className="social-link"
            href={link.href}
            key={link.label}
            rel={isMail ? undefined : "noreferrer"}
            target={isMail ? undefined : "_blank"}
          >
            {icons[link.label]}
          </a>
        );
      })}
    </div>
  );
}
