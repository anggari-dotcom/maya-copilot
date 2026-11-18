// SOURCE OF TRUTH — data paket asli Open Trip Maya (Angga).
// Harga, jadwal, include, dan meeting point di sini adalah data nyata 2027.
// Jangan ubah tanpa sumber. Yang belum ditetapkan: tulis "Tanya via WA".

export type PackageId = "singapura" | "malaysia" | "dua-negara";

export interface MeetingPoint {
  name: string;
  lat: number;
  lng: number;
  note: string;
}

export interface DayPlan {
  day: number;
  title: string;
  stops: string[];
}

export interface TripPackage {
  id: PackageId;
  name: string;
  subtitle: string;
  days: number;
  nights: number;
  priceIdr: number;
  priceLabel: string; // e.g. "Rp 2,5 jt/org" / "Mulai Rp 3,5 jt/org"
  priceNote?: string;
  includes: string[];
  excludes: string[];
  meetingPoint: MeetingPoint;
  accommodation: string;
  transport: string;
  minPeople: number;
  downPaymentIdr?: number; // undefined = belum ditetapkan -> "Tanya via WA"
  fullPaymentDeadline?: string;
  cancelPolicy?: string;
  itinerary: DayPlan[];
  schedule2027: { label: string; note?: string }[];
  earlyBird?: { dpIdr: number; dpNormalIdr: number; until: string; trips: string };
}

