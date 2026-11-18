import type { Metadata } from "next";
import Link from "next/link";
import { LangProvider } from "@/lib/i18n";
import Nav from "./nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maya — AI Tour Leader Copilot",
  description:
    "Copilot AI untuk tour leader open trip: generator itinerary, pembuat halaman trip, asisten Q&A, dan mode hari-H. Data paket asli Open Trip Maya.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        <LangProvider>
          <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-lg text-gold-400">
                  ✈️
                </span>
                <span className="leading-tight">
                  <span className="block text-base font-extrabold tracking-tight text-navy-900">
                    MAYA
                  </span>
                  <span className="block text-[11px] font-medium text-slate-500">
                    AI Tour Leader Copilot
                  </span>
                </span>
              </Link>
              <Nav />
            </div>
          </header>
          <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-navy-900 py-6 text-center text-xs text-slate-300">
            <p className="px-4">
              Maya — AI Tour Leader Copilot · Dibangun untuk Kiroween 2026 ·
              Data paket: Open Trip Maya · Tanpa login, tanpa pelacakan.
            </p>
            <p className="mt-1 px-4">
              WhatsApp:{" "}
              <a
                className="font-semibold text-gold-400 underline"
                href="https://wa.me/6281228290989"
                target="_blank"
                rel="noreferrer"
              >
                0812 2829 0989
              </a>{" "}
              · Instagram: @opentrip_maya
            </p>
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
