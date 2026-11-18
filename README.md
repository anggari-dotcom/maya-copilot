# Maya — AI Tour Leader Copilot

Copilot AI untuk tour leader open trip: generator itinerary, pembuat halaman
trip yang bisa dibagikan, asisten Q&A Bahasa Indonesia, dan mode hari-H.
Dibangun untuk **Kiroween 2026** (AWS/Kiro, Devpost), kategori **Frankenstein**.

Data paket: **Open Trip Maya** (Singapura 3D2N, Malaysia 3D2N, 2 Negara 4D3N)
— harga, jadwal, dan fasilitas asli. Tanpa login, tanpa pelacakan.

🔗 **Live Demo:** https://maya-copilot.vercel.app

## Masalahnya

Seorang tour leader open trip ditanya hal yang sama di setiap trip: harganya
berapa, jadwalnya kapan, ketemu di mana. Dan di hari-H, peserta masih dicatat
di kertas.

## Yang dibangun

Maya adalah copilot web untuk tour leader, dengan data paket asli:

- **Generator itinerary** — pilih paket, tanggal, dan jumlah peserta; total harga langsung terhitung dari itinerary asli
- **Halaman trip yang bisa dibagikan** — link shareable + kirim ringkasan trip ke WhatsApp peserta
- **Tanya Maya** — Q&A yang menjawab dari knowledge base paket asli (opsional Gemini), tidak mengarang harga atau tanggal
- **Mode Hari-H** — checklist, hitung peserta (dengan peringatan min. 4 orang), peta meeting point, dan generator pesan broadcast WhatsApp

## Tech stack

Next.js 16, React 19, TypeScript, Tailwind v4, Leaflet/OpenStreetMap. Tanpa
login, tanpa pelacakan.

## Screenshot

11 screenshot (desktop + mobile) ada di folder `screenshots/` — belum ikut
ter-push ke GitHub karena push kemarin hanya berisi file teks.

## Jalankan lokal

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # wajib lolos sebelum submit
```

## Fitur

| Rute | Fitur |
| --- | --- |
| `/` | Beranda: 3 paket asli + kartu fitur |
| `/itinerary` | Generator itinerary (paket asli / custom, tanggal, peserta, budget) |
| `/trip` | Pembuat halaman trip → link shareable |
| `/trip/view?d=...` | Halaman trip yang dibagikan + tombol WhatsApp |
| `/tanya` | Asisten Q&A dari knowledge base paket |
| `/hari-h` | Checklist, hitung peserta, peta meeting point, broadcast WA |
| `/api/ask` | API Q&A (Gemini bila ada key, KB lokal bila tidak) |

## AI (opsional)

Q&A bekerja penuh **tanpa API key** (knowledge base lokal dari data paket).
Untuk jawaban Gemini, set:

```bash
GEMINI_API_KEY=...   # dibuat di Google AI Studio (gratis, tier gratis)
```

Tanpa key, aplikasi tetap berfungsi 100% — UI menunjukkan mode yang aktif.

## Deploy (Vercel, gratis)

1. Push repo ini ke GitHub (publik, lisensi MIT).
2. Di Vercel: Import Project → pilih repo → Deploy (tanpa pengaturan khusus).
3. Opsional: tambahkan `GEMINI_API_KEY` di Settings → Environment Variables.

## Kiro

Repo ini memuat folder `/.kiro` (steering + specs) sebagai bukti pemakaian
Kiro. Kiro CLI 3.3.0 terinstal di mesin build; sesi agentic memerlukan
sign-in akun Kiro (GitHub / Google / AWS Builder ID) atau `KIRO_API_KEY`.

## Yang dibutuhkan dari pemilik (Angga)

- [ ] Akun Devpost + join Kiroween 2026 (tenggat 4 Des 2026 14:00 PT)
- [ ] Akun Kiro + klaim 4.000 kredit gratis (sebelum 1 Des 2026 12:00 PT)
- [ ] Akun GitHub (repo publik) + akun Vercel (deploy gratis)
- [ ] (Opsional) `GEMINI_API_KEY` dari Google AI Studio
- [ ] Video demo < 3 menit di YouTube + klik Submit di Devpost

## Lisensi

MIT — lihat `LICENSE`.
