// Home: hero + 3 real packages + tool cards. Client component (uses i18n).
"use client";

import Link from "next/link";
import { PACKAGES, formatIdr, waLink } from "@/lib/packages";
import { useLang } from "@/lib/i18n";

const TOOLS = [
  {
    href: "/itinerary",
    icon: "🗺️",
    titleId: "Generator Itinerary",
    titleEn: "Itinerary Generator",
    descId: "Pilih paket, tanggal, dan budget — jadi rencana hari-per-hari.",
    descEn: "Pick a package, date, and budget — get a day-by-day plan.",
  },
  {
    href: "/trip",
    icon: "📄",
    titleId: "Pembuat Halaman Trip",
    titleEn: "Trip Page Builder",
    descId: "Buat halaman trip yang bisa dibagikan + tombol WhatsApp.",
    descEn: "Build a shareable trip page with a WhatsApp button.",
  },
  {
    href: "/tanya",
    icon: "💬",
    titleId: "Tanya Maya",
    titleEn: "Ask Maya",
    descId: "Jawaban soal harga, DP, meeting point, dan jadwal.",
    descEn: "Answers on prices, deposit, meeting points, and schedules.",
  },
  {
    href: "/hari-h",
    icon: "✅",
    titleId: "Mode Hari-H",
    titleEn: "Trip-Day Mode",
    descId: "Checklist, hitung peserta, peta meeting point, broadcast WA.",
    descEn: "Checklist, headcount, meeting-point map, WA broadcast.",
  },
];

export default function Home() {
  const { lang, t } = useLang();
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-3xl bg-navy-900 px-6 py-10 text-white sm:px-10">
        <p className="text-xs font-bold tracking-widest text-gold-400 uppercase">
          ✈️ Open Trip Maya · {t("tagline")}
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl leading-tight font-extrabold sm:text-4xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {t("heroSub")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/itinerary"
            className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-bold text-navy-900 hover:bg-gold-500"
          >
            {lang === "id" ? "Buat itinerary →" : "Build an itinerary →"}
          </Link>
          <a
            href={waLink("Halo Angga, saya mau tanya Open Trip.")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            💬 WhatsApp Angga
          </a>
        </div>
      </section>

      {/* Packages */}
      <section>
        <h2 className="text-2xl font-extrabold text-navy-900">
          {t("packagesTitle")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{t("packagesSub")}</p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <article
              key={p.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg leading-snug font-extrabold text-navy-900">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500">{p.subtitle}</p>
                </div>
                <span className="rounded-full bg-navy-900 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-white">
                  {p.days}D{p.nights}N
                </span>
              </div>
              <p className="mt-4 text-2xl font-extrabold text-navy-900">
                {p.priceLabel}
                <span className="ml-1 text-xs font-medium text-slate-500">
                  / {t("perPerson")}
                </span>
              </p>
              {p.priceNote && (
                <p className="text-xs text-slate-500">{p.priceNote}</p>
              )}
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                <li>
                  <strong>{t("includes")}:</strong> {p.includes.join(", ")}
                </li>
                <li>
                  <strong>{t("meetingPoint")}:</strong>{" "}
                  {p.meetingPoint.name}
                </li>
                <li>
                  <strong>{t("minPeople")}:</strong> {p.minPeople}{" "}
                  {t("people")}
                </li>
                <li>
                  <strong>{t("dp")}:</strong>{" "}
                  {p.earlyBird ? (
                    <>
                      {formatIdr(p.earlyBird.dpIdr)} (Early Bird s.d.{" "}
                      {p.earlyBird.until}, normal{" "}
                      {formatIdr(p.earlyBird.dpNormalIdr)})
                    </>
                  ) : p.downPaymentIdr ? (
                    formatIdr(p.downPaymentIdr)
                  ) : lang === "id" ? (
                    "Tanya via WA"
                  ) : (
                    "Ask via WA"
                  )}
                </li>
              </ul>
              {p.earlyBird && (
                <p className="mt-3 rounded-lg bg-gold-400/20 px-3 py-2 text-xs font-semibold text-gold-600">
                  🔥 {t("earlyBird")}: DP {formatIdr(p.earlyBird.dpIdr)}{" "}
                  (normal {formatIdr(p.earlyBird.dpNormalIdr)}) s.d.{" "}
                  {p.earlyBird.until}
                </p>
              )}
              <div className="mt-4 flex gap-2 pt-1">
                <Link
                  href={`/itinerary?pkg=${p.id}`}
                  className="flex-1 rounded-full bg-navy-900 px-3 py-2 text-center text-xs font-bold text-white hover:bg-navy-800"
                >
                  {t("viewItinerary")}
                </Link>
                <Link
                  href={`/trip?pkg=${p.id}`}
                  className="flex-1 rounded-full border border-navy-900 px-3 py-2 text-center text-xs font-bold text-navy-900 hover:bg-navy-50"
                >
                  {t("buildTrip")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section>
        <h2 className="text-2xl font-extrabold text-navy-900">
          {t("toolsTitle")}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-3xl">{tool.icon}</span>
              <h3 className="mt-3 font-extrabold text-navy-900">
                {lang === "id" ? tool.titleId : tool.titleEn}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {lang === "id" ? tool.descId : tool.descEn}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
