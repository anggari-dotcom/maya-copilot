# PROGRESS — Maya, AI Tour Leader Copilot (Kiroween 2026)

Tenggat submit: **4 Des 2026 14:00 PT (= 5 Des 2026 05:00 WIB)**.
Target internal: selesai & submit sebelum 30 Nov 2026.

## Kiro — status jujur
- Kiro CLI **3.3.0 terinstal** (`~/.local/bin/kiro-cli`, dari
  `curl -fsSL https://cli.kiro.dev/install | bash`, 16 Nov 2026).
- `kiro-cli whoami` → **"Not logged in"**. Sesi agentic Kiro butuh sign-in
  Angga (GitHub / Google / AWS Builder ID) atau `KIRO_API_KEY` (Pro+).
- Karena itu build dilakukan dengan tool yang ada, dan folder `/.kiro`
  (steering + specs) adalah artefak Kiro-native yang mendokumentasikan
  desain berbasis Kiro. **Yang dibutuhkan dari Angga:** buat akun Kiro,
  sign-in, dan klaim 4.000 kredit gratis sebelum 1 Des 2026 12:00 PT
  (= 2 Des 2026 03:00 WIB) — lihat README.

## Log build
- [x] 16 Nov — Scaffold Next.js 16.4.6 + React 19 + TS + Tailwind v4
  (`create-next-app`). `npm run build` lolos.
- [x] 16 Nov — `.kiro/steering/` (product, tech, structure) +
  `.kiro/specs/maya-copilot/` (requirements, design, tasks).
- [x] 16 Nov — `src/lib/packages.ts`: 3 paket asli (SG 3D2N Rp2,5 jt,
  MY 3D2N Rp2 jt, 2 Negara 4D3N mulai Rp3,5 jt) + jadwal 2027 + FAQ.
- [x] 16 Nov — `src/lib/i18n.tsx` (ID/EN), `src/lib/qa.ts` (KB matcher).
- [x] 16 Nov — Layout + nav + home (hero, kartu 3 paket, 4 kartu fitur).
- [x] 16 Nov — Fitur 1 generator itinerary (`/itinerary`): pilih paket /
  custom, tanggal, peserta, budget, hitung total, jadwal 2027, simpan
  localStorage, tautan ke trip builder. Build lolos.
- [x] 16 Nov — Git init + commit pertama.
- [x] 16 Nov — Fitur 2 — Trip builder + shareable view (`/trip`, `/trip/view`).
  Form prefill dari `?pkg=&date=&pax=` (tautan dari `/itinerary`), harga/
  meeting point/include otomatis dari paket (harga bisa diedit), link
  shareable `/trip/view?d=<base64url JSON>` + Salin Link + WhatsApp
  (wa.me/6281228290989, teks prefilled ringkasan trip), pratinjau live di
  bawah form. View page tahan data rusak (pesan ramah, bukan crash).
  Helper `src/lib/trip-share.ts` (encode/decode/validasi) + komponen
  bersama `src/components/TripCard.tsx`. Build lolos; curl dev server:
  `/trip` 200, `/trip/view?d=<contoh>` 200 + judul/harga/meeting point
  ter-render, `?d` rusak & tanpa `?d` tampilkan pesan error ramah.
- [x] 16 Nov — Fitur 3 — Q&A "Tanya Maya" (`/tanya` + `POST /api/ask`): tanpa `GEMINI_API_KEY` jawab dari KB lokal (`src/lib/qa.ts` answerFromKb + KB_FALLBACK); dengan key, Gemini `gemini-2.0-flash` dengan system prompt + konteks FAQ/3 paket dari `packages.ts`, dilarang mengarang harga/tanggal, tidak tahu → arahkan ke WA 0812 2829 0989; error Gemini → fallback KB. UI chat (pesan user/Maya, indikator mode dari field `source`, "Maya sedang mengetik…", FAQ klik-untuk-bertanya, catatan sumber data, riwayat di localStorage `maya-chat-history`), 13 key i18n baru. Catatan: `qa.ts` membuang token ≤2 huruf sehingga "berapa dp" lolos dari matcher — diatasi fallback pencocokan tag di `route.ts` (qa.ts tidak diubah). Build lolos; curl dev server (tanpa key): "berapa harga singapura" → Rp 2,5 jt, source kb; "berapa dp" → DP Rp 1.000.000, source kb; pertanyaan di luar KB → KB_FALLBACK; `/tanya` 200.
- [x] 16 Nov — Fitur 4 — Mode Hari-H (`/hari-h`): pilih trip (paket + tanggal + jam kumpul, localStorage), checklist 8 item tetap + tambah/hapus item sendiri + progres x/y (localStorage), hitung peserta dewasa/anak + terkonfirmasi/belum + peringatan min. 4 orang, peta Leaflet/OSM (dynamic ssr:false, marker Changi 1.36,103.99 & KLIA 2.7456,101.7099, ikon diperbaiki via unpkg CDN), generator pesan broadcast WA (template bisa diedit, salin + kirim via wa.me/6281228290989). Build lolos (dengan catatan di bawah) + curl /hari-h 200.
- [x] 16 Nov — Verifikasi akhir koordinator: `npm run build` tree penuh
  LOLOS (Next 16.4.6, TS 0 error; rute: / /itinerary /trip /trip/view
  /tanya /hari-h statis, /api/ask dinamis). Dev server + curl: semua rute
  200; /trip/view?d= contoh SG menampilkan judul, Rp2.500.000, Changi,
  wa.me; POST /api/ask "berapa harga singapura" → Rp 2,5 jt (source kb),
  "berapa dp" → DP Rp 1.000.000 (source kb). Screenshot 7 file di
  screenshots/ (desktop 5 halaman + mobile home + peta): home, itinerary,
  trip-view, tanya, hari-h semua rapi; mobile home TIDAK overflow
  (diverifikasi Playwright viewport 390px: scrollWidth = 390, 0 elemen
  meluber — screenshot --screenshot Chrome sebelumnya menipu karena tidak
  mengemulasi viewport mobile).
- [x] 16 Nov — Perbaikan dari review visual: (1) label ganda di TripCard
  ("Harga per orang (Rp) (per orang)") → jadi "Harga per orang (Rp)";
  (2) ikon marker Leaflet dipindah dari CDN unpkg ke lokal
  (public/leaflet/*.png) — di browser VM ini, proxy tunnel gagal untuk
  unpkg/OSM (ERR_TUNNEL_CONNECTION_FAILED) sehingga marker sempat tampil
  sebagai gambar rusak; setelah perbaikan marker terverifikasi termuat
  (naturalWidth 25, pin biru terlihat di screenshot). Tile OSM tetap
  abu-abu HANYA di browser VM ini (curl ke tile.openstreetmap.org = 200);
  di browser normal / setelah deploy Vercel, tile akan termuat normal.
  Catatan: tombol bundar "N" di pojok kiri bawah screenshot adalah
  indikator dev Next.js (hanya mode dev, tidak ada di production).
- [ ] Deploy Vercel (akun Angga) + submit Devpost (Angga).

## Catatan verifikasi
- Build: `npm run build` (Next 16, Turbopack). Wajib 0 error TS.
- Setiap fitur dites via dev server + curl sebelum ditandai selesai.
- Screenshot: ambil dari dev server (desktop + mobile) sebelum submit.
