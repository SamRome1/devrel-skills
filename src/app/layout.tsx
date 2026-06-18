import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skills Library — DevRel",
  description:
    "Share and install Claude skills across the Supabase DevRel team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-accent-soft text-accent">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              <span className="font-semibold tracking-tight">
                Skills Library
              </span>
              <span className="text-xs text-dimmer">DevRel</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm text-dim">
              <Link href="/" className="hover:text-text">
                Browse
              </Link>
              <Link
                href="/upload"
                className="rounded-md bg-accent px-3 py-1.5 font-medium text-[#0d0b09] hover:opacity-90"
              >
                Share a skill
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-5 py-10 text-xs text-dimmer">
          Supabase DevRel · Claude skills, shared.
        </footer>
      </body>
    </html>
  );
}
