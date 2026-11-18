// Shareable trip page — Feature 2 (R2).
// Reads ?d=<base64url JSON>, validates it, and renders the trip.
// A missing, truncated or tampered `d` shows a friendly error, never a crash.
// useSearchParams() must live inside <Suspense> (Next.js 16).
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { waLink } from "@/lib/packages";
import { buildTripWaText, decodeTrip } from "@/lib/trip-share";
import TripCard from "@/components/TripCard";
import { useLang } from "@/lib/i18n";

function TripView() {
  const params = useSearchParams();
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  // Full page URL is only known in the browser (SSR has no window).
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  // Decoded once per `d` value; null = missing / corrupt / invalid shape.
  const trip = useMemo(() => decodeTrip(params.get("d")), [params]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!trip) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <p className="text-4xl">🧳</p>
        <h1 className="mt-3 text-2xl font-extrabold text-navy-900">{t("tripInvalid")}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("tripInvalidSub")}</p>
        <Link
          href="/trip"
          className="mt-6 inline-block rounded-full bg-gold-400 px-5 py-2.5 text-sm font-bold text-navy-900 hover:bg-gold-500"
        >
          {t("tripBackBuilder")}
        </Link>
      </div>
    );
  }

  const waHref = pageUrl ? waLink(buildTripWaText(trip, pageUrl)) : "#";

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <TripCard
        data={trip}
        actions={
          <>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
            >
              {t("tripWaCta")}
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800"
            >
              {copied ? t("tripCopied") : t("tripCopyLink")}
            </button>
          </>
        }
      />
      <p className="text-center text-xs text-slate-400">
        Open Trip Maya ·{" "}
        <Link href="/trip" className="font-semibold text-navy-900 underline">
          {t("tripBackBuilder")}
        </Link>
      </p>
    </div>
  );
}

export default function TripViewPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-slate-500">Memuat…</p>}>
      <TripView />
    </Suspense>
  );
}
