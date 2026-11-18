// Departure-day mode (Feature 4, R4).
// Trip picker + departure checklist + headcount + Leaflet meeting-point
// map + WhatsApp broadcast generator. No login, no backend — all state
// in localStorage. Data (packages, meeting points) from packages.ts only.
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  PACKAGES,
  getPackage,
  waLink,
  type MeetingPoint,
  type PackageId,
} from "@/lib/packages";
import { useLang, type DictKey } from "@/lib/i18n";

// Leaflet cannot SSR — load the map client-side only.
const MeetingMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
      Memuat peta…
    </div>
  ),
});

const LS_TRIP = "maya-harih-trip";
const LS_CHECKLIST = "maya-harih-checklist";
const LS_HEADCOUNT = "maya-harih-headcount";
const LS_MESSAGE = "maya-harih-message";

const FIXED_ITEMS: DictKey[] = [
  "hhCheckPassport",
  "hhCheckTicket",
  "hhCheckCash",
  "hhCheckMedicine",
  "hhCheckClothes",
  "hhCheckCharger",
  "hhCheckDocs",
  "hhCheckWater",
];

const MEETING_POINTS: MeetingPoint[] = [
  getPackage("singapura").meetingPoint, // Bandara Changi
  getPackage("malaysia").meetingPoint, // KLIA
];

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function Counter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
      <span className="text-sm font-semibold text-navy-900">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Kurangi ${label}`}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="h-8 w-8 rounded-full bg-navy-100 text-lg font-bold text-navy-900 hover:bg-navy-50"
        >
          −
        </button>
        <span className="w-8 text-center text-lg font-extrabold text-navy-900">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Tambah ${label}`}
          onClick={() => onChange(Math.min(99, value + 1))}
          className="h-8 w-8 rounded-full bg-navy-900 text-lg font-bold text-white hover:bg-navy-800"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function HariHPage() {
  const { t } = useLang();
  const [loaded, setLoaded] = useState(false);

  // 1. Trip picker
  const [pkgId, setPkgId] = useState<PackageId>("singapura");
  const [date, setDate] = useState("");
  const [meetTime, setMeetTime] = useState("08:00");
  const pkg = getPackage(pkgId);

  // 2. Checklist
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  // 3. Headcount
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [pending, setPending] = useState(0);

  // 4. Map
  const [activePoint, setActivePoint] = useState<MeetingPoint>(
    MEETING_POINTS[0],
  );

  // 5. Broadcast message
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const buildTemplate = (
    p: typeof pkg,
    d: string,
    time: string,
    total: number,
  ) => {
    const dateLine = d
      ? d
      : "—";
    return [
      "Halo, peserta Open Trip Maya! 👋",
      "",
      `📍 Trip: ${p.name} (${p.days}D${p.nights}N)`,
      `📅 Tanggal berangkat: ${dateLine}`,
      `🕗 Jam kumpul: ${time} WIB`,
      `✈️ Meeting point: ${p.meetingPoint.name}`,
      `👥 Peserta: ${total} orang`,
      "",
      "Yang dibawa:",
      "• Paspor (min. 6 bulan)",
      "• Tiket pesawat",
      "• Uang tunai/kartu",
      "• Obat pribadi",
      "• Charger/powerbank",
      "",
      "Sampai jumpa di bandara! ✈️",
      "— Tour Leader, Open Trip Maya",
    ].join("\n");
  };

  // Load persisted state once.
  useEffect(() => {
    const trip = readJson<{ pkgId: PackageId; date: string; meetTime: string }>(
      LS_TRIP,
      { pkgId: "singapura", date: "", meetTime: "08:00" },
    );
    const list = readJson<{ checked: Record<string, boolean>; custom: string[] }>(
      LS_CHECKLIST,
      { checked: {}, custom: [] },
    );
    const head = readJson(
      LS_HEADCOUNT,
      { adults: 0, children: 0, confirmed: 0, pending: 0 },
    );
    const savedMsg = localStorage.getItem(LS_MESSAGE) ?? "";
    setPkgId(trip.pkgId);
    setDate(trip.date);
    setMeetTime(trip.meetTime || "08:00");
    setChecked(list.checked);
    setCustomItems(list.custom);
    setAdults(head.adults);
    setChildren(head.children);
    setConfirmed(head.confirmed);
    setPending(head.pending);
    setActivePoint(getPackage(trip.pkgId).meetingPoint);
    setMessage(
      savedMsg ||
        buildTemplate(getPackage(trip.pkgId), trip.date, trip.meetTime || "08:00", head.adults + head.children),
    );
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change (after the initial load).
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      LS_TRIP,
      JSON.stringify({ pkgId, date, meetTime }),
    );
  }, [loaded, pkgId, date, meetTime]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      LS_CHECKLIST,
      JSON.stringify({ checked, custom: customItems }),
    );
  }, [loaded, checked, customItems]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      LS_HEADCOUNT,
      JSON.stringify({ adults, children, confirmed, pending }),
    );
  }, [loaded, adults, children, confirmed, pending]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(LS_MESSAGE, message);
  }, [loaded, message]);

  const allItems = [...FIXED_ITEMS.map((k) => t(k)), ...customItems];
  const doneCount = allItems.filter((label) => checked[label]).length;
  const total = adults + children;

  const toggleItem = (label: string) =>
    setChecked((prev) => ({ ...prev, [label]: !prev[label] }));

  const addCustomItem = () => {
    const label = newItem.trim();
    if (!label || allItems.includes(label)) return;
    setCustomItems((prev) => [...prev, label]);
    setNewItem("");
  };

  const removeCustomItem = (label: string) => {
    setCustomItems((prev) => prev.filter((i) => i !== label));
    setChecked((prev) => {
      const next = { ...prev };
      delete next[label];
      return next;
    });
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = message;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const pickPackage = (id: PackageId) => {
    setPkgId(id);
    setActivePoint(getPackage(id).meetingPoint);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-900">
          {t("hhTitle")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t("hhSub")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1. Pick trip */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-navy-900">
            1. {t("hhPickTrip")}
          </h2>
          <div>
            <label className="text-sm font-bold text-navy-900">
              {t("hhPackage")}
            </label>
            <select
              value={pkgId}
              onChange={(e) => pickPackage(e.target.value as PackageId)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {PACKAGES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.days}D{p.nights}N · {p.priceLabel}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-navy-900">
                {t("hhDate")}
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
                {t("hhMeetTime")}
              </label>
              <input
                type="time"
                value={meetTime}
                onChange={(e) => setMeetTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="rounded-xl bg-navy-50 px-4 py-3 text-sm">
            <p className="font-bold text-navy-900">{t("meetingPoint")}</p>
            <p className="text-slate-700">{pkg.meetingPoint.name}</p>
            <p className="text-xs text-slate-500">{pkg.meetingPoint.note}</p>
          </div>
        </section>

        {/* 2. Checklist */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-extrabold text-navy-900">
              2. {t("hhChecklist")}
            </h2>
            <span className="text-sm font-bold text-navy-900">
              {doneCount}/{allItems.length} {t("hhDone")}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gold-400 transition-all"
              style={{
                width: `${allItems.length ? (doneCount / allItems.length) * 100 : 0}%`,
              }}
            />
          </div>
          <ul className="space-y-2">
            {allItems.map((label) => {
              const isCustom = customItems.includes(label);
              return (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={!!checked[label]}
                    onChange={() => toggleItem(label)}
                    className="h-5 w-5 accent-[#0b2447]"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      checked[label]
                        ? "text-slate-400 line-through"
                        : "text-slate-700"
                    }`}
                  >
                    {label}
                  </span>
                  {isCustom && (
                    <button
                      type="button"
                      aria-label={`Hapus ${label}`}
                      onClick={() => removeCustomItem(label)}
                      className="rounded-full px-2 py-0.5 text-sm font-bold text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
              placeholder={t("hhAddItemPh")}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addCustomItem}
              className="shrink-0 rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"
            >
              {t("hhAdd")}
            </button>
          </div>
        </section>

        {/* 3. Headcount */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-navy-900">
            3. {t("hhHeadcount")}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <Counter
              label={t("hhAdults")}
              value={adults}
              onChange={setAdults}
            />
            <Counter
              label={t("hhChildren")}
              value={children}
              onChange={setChildren}
            />
            <Counter
              label={t("hhConfirmed")}
              value={confirmed}
              onChange={setConfirmed}
            />
            <Counter
              label={t("hhPending")}
              value={pending}
              onChange={setPending}
            />
          </div>
          <div className="rounded-xl bg-navy-50 px-4 py-3 text-sm">
            <p>
              <strong>
                {t("hhTotal")}: {total} {t("people")}
              </strong>{" "}
              · {t("hhConfirmed")}: {confirmed}
            </p>
            {total < pkg.minPeople && (
              <p className="mt-1 font-semibold text-amber-700">
                ⚠️ {t("hhMinWarn")}: {pkg.minPeople} {t("people")} —{" "}
                {t("hhTotal")} {total}/{pkg.minPeople}
              </p>
            )}
          </div>
        </section>

        {/* 4. Map */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-navy-900">
            4. {t("hhMap")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {MEETING_POINTS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActivePoint(p)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  activePoint.name === p.name
                    ? "bg-navy-900 text-white"
                    : "border border-slate-300 bg-white text-navy-900 hover:bg-navy-50"
                }`}
              >
                {p.name.includes("Changi") ? t("hhShowChangi") : t("hhShowKlia")}
              </button>
            ))}
          </div>
          <MeetingMap points={MEETING_POINTS} active={activePoint} />
          <p className="text-sm text-slate-700">
            <strong>{activePoint.name}</strong> — {activePoint.note}
          </p>
        </section>
      </div>

      {/* 5. WhatsApp broadcast */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold text-navy-900">
          5. {t("hhBroadcast")}
        </h2>
        <p className="text-sm text-slate-500">{t("hhTemplateHint")}</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={12}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-relaxed"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setMessage(buildTemplate(pkg, date, meetTime, total))
            }
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-navy-900 hover:bg-navy-50"
          >
            {t("hhReloadTemplate")}
          </button>
          <button
            type="button"
            onClick={copyMessage}
            className="rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"
          >
            {copied ? `✅ ${t("hhCopied")}` : `📋 ${t("hhCopy")}`}
          </button>
          <a
            href={waLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold-400 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-gold-500"
          >
            {`💬 ${t("hhSendWa")}`}
          </a>
        </div>
        <p className="text-xs text-slate-500">{t("hhWaNote")}</p>
      </section>
    </div>
  );
}
