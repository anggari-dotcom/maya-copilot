// Trip share encoding — Feature 2 (R2).
// A trip page is fully described by a small JSON object, base64url-encoded
// into the `?d=` query param of /trip/view. Zero backend, zero storage:
// the link itself IS the data. All values are validated on decode so a
// tampered or truncated link shows a friendly error instead of crashing.
import { PACKAGES, type PackageId } from "./packages";

export interface TripData {
  title: string;
  pkgId: PackageId;
  date: string; // "" = not set yet; otherwise YYYY-MM-DD or a free label
  pax: number;
  priceIdr: number;
  meetingPoint: string;
  includes: string[];
  notes: string;
}

const VALID_PKG_IDS = new Set<string>(PACKAGES.map((p) => p.id));

export function isValidPkgId(id: string): id is PackageId {
  return VALID_PKG_IDS.has(id);
}

export function encodeTrip(data: TripData): string {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeTrip(encoded: string | null): TripData | null {
  if (!encoded) return null;
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    if (typeof o.title !== "string" || !o.title.trim()) return null;
    if (typeof o.pkgId !== "string" || !isValidPkgId(o.pkgId)) return null;
    if (typeof o.priceIdr !== "number" || !Number.isFinite(o.priceIdr) || o.priceIdr <= 0)
      return null;
    if (typeof o.pax !== "number" || !Number.isFinite(o.pax) || o.pax < 1) return null;
    if (!Array.isArray(o.includes) || !o.includes.every((x) => typeof x === "string"))
      return null;
    return {
      title: o.title.trim().slice(0, 200),
      pkgId: o.pkgId,
      date: typeof o.date === "string" ? o.date.slice(0, 100) : "",
      pax: Math.min(Math.floor(o.pax), 100),
      priceIdr: Math.floor(o.priceIdr),
      meetingPoint: typeof o.meetingPoint === "string" ? o.meetingPoint.slice(0, 200) : "",
      includes: (o.includes as string[]).map((s) => s.slice(0, 100)).slice(0, 20),
      notes: typeof o.notes === "string" ? o.notes.slice(0, 1000) : "",
    };
  } catch {
    return null;
  }
}

/** Human-readable date (id-ID) for an ISO date; falls back to the raw label. */
export function formatTripDate(date: string): string {
  if (!date) return "";
  const d = new Date(date.length === 10 ? `${date}T00:00:00` : date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Prefilled WhatsApp message (Bahasa Indonesia) summarising the trip. */
export function buildTripWaText(data: TripData, shareUrl: string): string {
  const lines = [
    `Halo, saya mau tanya tentang trip ini:`,
    ``,
    `📌 ${data.title}`,
    data.date ? `📅 ${formatTripDate(data.date)}` : `📅 Tanggal menyusul`,
    `👥 ${data.pax} orang`,
    `💰 Rp${data.priceIdr.toLocaleString("id-ID")} /orang`,
    `📍 Meeting point: ${data.meetingPoint || "-"}`,
  ];
  if (data.includes.length > 0) lines.push(`✅ Termasuk: ${data.includes.join(", ")}`);
  if (data.notes.trim()) lines.push(`📝 ${data.notes.trim()}`);
  lines.push(``, `🔗 ${shareUrl}`);
  return lines.join("\n");
}
