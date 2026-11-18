// Nav with ID/EN toggle (client component).
"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const links = [
    { href: "/", label: t("navHome") },
    { href: "/itinerary", label: t("navItinerary") },
    { href: "/trip", label: t("navTrip") },
    { href: "/tanya", label: t("navAsk") },
    { href: "/hari-h", label: t("navDayH") },
  ];
  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      <div className="hidden items-center gap-1 md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-navy-900 hover:bg-navy-50"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex overflow-hidden rounded-full border border-navy-900/20 text-xs font-bold">
        <button
          onClick={() => setLang("id")}
          className={`px-2.5 py-1.5 ${
            lang === "id" ? "bg-navy-900 text-white" : "bg-white text-navy-900"
          }`}
          aria-pressed={lang === "id"}
        >
          ID
        </button>
        <button
          onClick={() => setLang("en")}
          className={`px-2.5 py-1.5 ${
            lang === "en" ? "bg-navy-900 text-white" : "bg-white text-navy-900"
          }`}
          aria-pressed={lang === "en"}
        >
          EN
        </button>
      </div>
    </nav>
  );
}
