// POST /api/ask — AI Q&A "Tanya Maya" (Fitur 3, R3).
// Tanpa GEMINI_API_KEY: jawab dari knowledge base lokal (src/lib/qa.ts).
// Dengan GEMINI_API_KEY: panggil Gemini dengan FAQ + ringkasan paket sebagai
// konteks SATU-SATUNYA sumber jawaban — dilarang mengarang harga/tanggal.
// Error Gemini apa pun → graceful fallback ke KB lokal.
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FAQ, PACKAGES, WA_DISPLAY } from "@/lib/packages";
import { answerFromKb, KB_FALLBACK } from "@/lib/qa";

function buildContext(): string {
  const pkgLines = PACKAGES.map((p) => {
    const dp =
      p.downPaymentIdr !== undefined
        ? `DP Rp${p.downPaymentIdr.toLocaleString("id-ID")}`
        : "DP: Tanya via WA";
    const pelunasan = p.fullPaymentDeadline
      ? `, pelunasan ${p.fullPaymentDeadline}`
      : "";
    const batal = p.cancelPolicy ? `, pembatalan: ${p.cancelPolicy}` : "";
    const jadwal = p.schedule2027.map((s) => s.label).join(", ");
    return (
      `- ${p.name} ${p.days}D${p.nights}N: ${p.priceLabel}` +
      `${p.priceNote ? ` (${p.priceNote})` : ""}. ` +
      `Termasuk: ${p.includes.join(", ")}. ` +
      `Tidak termasuk: ${p.excludes.join(", ")}. ` +
      `Meeting point: ${p.meetingPoint.name} (${p.meetingPoint.note}). ` +
      `Akomodasi: ${p.accommodation}. Transport: ${p.transport}. ` +
      `Min. ${p.minPeople} orang berangkat. ${dp}${pelunasan}${batal}. ` +
      `Jadwal 2027: ${jadwal}.`
    );
  }).join("\n");
  const faqLines = FAQ.map((f) => `T: ${f.q}\nJ: ${f.a}`).join("\n");
  return `PAKET OPEN TRIP MAYA 2027:\n${pkgLines}\n\nFAQ:\n${faqLines}`;
}

function answerKb(question: string) {
  const hit = answerFromKb(question);
  if (hit) {
    return NextResponse.json({
      answer: hit.answer,
      source: "kb" as const,
      matchedQuestion: hit.question,
    });
  }
  // qa.ts membuang token <= 2 huruf ("dp", "sgac" dsb. tidak ter-tokenisasi),
  // jadi pertanyaan pendek seperti "berapa dp" lolos dari matcher.
  // Fallback ringan di route (qa.ts TIDAK diubah): cocokkan tag FAQ apa adanya.
  const q = question.toLowerCase();
  // Tag generik (kata tanya) diabaikan — kalau tidak, "berapa" di semua FAQ
  // harga akan mengalahkan kata kunci spesifik seperti "dp".
  const GENERIC = new Set(["berapa", "apa", "bagaimana", "kapan", "di mana"]);
  let bestFaq: (typeof FAQ)[number] | null = null;
  let bestHits = 0;
  for (const item of FAQ) {
    const hits = item.tags.filter(
      (tag) => !GENERIC.has(tag) && q.includes(tag),
    ).length;
    if (hits > bestHits) {
      bestHits = hits;
      bestFaq = item;
    }
  }
  if (bestFaq) {
    return NextResponse.json({
      answer: bestFaq.a,
      source: "kb" as const,
      matchedQuestion: bestFaq.q,
    });
  }
  return NextResponse.json({ answer: KB_FALLBACK, source: "kb" as const });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body harus JSON { question: string }." },
      { status: 400 },
    );
  }
  const question =
    typeof (body as { question?: unknown })?.question === "string"
      ? ((body as { question: string }).question ?? "").trim()
      : "";
  if (!question) {
    return NextResponse.json(
      { error: "Pertanyaan tidak boleh kosong." },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return answerKb(question);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "Kamu Maya, asisten tour leader Open Trip Maya (Singapura & Malaysia). " +
        "Jawab HANYA dari konteks paket dan FAQ yang diberikan di bawah ini, dalam Bahasa Indonesia yang ramah dan ringkas. " +
        "JANGAN PERNAH mengarang harga, tanggal, jadwal, fasilitas, atau kebijakan apa pun — " +
        "pakai hanya angka/tanggal yang tertulis di konteks. " +
        "Jika konteks tidak memuat jawaban, katakan dengan jujur bahwa kamu tidak tahu " +
        `dan arahkan penanya ke WhatsApp Angga ${WA_DISPLAY}. ` +
        "Jangan menjawab topik di luar trip/paket Open Trip Maya; arahkan ke WhatsApp bila ditanya hal lain.",
    });
    const result = await model.generateContent(
      `Konteks (satu-satunya sumber jawaban):\n${buildContext()}\n\nPertanyaan peserta: ${question}`,
    );
    const text = result.response.text().trim();
    if (!text) return answerKb(question);
    const hit = answerFromKb(question);
    return NextResponse.json({
      answer: text,
      source: "gemini" as const,
      ...(hit ? { matchedQuestion: hit.question } : {}),
    });
  } catch (err) {
    console.error("Gemini /api/ask error, fallback ke KB:", err);
    return answerKb(question);
  }
}