export const WA_NUMBER = "6281228290989";
export const WA_DISPLAY = "0812 2829 0989";
export const waLink = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const PACKAGES: TripPackage[] = [
  {
    id: "singapura",
    name: "Open Trip Singapura",
    subtitle: "Merlion – Marina Bay – Gardens by the Bay",
    days: 3,
    nights: 2,
    priceIdr: 2500000,
    priceLabel: "Rp 2,5 jt/org",
    includes: ["Hostel", "Transport", "SGAC", "Tour Leader"],
    excludes: [
      "Tiket pesawat PP",
      "Makan",
      "Tiket masuk wisata",
      "Asuransi",
      "Keperluan pribadi",
    ],
    meetingPoint: {
      name: "Bandara Changi, Singapura",
      lat: 1.36,
      lng: 103.99,
      note: "Berangkat dari kota mana saja yang punya penerbangan ke Singapura.",
    },
    accommodation: "Hostel area Bugis / Chinatown",
    transport: "MRT & bus umum",
    minPeople: 4,
    downPaymentIdr: 1000000,
    fullPaymentDeadline: "H-14",
    cancelPolicy: "Refund 50%",
    itinerary: [
      {
        day: 1,
        title: "Ikon Singapura",
        stops: ["Merlion", "Marina Bay", "Gardens by the Bay (malam)"],
      },
      {
        day: 2,
        title: "Sentosa",
        stops: ["Sentosa", "Universal Studios (tiket dibeli peserta)"],
      },
      {
        day: 3,
        title: "Pulang",
        stops: ["Jewel Changi", "Pulang (jadwal fleksibel)"],
      },
    ],
    schedule2027: [
      { label: "29–31 Jan" },
      { label: "26–28 Feb" },
      { label: "26–28 Mar" },
      { label: "23–25 Apr" },
      { label: "28–30 Mei" },
      { label: "25–27 Jun" },
      { label: "30 Jul–1 Agu" },
      { label: "27–29 Agu" },
      { label: "24–26 Sep" },
      { label: "29–31 Okt" },
      { label: "26–28 Nov" },
      { label: "24–26 Des", note: "Periode Natal — konfirmasi dulu" },
    ],
    earlyBird: {
      dpIdr: 500000,
      dpNormalIdr: 1000000,
      until: "30 Nov 2026",
      trips: "Trip Januari 2027",
    },
  },
  {
    id: "malaysia",
    name: "Open Trip Malaysia",
    subtitle: "Menara Kembar Petronas – Batu Caves – Kuliner",
    days: 3,
    nights: 2,
    priceIdr: 2000000,
    priceLabel: "Rp 2 jt/org",
    includes: ["Hotel Bintang 2", "Transport", "MDAC", "Tour Leader"],
    excludes: ["Tiket pesawat PP", "Makan"],
    meetingPoint: {
      name: "KLIA, Kuala Lumpur",
      lat: 2.7456,
      lng: 101.7099,
      note: "Hotel bisa di area KL mana saja.",
    },
    accommodation: "Hotel bintang 2 area Kuala Lumpur",
    transport: "Transportasi publik",
    minPeople: 4,
    // DP / pelunasan / refund Malaysia belum dikonfirmasi terpisah:
    // tampilkan "Tanya via WA" (jangan salin aturan Singapura).
    itinerary: [
      {
        day: 1,
        title: "Kuala Lumpur",
        stops: ["Menara Kembar Petronas", "Kuala Lumpur"],
      },
      {
        day: 2,
        title: "Batu Caves & Kuliner",
        stops: ["Batu Caves", "Kuliner khas"],
      },
      {
        day: 3,
        title: "Belanja & Pulang",
        stops: ["Belanja", "Pulang (jadwal fleksibel)"],
      },
    ],
    schedule2027: [
      { label: "1–3 Jan", note: "Termasuk Tahun Baru" },
      { label: "5–7 Feb" },
      { label: "5–7 Mar" },
      { label: "2–4 Apr" },
      { label: "7–9 Mei" },
      { label: "4–6 Jun" },
      { label: "2–4 Jul" },
      { label: "6–8 Agu" },
      { label: "3–5 Sep" },
      { label: "1–3 Okt" },
      { label: "5–7 Nov" },
      { label: "3–5 Des" },
    ],
    earlyBird: {
      dpIdr: 500000,
      dpNormalIdr: 1000000,
      until: "30 Nov 2026",
      trips: "Trip Januari 2027",
    },
  },
  {
    id: "dua-negara",
    name: "Open Trip 2 Negara",
    subtitle: "Singapura & Malaysia",
    days: 4,
    nights: 3,
    priceIdr: 3500000,
    priceLabel: "Mulai Rp 3,5 jt/org",
    priceNote: "Harga mulai — tergantung tanggal & jumlah peserta.",
    includes: [
      "Transport Publik",
      "Hotel Bintang 3",
      "Sarapan",
      "Tour Leader",
      "SGAC",
      "MDAC",
    ],
    excludes: ["Tiket pesawat PP", "Makan (di luar sarapan)"],
    meetingPoint: {
      name: "Bandara Changi, Singapura",
      lat: 1.36,
      lng: 103.99,
      note: "Berangkat dari kota mana saja yang punya penerbangan ke Singapura.",
    },
    accommodation: "Hotel bintang 3",
    transport: "Transportasi publik",
    minPeople: 4,
    // DP & tenggat pelunasan 2 Negara BELUM ditetapkan — tanya via WA.
    itinerary: [
      {
        day: 1,
        title: "Singapura",
        stops: [
          "Jewel Changi",
          "Merlion",
          "Gardens by the Bay",
          "Marina Bay Sands",
          "Universal Studios",
        ],
      },
      {
        day: 2,
        title: "Genting Highlands",
        stops: ["Genting Highlands", "Cable Car Awana SkyWay"],
      },
      {
        day: 3,
        title: "Kuala Lumpur",
        stops: [
          "Menara Kembar Petronas",
          "Batu Caves",
          "Chinatown",
          "Bukit Bintang",
        ],
      },
      {
        day: 4,
        title: "Waktu Bebas",
        stops: ["Waktu bebas — jalan santai & belanja sebelum pulang"],
      },
    ],
    schedule2027: [
      { label: "14–17 Jan" },
      { label: "18–21 Feb" },
      { label: "18–21 Mar" },
      { label: "15–18 Apr" },
      { label: "13–16 Mei" },
      { label: "17–20 Jun" },
      { label: "15–18 Jul" },
      { label: "12–15 Agu" },
      { label: "16–19 Sep" },
      { label: "14–17 Okt" },
      { label: "18–21 Nov" },
      { label: "16–19 Des" },
    ],
    earlyBird: {
      dpIdr: 500000,
      dpNormalIdr: 1000000,
      until: "30 Nov 2026",
      trips: "Trip Januari 2027",
    },
  },
];

export const getPackage = (id: PackageId): TripPackage =>
  PACKAGES.find((p) => p.id === id)!;

export const formatIdr = (n: number) =>
  "Rp" + n.toLocaleString("id-ID");

// ---- FAQ / knowledge base for the Q&A (answers must come from here) ----
export interface FaqItem {
  q: string;
  a: string;
  tags: string[];
}

