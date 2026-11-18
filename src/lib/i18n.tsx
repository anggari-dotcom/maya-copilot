// Bilingual UI dictionary (ID default + EN). All UI strings go through `t()`.
// Prices/dates are NOT translated — they come from src/lib/packages.ts.
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Lang = "id" | "en";

const DICT = {
  navHome: { id: "Beranda", en: "Home" },
  navItinerary: { id: "Itinerary", en: "Itinerary" },
  navTrip: { id: "Buat Trip", en: "Build Trip" },
  navAsk: { id: "Tanya Maya", en: "Ask Maya" },
  navDayH: { id: "Hari-H", en: "Trip Day" },
  tagline: {
    id: "Copilot AI untuk tour leader open trip",
    en: "AI copilot for open-trip tour leaders",
  },
  heroTitle: {
    id: "Rencanakan trip. Jawab peserta. Berangkat dengan tenang.",
    en: "Plan the trip. Answer travellers. Depart with confidence.",
  },
  heroSub: {
    id: "Maya membantu tour leader membuat itinerary, halaman trip, menjawab pertanyaan peserta, dan menyiapkan hari keberangkatan — dengan data paket asli Open Trip Maya.",
    en: "Maya helps tour leaders build itineraries, trip pages, answer traveller questions, and prepare departure day — using Open Trip Maya's real package data.",
  },
  packagesTitle: { id: "Paket Open Trip 2027", en: "2027 Open Trip Packages" },
  packagesSub: {
    id: "Harga, jadwal, dan fasilitas asli — tanpa karangan.",
    en: "Real prices, schedules, and inclusions — nothing made up.",
  },
  includes: { id: "Termasuk", en: "Includes" },
  excludes: { id: "Belum termasuk", en: "Not included" },
  meetingPoint: { id: "Meeting point", en: "Meeting point" },
  minPeople: { id: "Min. berangkat", en: "Min. to depart" },
  people: { id: "orang", en: "people" },
  schedule: { id: "Jadwal 2027", en: "2027 Schedule" },
  viewItinerary: { id: "Lihat itinerary", en: "View itinerary" },
  buildTrip: { id: "Buat halaman trip", en: "Build trip page" },
  askWa: { id: "Tanya via WhatsApp", en: "Ask via WhatsApp" },
  dp: { id: "DP", en: "Down payment" },
  fullPayment: { id: "Pelunasan", en: "Full payment" },
  cancel: { id: "Pembatalan", en: "Cancellation" },
  perPerson: { id: "per orang", en: "per person" },
  earlyBird: { id: "Early Bird", en: "Early Bird" },
  toolsTitle: { id: "Alat untuk tour leader", en: "Tools for tour leaders" },
  hhTitle: { id: "Mode Hari-H", en: "Departure-Day Mode" },
  hhSub: {
    id: "Checklist, hitung peserta, peta meeting point, dan pesan broadcast — semua tersimpan di browser ini.",
    en: "Checklist, headcount, meeting-point map, and broadcast message — all saved in this browser.",
  },
  hhPickTrip: { id: "Pilih trip", en: "Pick a trip" },
  hhPackage: { id: "Paket", en: "Package" },
  hhDate: { id: "Tanggal keberangkatan", en: "Departure date" },
  hhMeetTime: { id: "Jam kumpul", en: "Meeting time" },
  hhChecklist: { id: "Checklist keberangkatan", en: "Departure checklist" },
  hhDone: { id: "selesai", en: "done" },
  hhAddItemPh: { id: "Tambah item sendiri…", en: "Add your own item…" },
  hhAdd: { id: "Tambah", en: "Add" },
  hhCheckPassport: { id: "Paspor (min. 6 bulan)", en: "Passport (min. 6 months valid)" },
  hhCheckTicket: { id: "Tiket pesawat", en: "Flight ticket" },
  hhCheckCash: { id: "Uang tunai/kartu", en: "Cash/card" },
  hhCheckMedicine: { id: "Obat pribadi", en: "Personal medicine" },
  hhCheckClothes: { id: "Pakaian nyaman", en: "Comfortable clothes" },
  hhCheckCharger: { id: "Charger/powerbank", en: "Charger/power bank" },
  hhCheckDocs: { id: "Dokumen SGAC/MDAC", en: "SGAC/MDAC documents" },
  hhCheckWater: { id: "Air minum", en: "Drinking water" },
  hhHeadcount: { id: "Hitung peserta", en: "Headcount" },
  hhAdults: { id: "Dewasa", en: "Adults" },
  hhChildren: { id: "Anak", en: "Children" },
  hhConfirmed: { id: "Terkonfirmasi", en: "Confirmed" },
  hhPending: { id: "Belum terkonfirmasi", en: "Not confirmed yet" },
  hhTotal: { id: "Total peserta", en: "Total travellers" },
  hhMinWarn: { id: "Minimal berangkat", en: "Minimum to depart" },
  hhMap: { id: "Peta meeting point", en: "Meeting-point map" },
  hhShowChangi: { id: "Tampilkan Changi", en: "Show Changi" },
  hhShowKlia: { id: "Tampilkan KLIA", en: "Show KLIA" },
  hhBroadcast: { id: "Pesan broadcast WhatsApp", en: "WhatsApp broadcast message" },
  hhTemplateHint: {
    id: "Edit sesuka hati — tombol di bawah mengisi ulang template dari trip yang dipilih.",
    en: "Edit freely — the button below refills the template from the selected trip.",
  },
  hhReloadTemplate: { id: "Isi ulang template", en: "Refill template" },
  hhCopy: { id: "Salin pesan", en: "Copy message" },
  hhCopied: { id: "Tersalin!", en: "Copied!" },
  hhSendWa: { id: "Kirim via WhatsApp", en: "Send via WhatsApp" },
  hhWaNote: {
    id: "WhatsApp tidak bisa mengirim langsung ke grup dari tautan — salin pesannya lalu tempel ke grup.",
    en: "WhatsApp cannot send directly to a group from a link — copy the message and paste it into the group.",
  },
  footerNote: {
    id: "Dibangun untuk Kiroween 2026 · Data paket: Open Trip Maya · Tanpa login, tanpa pelacakan.",
    en: "Built for Kiroween 2026 · Package data: Open Trip Maya · No login, no tracking.",
  },
  askTitle: { id: "Tanya Maya", en: "Ask Maya" },
  askSub: {
    id: "Tanya soal harga, DP, meeting point, jadwal, atau apa yang dibawa — Maya jawab dari data paket asli.",
    en: "Ask about prices, down payment, meeting points, schedules, or what to bring — Maya answers from the real package data.",
  },
  askPlaceholder: {
    id: "Tulis pertanyaanmu… contoh: Berapa harga Singapura?",
    en: "Type your question… e.g. How much is the Singapore trip?",
  },
  askSend: { id: "Kirim", en: "Send" },
  askTyping: { id: "Maya sedang mengetik…", en: "Maya is typing…" },
  askModeKb: { id: "Mode: Knowledge Base lokal", en: "Mode: Local Knowledge Base" },
  askModeGemini: { id: "Mode: Gemini AI", en: "Mode: Gemini AI" },
  askFaqTitle: {
    id: "Pertanyaan yang sering ditanya — ketuk untuk bertanya",
    en: "Frequently asked — tap to ask",
  },
  askNote: {
    id: "Jawaban berasal dari data paket asli Open Trip Maya 2027. Kalau Maya belum tahu, tanyakan langsung ke Angga via WhatsApp.",
    en: "Answers come from Open Trip Maya's real 2027 package data. If Maya doesn't know, ask Angga directly via WhatsApp.",
  },
  askClear: { id: "Hapus riwayat", en: "Clear history" },
  askEmpty: {
    id: "Belum ada pertanyaan. Coba salah satu pertanyaan di bawah, atau tulis sendiri.",
    en: "No questions yet. Try one of the questions below, or write your own.",
  },
  askYou: { id: "Kamu", en: "You" },
  askError: {
    id: "Maaf, ada gangguan. Coba lagi sebentar lagi.",
    en: "Sorry, something went wrong. Please try again shortly.",
  },
  tripBuilderTitle: { id: "Buat Halaman Trip", en: "Build a Trip Page" },
  tripBuilderSub: {
    id: "Isi detail trip, lalu bagikan lewat satu link — tanpa login, tanpa backend.",
    en: "Fill in the trip details, then share it with a single link — no login, no backend.",
  },
  tripTitleLabel: { id: "Judul trip", en: "Trip title" },
  tripTitlePh: {
    id: "cth. Open Trip Singapura — 29–31 Jan 2027",
    en: "e.g. Open Trip Singapore — 29–31 Jan 2027",
  },
  tripPackageLabel: { id: "Paket", en: "Package" },
  tripDateLabel: { id: "Tanggal trip", en: "Trip date" },
  tripPaxLabel: { id: "Jumlah peserta", en: "Travellers" },
  tripPriceLabel: { id: "Harga per orang (Rp)", en: "Price per person (IDR)" },
  tripPriceHint: {
    id: "Terisi otomatis dari paket — boleh diubah manual.",
    en: "Auto-filled from the package — you can change it.",
  },
  tripMeetingLabel: { id: "Meeting point", en: "Meeting point" },
  tripIncludesLabel: { id: "Yang termasuk", en: "What's included" },
  tripNotesLabel: { id: "Catatan (opsional)", en: "Notes (optional)" },
  tripNotesPh: {
    id: "cth. Bawa paspor min. 6 bulan. Kumpul di Changi pukul 09.00.",
    en: "e.g. Bring a passport valid for 6+ months. Meet at Changi at 09:00.",
  },
  tripCreateLink: { id: "🔗 Buat link trip", en: "🔗 Create trip link" },
  tripShareReady: { id: "Link trip siap dibagikan!", en: "Your trip link is ready to share!" },
  tripCopyLink: { id: "📋 Salin Link", en: "📋 Copy Link" },
  tripCopied: { id: "✅ Link tersalin", en: "✅ Link copied" },
  tripOpenLink: { id: "Buka halaman trip ↗", en: "Open trip page ↗" },
  tripPreview: { id: "Pratinjau halaman trip", en: "Trip page preview" },
  tripWaCta: { id: "💬 Daftar via WhatsApp", en: "💬 Book via WhatsApp" },
  tripWaShare: { id: "💬 Kirim via WhatsApp", en: "💬 Send via WhatsApp" },
  tripInvalid: { id: "Link trip tidak bisa dibuka", en: "This trip link can't be opened" },
  tripInvalidSub: {
    id: "Linknya mungkin rusak atau tidak lengkap. Minta pengirim mengirim ulang link trip yang baru.",
    en: "The link may be broken or incomplete. Ask the sender to share a fresh trip link.",
  },
  tripBackBuilder: { id: "← Buat halaman trip baru", en: "← Build a new trip page" },
  tripNoDate: { id: "Tanggal menyusul", en: "Date to follow" },
  tripTotal: { id: "Total", en: "Total" },
  tripAskWa: { id: "Tanya via WA", en: "Ask via WA" },
  tripLoading: { id: "Memuat…", en: "Loading…" },
} as const;

export type DictKey = keyof typeof DICT;

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "id",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");
  return (
    <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
  );
}

export function useLang() {
  const { lang, setLang } = useContext(LangCtx);
  const t = (key: DictKey): string => DICT[key][lang];
  return { lang, setLang, t };
}
