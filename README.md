# METEORA — Portable AIoT Weather Station (Website v5)

Project Next.js 14 + React 18 + TypeScript + Tailwind CSS.

## Fitur yang diperbarui
- Landing page dengan ilustrasi animasi CSS perangkat METEORA: anemometer berputar, vane mengikuti arah angin, aliran angin, serta kartu sensor suhu, kelembapan, dan O₂.
- Animasi menggunakan `prefers-reduced-motion` untuk mengurangi gerakan bagi pengguna yang memilih pengurangan animasi.
- Galeri ilustratif area penggunaan: persawahan, kebun, pekarangan rumah, dan perkotaan.
- Tombol untuk menyembunyikan/menampilkan navigasi landing page.
- Pemetaan lapangan: layer citra satelit Esri dan peta jalan OpenStreetMap, penempatan pin manual, serta tombol lokasi browser/perangkat.
- Dashboard menampilkan grafik suhu, kelembapan, kecepatan angin, dan O₂.
- Buku panduan PDF tersedia dari menu navigasi dan `public/manual-penggunaan.pdf`.
- `index.html` di root dan `public/index.html` adalah versi pratinjau statis mandiri. Aplikasi Next.js utamanya tetap menggunakan `app/page.tsx`.

## Menjalankan lokal (Windows)
```powershell
npm install
npm run dev
```
Buka http://localhost:3000.

## Penting: status data dan integrasi GPS
- Data dashboard, grafik, nilai sensor di hero, dan lokasi contoh tetap berupa data simulasi/dummy. Jangan menganggapnya sebagai hasil pembacaan perangkat aktual.
- Tombol "Gunakan lokasi perangkat" pada peta memakai Geolocation API browser setelah pengguna memberi izin. Ini bukan pembacaan GPS internal stasiun METEORA.
- Agar GPS/GNSS dari ESP32 otomatis tampil di peta, firmware harus mengirim latitude, longitude, timestamp, dan device_id ke backend/API; dashboard kemudian perlu mengambil data terbaru dari API tersebut.
- Sensor O₂ ditampilkan sebagai data contoh. Model sensor O₂, satuan, rentang, dan kalibrasi harus ditentukan berdasarkan perangkat fisik yang dipilih.
- Klasifikasi machine learning belum terlatih/terintegrasi. Kartu klasifikasi yang ada adalah aturan ilustratif, bukan hasil model ML.
- Nilai contoh O₂ pada hero hanya visualisasi; tidak mewakili kondisi udara yang terukur.

## Peta
- Citra satelit memakai Esri World Imagery. Tanggal citra dapat berbeda antar lokasi.
- Peta jalan memakai OpenStreetMap.
- Titik manual disimpan pada `localStorage` browser dan belum tersinkron ke database.
- Lokasi browser membutuhkan HTTPS atau localhost dan izin lokasi.

## Buku panduan
Buku panduan bergambar disimpan pada `public/manual-penggunaan.pdf` dan dapat dibuka melalui menu "Panduan".

## Build
Pastikan `npm install` selesai, lalu jalankan `npm run build`. Jika ada error, periksa versi Node dan dependency di `package.json`.


## Monitoring status perangkat + Supabase

Website menyediakan dua mode melalui panel **Status Perangkat** di dashboard:
- **Dummy**: status Wi-Fi, power, dan data disimulasikan di browser untuk uji tampilan tanpa perangkat/database.
- **Real / Supabase**: dashboard polling endpoint `/api/device/telemetry` setiap 3 detik. Status alat dianggap ON jika telemetry terakhir berumur kurang dari 30 detik; status menerima data aktif jika event terakhir bertipe `data` dan berumur kurang dari 10 detik. LED receive berkedip dengan siklus 2 detik.

### Setup Supabase
1. Buat project di Supabase.
2. Buka SQL Editor, jalankan isi `supabase/schema.sql`.
3. Salin `.env.example` menjadi `.env.local`. Isi `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, dan `DEVICE_API_TOKEN`. Service role key hanya untuk server, jangan pernah ditaruh di firmware/browser.
4. Restart `npm run dev`. Pilih mode Real / Supabase di dashboard.

### Format kiriman ESP32
Kirim POST ke `https://DOMAIN-WEBSITE/api/device/telemetry` dengan header `Content-Type: application/json` dan `x-device-token: TOKEN_YANG_SAMA`. Contoh body:
```json
{
  "device_id":"METEORA-001", "event_type":"data",
  "wifi_connected":true, "device_on":true,
  "temperature":28.4, "humidity":76.2, "wind_speed":1.8, "oxygen":20.9,
  "latitude":-7.424, "longitude":109.239
}
```
Kirim `event_type: "heartbeat"` setiap 5-10 detik untuk menandakan alat masih hidup (tanpa harus mengirim nilai sensor). Kirim `event_type: "data"` setiap kali data sensor berhasil dibaca. Untuk indikator receive yang responsif, kirim data sensor secara berkala (mis. 2-5 detik). Jika alat mati atau kehilangan Wi-Fi, heartbeat berhenti dan status Power otomatis OFF setelah 30 detik. Wi-Fi OFF ditampilkan dari nilai `wifi_connected:false` pada heartbeat terakhir.

### Uji API manual
Setelah `.env.local` diisi dan server aktif, uji endpoint POST dengan PowerShell (ganti URL dan token):
```powershell
$headers = @{ "Content-Type"="application/json"; "x-device-token"="TOKEN_YANG_SAMA" }
$body = @{ device_id="METEORA-001"; event_type="data"; wifi_connected=$true; device_on=$true; temperature=28.4; humidity=76.2; wind_speed=1.8; oxygen=20.9 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/device/telemetry" -Method Post -Headers $headers -Body $body
Invoke-RestMethod -Uri "http://localhost:3000/api/device/telemetry" -Method Get
```

**Keamanan:** service role key hanya berada di server Next.js. Firmware hanya memegang `DEVICE_API_TOKEN`; gunakan token acak panjang dan HTTPS saat deployment publik. Endpoint ini merupakan fondasi uji coba, belum dilengkapi rate limiting atau rotasi token.
