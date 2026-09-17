# Web Design Inspector

Alat untuk membaca struktur desain sebuah website dari satu URL: warna, tipografi, motion, layout, dan tebakan stack — disajikan sebagai laporan faktual, bukan penilaian.

## Menjalankan secara lokal

```
npm install
npm run dev
```

Buka http://localhost:3000

Mode render (headless Chromium) butuh binary Chromium Linux dari `@sparticuz/chromium`, yang **tidak jalan di macOS/Windows lokal**. Untuk dev lokal, set `CHROME_EXECUTABLE_PATH` ke path Chrome/Chromium lokal kamu, atau langsung pakai toggle "Static" di halaman `/analyzer` — fallback ke static juga otomatis terjadi kalau render gagal.

## Deploy ke Vercel

Import repo ini, framework preset Next.js terdeteksi otomatis. Tidak ada environment variable wajib.

Catatan penting soal mode render di Vercel:
- Paket `puppeteer-core` + `@sparticuz/chromium` dipilih karena totalnya masih di bawah limit ukuran function 50MB di Vercel (beda dari `playwright` penuh yang jauh lebih besar).
- Fungsi `/api/analyze` di-set `maxDuration = 60` — di plan Hobby, durasi maksimum function bisa lebih rendah dari itu; kalau kena limit, turunkan `maxDuration` atau upgrade plan.
- Cold start render (buka browser headless) realistis makan beberapa detik pertama kali. Request berikutnya untuk URL yang sama kena cache 20 menit.
- Versi `@sparticuz/chromium` harus tetap kompatibel dengan `puppeteer-core` — kalau upgrade salah satu, cek changelog Sparticuz/chromium dulu.

## Mode analisis

- **Render (default)** — buka halaman lewat headless Chromium, tunggu JS jalan, baru ambil HTML final. Lebih akurat buat animasi/warna yang di-inject via JS, lebih lambat.
- **Static** — fetch HTML mentah langsung, tanpa eksekusi JS. Jauh lebih cepat, tapi bisa melewatkan styling/animasi runtime.
- Kalau mode render gagal (timeout, crash, dsb), sistem otomatis fallback ke static dan menandainya di laporan (`renderFallback: true`).
- Halaman yang terindikasi proteksi bot/captcha (mis. Cloudflare challenge) ditandai di laporan lewat field `notes`, bukan di-bypass paksa.

## Catatan implementasi lain

- Cache laporan disimpan in-memory per instance server dengan TTL 20 menit — bersifat best-effort di lingkungan serverless, bukan cache persisten.
- Riwayat analisis disimpan di localStorage browser, bukan di server.
- Halaman 404 kustom (`app/not-found.jsx`) menangani semua path yang tidak dikenal tanpa membocorkan struktur file.
