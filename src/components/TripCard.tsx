// Shared trip-page card — used by the builder preview (/trip) and the
// shareable page (/trip/view). Pure presentation; data comes from TripData.
"use client";

import type { ReactNode } from "react";
import { formatIdr, getPackage } from "@/lib/packages";
import { formatTripDate, type TripData } from "@/lib/trip-share";
import { useLang } from "@/lib/i18n";

export default function TripCard({
  data,
  actions,
}: {
  data: TripData;
  actions?: ReactNode;
}) {
  const { t } = useLang();
  const pkg = getPackage(data.pkgId);
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-navy-900 px-5 py-5 text-white">
        <p className="text-xs font-bold tracking-wide text-gold-400 uppercase">
          Open Trip Maya · {pkg.days}D{pkg.nights}N
        </p>
        <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">{data.title}</h2>
        <p className="mt-1 text-sm text-navy-100">{pkg.name} — {pkg.subtitle}</p>
      </div>

      <div className="space-y-4 px-5 py-5">
        {/* Key facts */}
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div className="rounded-xl bg-navy-50 p-3">
            <dt className="text-xs font-bold text-slate-500">{t("tripDateLabel")}</dt>
            <dd className="mt-0.5 font-bold text-navy-900">
              {data.date ? formatTripDate(data.date) : t("tripNoDate")}
            </dd>
          </div>
          <div className="rounded-xl bg-navy-50 p-3">
            <dt className="text-xs font-bold text-slate-500">{t("tripPaxLabel")}</dt>
            <dd className="mt-0.5 font-bold text-navy-900">
              {data.pax} {t("people")}
            </dd>
          </div>
          <div className="rounded-xl bg-gold-400/20 p-3">
            <dt className="text-xs font-bold text-slate-500">
              {t("tripPriceLabel")}
            </dt>
            <dd className="mt-0.5 font-bold text-navy-900">{formatIdr(data.priceIdr)}</dd>
          </div>
          <div className="rounded-xl bg-navy-50 p-3">
            <dt className="text-xs font-bold text-slate-500">{t("tripTotal")}</dt>
            <dd className="mt-0.5 font-bold text-navy-900">
              {formatIdr(data.priceIdr * data.pax)}
            </dd>
          </div>
        </dl>

        {/* Meeting point */}
        <div className="rounded-xl border border-slate-200 p-3 text-sm">
          <p className="font-bold text-navy-900">📍 {t("meetingPoint")}</p>
          <p className="mt-0.5 text-slate-700">{data.meetingPoint || pkg.meetingPoint.name}</p>
          <p className="text-xs text-slate-500">{pkg.meetingPoint.note}</p>
        </div>

        {/* Includes / excludes */}
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="font-bold text-navy-900">✅ {t("includes")}</p>
            {data.includes.length > 0 ? (
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-slate-700">
                {data.includes.map((inc) => (
                  <li key={inc}>{inc}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-slate-500">—</p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="font-bold text-navy-900">❌ {t("excludes")}</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-slate-700">
              {pkg.excludes.map((exc) => (
                <li key={exc}>{exc}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* DP / min people */}
        <p className="text-xs text-slate-500">
          {t("dp")}:{" "}
          {pkg.downPaymentIdr ? formatIdr(pkg.downPaymentIdr) : t("tripAskWa")}
          {pkg.fullPaymentDeadline ? ` · ${t("fullPayment")}: ${pkg.fullPaymentDeadline}` : ""}
          {` · ${t("minPeople")}: ${pkg.minPeople} ${t("people")}`}
        </p>

        {/* Notes */}
        {data.notes.trim() && (
          <div className="rounded-xl bg-amber-50 p-3 text-sm">
            <p className="font-bold text-navy-900">📝 {t("tripNotesLabel")}</p>
            <p className="mt-0.5 whitespace-pre-wrap text-slate-700">{data.notes.trim()}</p>
          </div>
        )}

        {actions && <div className="flex flex-wrap gap-2 pt-1">{actions}</div>}
      </div>
    </article>
  );
}
