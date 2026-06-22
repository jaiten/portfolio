import CursorHalo from "@/components/cursor-halo";
import "./globals.css";

export const metadata = {
  title: "Jaiten Kang",
  description:
    "Jaiten Kang — builder shipping AI tools, browser extensions, and web products. McGill CS '26. Montreal."
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
