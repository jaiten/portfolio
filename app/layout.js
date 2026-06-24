import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"]
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"]
});

export const metadata = {
  metadataBase: new URL("https://jaitenkang.com"),
  title: "Jaiten Kang · Software Engineer & Builder",
  description:
    "Jaiten Kang turns ambiguous problems into deployed products: production websites, browser extensions, and AI systems. McGill CS '26.",
  keywords: [
    "Jaiten Kang",
    "software engineer",
    "web developer",
    "Next.js developer",
    "React developer",
    "browser extensions",
    "AI systems",
    "McGill Computer Science",
    "Vancouver developer",
    "full-stack developer"
  ],
  authors: [{ name: "Jaiten Kang", url: "https://jaitenkang.com" }],
  creator: "Jaiten Kang",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Jaiten Kang · Software Engineer & Builder",
    description:
      "Production websites, browser extensions, and AI systems, built and shipped end to end.",
    type: "website",
    url: "https://jaitenkang.com",
    locale: "en_US",
    siteName: "Jaiten Kang"
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaiten Kang · Software Engineer & Builder",
    description:
      "Production websites, browser extensions, and AI systems, built and shipped end to end.",
    creator: "@jaitenk"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport = {
  themeColor: "#f3f0e7"
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jaiten Kang",
    url: "https://jaitenkang.com",
    email: "jaitenkangis@gmail.com",
    jobTitle: "Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Gravity Computers",
      url: "https://www.gravitycomputers.com/"
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "McGill University",
      url: "https://www.mcgill.ca/"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vancouver",
      addressRegion: "BC",
      addressCountry: "CA"
    },
    sameAs: [
      "https://github.com/jaiten",
      "https://linkedin.com/in/jaitenk"
    ],
    description:
      "Software engineer and builder who turns ambiguous problems into deployed products: production websites, browser extensions, and AI systems.",
    knowsAbout: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Chrome Extensions",
      "Browser Automation",
      "AI Systems",
      "Web Development",
      "LLM Orchestration"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jaiten Kang",
    url: "https://jaitenkang.com",
    description:
      "Portfolio of Jaiten Kang — software engineer specialising in web development, browser extensions, and AI systems.",
    author: {
      "@type": "Person",
      name: "Jaiten Kang"
    }
  }
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
