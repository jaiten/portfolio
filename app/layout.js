import CursorHalo from "@/components/cursor-halo";
import "./globals.css";

export const metadata = {
  title: "Jaiten Portfolio",
  description: "Animated geometric portfolio experience built with Next.js."
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