export const FAQ: FaqItem[] = [
  {
    q: "Berapa harga Open Trip Singapura?",
    a: "Open Trip Singapura 3D2N harganya Rp 2,5 jt per orang. Belum termasuk tiket pesawat PP, makan, tiket masuk wisata, asuransi, dan keperluan pribadi. Sudah termasuk hostel, transport, SGAC, dan tour leader.",
    tags: ["harga", "singapura", "price", "biaya", "berapa"],
  },
  {
    q: "Berapa harga Open Trip Malaysia?",
    a: "Open Trip Malaysia 3D2N harganya Rp 2 jt per orang. Belum termasuk tiket pesawat PP dan makan. Sudah termasuk hotel bintang 2, transport publik, MDAC, dan tour leader.",
    tags: ["harga", "malaysia", "price", "biaya", "berapa"],
  },
  {
    q: "Berapa harga Open Trip 2 Negara?",
    a: "Open Trip 2 Negara 4D3N harganya mulai Rp 3,5 jt per orang. Sudah termasuk transport publik, hotel bintang 3, sarapan, tour leader, SGAC, dan MDAC. Minimal 4 orang berangkat.",
    tags: ["harga", "2 negara", "dua negara", "price", "biaya", "berapa"],
  },
  {
    q: "Berapa DP dan bagaimana cara daftar?",
    a: "DP Open Trip Singapura Rp 1.000.000 per orang, pelunasan paling lambat H-14, pembayaran via transfer bank atau QRIS. Untuk paket Malaysia dan 2 Negara, DP dan tenggat pelunasan silakan tanyakan via WhatsApp. Daftar via DM Instagram @opentrip_maya atau WhatsApp 0812 2829 0989.",
    tags: ["dp", "down payment", "daftar", "bayar", "pembayaran", "booking"],
  },
  {
    q: "Di mana meeting point-nya?",
    a: "Open Trip Singapura dan 2 Negara: meeting point di Bandara Changi, Singapura — peserta berangkat dari kota mana saja yang punya penerbangan ke Singapura. Open Trip Malaysia: meeting point di KLIA, Kuala Lumpur.",
    tags: ["meeting point", "berangkat", "kumpul", "changi", "klia", "bandara"],
  },
  {
    q: "Apa saja yang termasuk dalam paket?",
    a: "Singapura 3D2N: hostel, transport, SGAC, tour leader. Malaysia 3D2N: hotel bintang 2, transport publik, MDAC, tour leader. 2 Negara 4D3N: transport publik, hotel bintang 3, sarapan, tour leader, SGAC, MDAC.",
    tags: ["termasuk", "include", "fasilitas", "dapat apa"],
  },
  {
    q: "Apa yang tidak termasuk?",
    a: "Singapura: tiket pesawat PP, makan, tiket masuk wisata, asuransi, keperluan pribadi. Malaysia: tiket pesawat PP dan makan. 2 Negara: tiket pesawat PP dan makan di luar sarapan.",
    tags: ["tidak termasuk", "exclude", "belum termasuk"],
  },
  {
    q: "Berapa minimal peserta agar trip berangkat?",
    a: "Minimal 4 orang untuk semua paket. Kalau belum mencapai 4 orang, jadwal bisa digabung dengan grup lain atau dipindahkan — tanyakan via WhatsApp.",
    tags: ["minimal", "min", "orang", "berangkat", "kuota"],
  },
  {
    q: "Bagaimana kebijakan pembatalan?",
    a: "Untuk Open Trip Singapura, pembatalan mendapat refund 50%. Untuk paket lainnya, kebijakan pembatalan silakan tanyakan via WhatsApp.",
    tags: ["batal", "cancel", "refund", "pembatalan"],
  },
  {
    q: "Apa yang harus dibawa?",
    a: "Paspor (masih berlaku min. 6 bulan), tiket pesawat, uang tunai / kartu untuk makan dan tiket wisata, pakaian nyaman, alas kaki yang enak untuk jalan, dan obat pribadi bila ada. Detail checklist ada di menu Hari-H.",
    tags: ["bawa", "persiapan", "packing", "paspor", "dokumen"],
  },
  {
    q: "Apakah ada promo Early Bird?",
    a: "Ya — DP cuma Rp 500 ribu (normal Rp 1.000.000) untuk trip Januari 2027: 2 Negara 14–17 Jan, Singapura 29–31 Jan, dan Malaysia 1–3 Jan. Berlaku sampai 30 Nov 2026, minimal 4 orang berangkat.",
    tags: ["promo", "early bird", "diskon", "murah"],
  },
  {
    q: "Kapan jadwal trip 2027?",
    a: "Singapura: akhir bulan, Jumat–Minggu (mis. 29–31 Jan, 26–28 Feb). Malaysia: awal bulan, Jumat–Minggu (mis. 1–3 Jan, 5–7 Feb). 2 Negara: tengah bulan, Kamis–Minggu (mis. 14–17 Jan, 18–21 Feb). Jadwal lengkap 12 bulan ada di halaman tiap paket.",
    tags: ["jadwal", "tanggal", "schedule", "kapan"],
  },
];
