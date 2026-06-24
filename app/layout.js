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
  openGraph: {
    title: "Jaiten Kang · Software Engineer & Builder",
    description:
      "Production websites, browser extensions, and AI systems, built and shipped end to end.",
    type: "website"
  }
};

export const viewport = {
  themeColor: "#f3f0e7"
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
