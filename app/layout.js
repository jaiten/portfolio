import CursorHalo from "@/components/cursor-halo";
import "./globals.css";

export const metadata = {
  title: "Jaiten Kang | Portfolio",
  description:
    "Portfolio of Jaiten Kang, a McGill computer science student building software across frontend, product, and systems work."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CursorHalo />
        {children}
      </body>
    </html>
  );
}
