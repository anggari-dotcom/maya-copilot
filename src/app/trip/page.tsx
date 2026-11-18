// Trip page builder — Feature 2 (R2).
// Form pre-filled from ?pkg= / ?date= / ?pax= (linked from /itinerary).
// Price, meeting point and inclusions auto-fill from the chosen package;
// the price stays manually editable. "Buat link trip" encodes the trip as
// base64url JSON in /trip/view?d=... — no backend, the link IS the data.
"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PACKAGES,
  formatIdr,
  getPackage,
  waLink,
  type PackageId,
} from "@/lib/packages";
import {
  buildTripWaText,
  encodeTrip,
  isValidPkgId,
  type TripData,
} from "@/lib/trip-share";
import TripCard from "@/components/TripCard";
import { useLang } from "@/lib/i18n";

function Builder() {
  const params = useSearchParams();
  const { t } = useLang();

  const initialPkg: PackageId = isValidPkgId(params.get("pkg") ?? "")
    ? (params.get("pkg") as PackageId)
    : "singapura";
  const initialPax = Math.min(
    Math.max(Number(params.get("pax")) || 4, 1),
    40,
  );

  const [pkgId, setPkgId] = useState<PackageId>(initialPkg);
  const [title, setTitle] = useState(() => getPackage(initialPkg).name);
  const [date, setDate] = useState(params.get("date") ?? "");
  const [pax, setPax] = useState(initialPax);
  const [price, setPrice] = useState(() => String(getPackage(initialPkg).priceIdr));
  const [meetingPoint, setMeetingPoint] = useState(
    () => getPackage(initialPkg).meetingPoint.name,
  );
  const [selectedIncludes, setSelectedIncludes] = useState<string[]>(
    () => [...getPackage(initialPkg).includes],
  );
  const [notes, setNotes] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const pkg = getPackage(pkgId);
  const priceNum = Number(price.replace(/[^0-9]/g, "")) || 0;

  // Live trip data (also drives the preview below the form).
  const tripData: TripData = useMemo(
    () => ({
      title: title.trim() || pkg.name,
      pkgId,
      date,
      pax,
      priceIdr: priceNum,
      meetingPoint: meetingPoint.trim() || pkg.meetingPoint.name,
      includes: selectedIncludes,
      notes,
    }),
    [title, pkg, pkgId, date, pax, priceNum, meetingPoint, selectedIncludes, notes],
  );

  const changePackage = (id: PackageId) => {
    const next = getPackage(id);
    setPkgId(id);
    setTitle(next.name);
    setPrice(String(next.priceIdr));
    setMeetingPoint(next.meetingPoint.name);
    setSelectedIncludes([...next.includes]);
    setShareUrl("");
  };

  const toggleInclude = (inc: string) => {
    setSelectedIncludes((prev) =>
      prev.includes(inc) ? prev.filter((x) => x !== inc) : [...prev, inc],
    );
    setShareUrl("");
  };

  const createLink = () => {
    const encoded = encodeTrip(tripData);
    setShareUrl(`${window.location.origin}/trip/view?d=${encoded}`);
    setCopied(false);
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback for browsers without clipboard permission.
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const waHref = shareUrl ? waLink(buildTripWaText(tripData, shareUrl)) : "";

  const inputCls =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-900">{t("tripBuilderTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("tripBuilderSub")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div>
            <label className="text-sm font-bold text-navy-900">{t("tripTitleLabel")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("tripTitlePh")}
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-navy-900">{t("tripPackageLabel")}</label>
            <div className="mt-2 grid gap-2">
              {PACKAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => changePackage(p.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold ${
                    pkgId === p.id
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-slate-300 bg-white text-navy-900 hover:bg-navy-50"
                  }`}
                >
                  {p.name} · {p.days}D{p.nights}N · {p.priceLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-navy-900">{t("tripDateLabel")}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-navy-900">{t("tripPaxLabel")}</label>
              <input
                type="number"
                min={1}
                max={40}
                value={pax}
                onChange={(e) => setPax(Number(e.target.value) || 1)}
                className={inputCls}
              />
              <p className="mt-1 text-xs text-slate-500">
                {t("minPeople")}: {pkg.minPeople} {t("people")}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-navy-900">{t("tripPriceLabel")}</label>
            <input
              type="text"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-slate-500">{t("tripPriceHint")}</p>
            {priceNum > 0 && (
              <p className="mt-1 text-sm text-slate-700">
                {t("tripTotal")}:{" "}
                <strong className="text-navy-900">{formatIdr(priceNum * pax)}</strong>{" "}
                ({pax} × {formatIdr(priceNum)})
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-bold text-navy-900">{t("tripMeetingLabel")}</label>
            <input
              type="text"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <span className="text-sm font-bold text-navy-900">{t("tripIncludesLabel")}</span>
            <div className="mt-2 space-y-2">
              {pkg.includes.map((inc) => (
                <label key={inc} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedIncludes.includes(inc)}
                    onChange={() => toggleInclude(inc)}
                    className="h-4 w-4 accent-[#0b2447]"
                  />
                  {inc}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {t("excludes")}: {pkg.excludes.join(", ")}
            </p>
          </div>

          <div>
            <label className="text-sm font-bold text-navy-900">{t("tripNotesLabel")}</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("tripNotesPh")}
              className={inputCls}
            />
          </div>

          <button
            type="button"
            onClick={createLink}
            disabled={priceNum <= 0}
            className="w-full rounded-full bg-gold-400 px-4 py-2.5 text-sm font-bold text-navy-900 hover:bg-gold-500 disabled:opacity-50"
          >
            {t("tripCreateLink")}
          </button>

          {shareUrl && (
            <div className="space-y-3 rounded-xl bg-navy-50 p-3">
              <p className="text-sm font-bold text-navy-900">✅ {t("tripShareReady")}</p>
              <p className="text-xs break-all text-slate-600">{shareUrl}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  className="rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"
                >
                  {copied ? t("tripCopied") : t("tripCopyLink")}
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#25d366] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  {t("tripWaShare")}
                </a>
                <Link
                  href={`/trip/view?d=${shareUrl.split("?d=")[1]}`}
                  className="rounded-full border border-navy-900 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-navy-50"
                >
                  {t("tripOpenLink")}
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Live preview */}
        <section className="lg:col-span-3">
          <h2 className="mb-3 text-sm font-bold text-navy-900">{t("tripPreview")}</h2>
          <TripCard
            data={tripData}
            actions={
              shareUrl ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#25d366] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  {t("tripWaCta")}
                </a>
              ) : undefined
            }
          />
        </section>
      </div>
    </div>
  );
}

export default function TripPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Memuat…</p>}>
      <Builder />
    </Suspense>
  );
}
