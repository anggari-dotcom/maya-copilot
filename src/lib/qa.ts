// Local knowledge-base Q&A matcher.
// Answers ONLY from FAQ in src/lib/packages.ts. No hallucinated prices/dates.
// Used by /tanya directly and as the fallback of /api/ask when no Gemini key.

import { FAQ } from "./packages";

const STOP = new Set([
  "apa", "yang", "berapa", "bagaimana", "di", "ke", "dari", "dan", "atau",
  "untuk", "dengan", "adalah", "saya", "kami", "kamu", "nya", "itu", "ini",
  "the", "a", "an", "is", "are", "how", "what", "where", "when", "does",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

export interface KbAnswer {
  answer: string;
  question: string;
  score: number;
}

export function answerFromKb(question: string): KbAnswer | null {
  const qTokens = tokens(question);
  if (qTokens.length === 0) return null;
  let best: KbAnswer | null = null;
  for (const item of FAQ) {
    const hay = tokens(item.q + " " + item.tags.join(" ") + " " + item.a);
    const haySet = new Set(hay);
    let score = 0;
    for (const tok of qTokens) {
      if (haySet.has(tok)) score += 2;
      else if (hay.some((h) => h.startsWith(tok) || tok.startsWith(h))) score += 1;
    }
    // Tag hits weigh more (they are curated keywords).
    for (const tag of item.tags) {
      if (question.toLowerCase().includes(tag)) score += 2;
    }
    if (!best || score > best.score) {
      best = { answer: item.a, question: item.q, score };
    }
  }
  if (!best || best.score < 2) return null;
  return best;
}

export const KB_FALLBACK =
  "Maaf, saya belum punya jawaban dari data paket untuk pertanyaan itu. " +
  "Coba tanyakan soal harga, DP, meeting point, jadwal, yang termasuk, atau apa yang dibawa — " +
  "atau langsung chat Angga via WhatsApp 0812 2829 0989.";
