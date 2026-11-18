// Itinerary generator — Feature 1.
// Picks a real package (or custom), date, travellers, budget → day-by-day
// plan from the real itinerary data. Prices come only from packages.ts.
"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PACKAGES,
  getPackage,
  formatIdr,
  type PackageId,
} from "@/lib/packages";
import { useLang } from "@/lib/i18n";

const CUSTOM_STOPS: Record<string, string[]> = {
  Singapura: [
    "Merlion",
    "Marina Bay",
    "Gardens by the Bay",
    "Marina Bay Sands",
    "Jewel Changi",
    "Sentosa",
    "Universal Studios",
    "Chinatown Singapura",
    "Clarke Quay",
  ],
  Malaysia: [
    "Menara Kembar Petronas",
    "Batu Caves",
    "Chinatown KL",
    "Bukit Bintang",
    "Genting Highlands",
    "Cable Car Awana SkyWay",
  ],
};

function Generator() {
  const params = useSearchParams();
  const initialPkg = (params.get("pkg") as PackageId) || "singapura";
  const { lang } = useLang();
  const [pkgId, setPkgId] = useState<PackageId | "custom">(initialPkg);
  const [date, setDate] = useState("");
  const [travellers, setTravellers] = useState(4);
  const [budget, setBudget] = useState("");
  const [customDest, setCustomDest] = useState("Singapura");
  const [customDays, setCustomDays] = useState(3);
  const [saved, setSaved] = useState(false);

  const pkg = pkgId === "custom" ? null : getPackage(pkgId);
  const budgetNum = Number(budget.replace(/[^0-9]/g, "")) || 0;
  const total = pkg ? pkg.priceIdr * travellers : 0;
  const withinBudget = budgetNum === 0 || total <= budgetNum * travellers;

  const customPlan = useMemo(() => {
    if (pkgId !== "custom") return [];
    const stops = CUSTOM_STOPS[customDest] ?? [];
    const perDay = Math.ceil(stops.length / customDays);
    return Array.from({ length: customDays }, (_, i) => ({
      day: i + 1,
      title: lang === "id" ? `Hari ${i + 1}` : `Day ${i + 1}`,
      stops: stops.slice(i * perDay, (i + 1) * perDay),
    }));
  }, [pkgId, customDest, customDays, lang]);

  const planDays = pkg ? pkg.itinerary : customPlan;

  const savePlan = () => {
    const plan = {
      pkgId,
      date,
      travellers,
      budget: budgetNum,
      savedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(
      localStorage.getItem("maya-saved-plans") || "[]",
    );
    existing.push(plan);
    localStorage.setItem("maya-saved-plans", JSON.stringify(existing));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const id = lang === "id";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-900">
          {id ? "Generator Itinerary" : "Itinerary Generator"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {id
            ? "Pilih paket asli Open Trip Maya, tanggal, dan jumlah peserta — rencana hari-per-hari langsung jadi."
            : "Pick a real Open Trip Maya package, date, and group size — get a day-by-day plan instantly."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div>
            <label className="text-sm font-bold text-navy-900">
              {id ? "Paket" : "Package"}
            </label>
            <div className="mt-2 grid gap-2">
              {PACKAGES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPkgId(p.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold ${
                    pkgId === p.id
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-slate-300 bg-white text-navy-900 hover:bg-navy-50"
                  }`}
                >
                  {p.name} · {p.days}D{p.nights}N · {p.priceLabel}
                </button>
              ))}
              <button
                onClick={() => setPkgId("custom")}
                className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold ${
                  pkgId === "custom"
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-slate-300 bg-white text-navy-900 hover:bg-navy-50"
                }`}
              >
                {id ? "✏️ Custom (draf estimasi)" : "✏️ Custom (draft estimate)"}
              </button>
            </div>
          </div>

          {pkgId === "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold text-navy-900">
                  {id ? "Destinasi" : "Destination"}
                </label>
                <select
                  value={customDest}
                  onChange={(e) => setCustomDest(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option>Singapura</option>
                  <option>Malaysia</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-navy-900">
                  {id ? "Jumlah hari" : "Days"}
                </label>
                <input
                  type="number"
                  min={2}
                  max={5}
                  value={customDays}
                  onChange={(e) => setCustomDays(Number(e.target.value) || 3)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-navy-900">
              {id ? "Tanggal berangkat (rencana)" : "Departure date (planned)"}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-navy-900">
              {id ? "Jumlah peserta" : "Travellers"}
            </label>
            <input
              type="number"
              min={1}
              max={40}
              value={travellers}
              onChange={(e) => setTravellers(Number(e.target.value) || 1)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">
              {id
                ? "Minimal 4 orang agar trip berangkat."
                : "Minimum 4 people for the trip to depart."}
            </p>
          </div>

          <div>
            <label className="text-sm font-bold text-navy-900">
              {id ? "Budget per orang (Rp, opsional)" : "Budget per person (IDR, optional)"}
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="cth. 2500000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </section>

        {/* Result */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
          {pkg ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-navy-900">
                    {pkg.name} · {pkg.days}D{pkg.nights}N
                  </h2>
                  <p className="text-sm text-slate-500">{pkg.subtitle}</p>
                </div>
                <span className="rounded-full bg-gold-400 px-3 py-1 text-sm font-extrabold text-navy-900">
                  {pkg.priceLabel}
                </span>
              </div>

              <div className="rounded-xl bg-navy-50 px-4 py-3 text-sm">
                <p>
                  <strong>{travellers} {id ? "peserta" : "travellers"} × {formatIdr(pkg.priceIdr)}</strong>{" "}
                  = <strong className="text-navy-900">{formatIdr(total)}</strong>
                </p>
                {budgetNum > 0 && (
                  <p className={`mt-1 font-semibold ${withinBudget ? "text-green-700" : "text-red-600"}`}>
                    {withinBudget
                      ? id
                        ? "✅ Sesuai budget."
                        : "✅ Within budget."
                      : id
                        ? `⚠️ Melebihi budget ${formatIdr(budgetNum)}/org.`
                        : `⚠️ Over budget ${formatIdr(budgetNum)}/person.`}
                  </p>
                )}
                {travellers < pkg.minPeople && (
                  <p className="mt-1 font-semibold text-amber-700">
                    {id
                      ? `⚠️ Butuh min. ${pkg.minPeople} orang agar berangkat — masih kurang ${pkg.minPeople - travellers}.`
                      : `⚠️ Needs min. ${pkg.minPeople} people to depart — short by ${pkg.minPeople - travellers}.`}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {planDays.map((d) => (
                  <div key={d.day} className="rounded-xl border border-slate-200 p-3">
                    <p className="font-bold text-navy-900">
                      {id ? `Hari ${d.day}` : `Day ${d.day}`} — {d.title}
                    </p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-700">
                      {d.stops.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="font-bold text-navy-900">
                    {id ? "Meeting point" : "Meeting point"}
                  </p>
                  <p className="text-slate-700">{pkg.meetingPoint.name}</p>
                  <p className="text-xs text-slate-500">{pkg.meetingPoint.note}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="font-bold text-navy-900">
                    {id ? "Termasuk" : "Includes"}
                  </p>
                  <p className="text-slate-700">{pkg.includes.join(", ")}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-navy-900">
                  {id ? "Jadwal 2027 terdekat" : "Nearest 2027 departures"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pkg.schedule2027.slice(0, 6).map((s) => (
                    <span
                      key={s.label}
                      className="rounded-full bg-navy-100 px-3 py-1 text-xs font-semibold text-navy-900"
                      title={s.note ?? ""}
                    >
                      {s.label}
                      {s.note ? " *" : ""}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={savePlan}
                  className="rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"
                >
                  {saved
                    ? id
                      ? "✅ Tersimpan"
                      : "✅ Saved"
                    : id
                      ? "💾 Simpan rencana"
                      : "💾 Save plan"}
                </button>
                <Link
                  href={`/trip?pkg=${pkg.id}${date ? `&date=${date}` : ""}${travellers ? `&pax=${travellers}` : ""}`}
                  className="rounded-full bg-gold-400 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-gold-500"
                >
                  {id ? "Buat halaman trip →" : "Build trip page →"}
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-extrabold text-navy-900">
                {id ? `Draf Custom — ${customDest} ${customDays} hari` : `Custom draft — ${customDest} ${customDays} days`}
              </h2>
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                {id
                  ? "⚠️ Ini draf estimasi dari daftar destinasi — harga dan jadwal final dikonfirmasi via WhatsApp."
                  : "⚠️ This is a draft estimate from the stop library — final price and dates are confirmed via WhatsApp."}
              </p>
              <div className="space-y-3">
                {customPlan.map((d) => (
                  <div key={d.day} className="rounded-xl border border-slate-200 p-3">
                    <p className="font-bold text-navy-900">
                      {id ? `Hari ${d.day}` : `Day ${d.day}`} — {d.title}
                    </p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-700">
                      {d.stops.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button
                onClick={savePlan}
                className="rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"
              >
                {saved ? "✅ Tersimpan" : "💾 Simpan rencana"}
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Memuat…</p>}>
      <Generator />
    </Suspense>
  );
}
