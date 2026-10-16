# Landing Page Pengalihan Layanan - Satu Data Bencana Bappenas

Landing page resmi 1 halaman yang menginformasikan bahwa situs web sedang ditutup sementara dan seluruh layanan telah dialihkan ke **[Satu Data Bencana Bappenas](https://satudatabencana.bappenas.go.id)**.

Dilengkapi dengan visualisasi **WebGL 3D (Three.js)** interaktif bertema digital earth / jaringan geospasial kebencanaan nasional.

---

## 🌟 Fitur Utama

- **Visualisasi 3D WebGL (Three.js)**:
  - Digital Earth matrix dengan distribusi titik koordinat (Fibonacci sphere).
  - Cincin orbit koordinat geospasial dan titik pantau bahaya/bencana (Indonesia focus).
  - Interaktif: merespon pergerakan kursor mouse dan sentuhan layar (touch/drag).
  - Performa teroptimasi (60fps, responsif mobile hingga desktop, alokasi memori bersih pada unmount).
- **Informasi Resmi Pengalihan**:
  - Penjelasan penutupan sementara & integrasi data ke Kementerian PPN / Bappenas.
  - Tampilan alamat resmi: `https://satudatabencana.bappenas.go.id`.
  - Tombol **Salin Link** langsung ke clipboard dengan konfirmasi visual.
  - Tombol CTA langsung menuju portal.
- **Penghitung Waktu Otomatis (Auto-Redirect Countdown)**:
  - Hitung mundur 15 detik dengan indikator progres visual.
  - Tombol **Jeda / Lanjutkan** serta opsi **Alihkan Langsung**.
- **Desain Modern & Resmi**:
  - Tema dark slate & cyan/teal glow dengan gaya institusional modern.
  - Responsif penuh di ponsel, tablet, dan layar desktop.
  - SEO & OpenGraph metadata siap pakai.

---

## 🚀 Menjalankan di Lokal (Development)

1. Jalankan development server:
   ```bash
   npm run dev
   ```
2. Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 📦 Menguji Build Produksi

Pastikan aplikasi dapat dikompilasi tanpa masalah:
```bash
npm run build
npm run start
```

---

## 🌐 Cara Deploy ke Vercel

### Metode 1: Menggunakan GitHub (Paling Direkomendasikan)
1. Buat repositori baru di [GitHub](https://github.com/new).
2. Push kode lokal ke GitHub:
   ```bash
   git add .
   git commit -m "feat: landing page pengalihan satu data bencana bappenas dengan threejs"
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git branch -M main
   git push -u origin main
   ```
3. Buka dashboard [Vercel](https://vercel.com).
4. Klik **"Add New..."** > **"Project"**.
5. Pilih repositori GitHub Anda dan klik **"Deploy"**. Vercel akan otomatis mendeteksi konfigurasi Next.js.

### Metode 2: Menggunakan Vercel CLI Langsung dari Terminal
Jika ingin langsung upload tanpa GitHub:
```bash
npx vercel
```
Ikuti instruksi di layar (login Vercel dan konfirmasi nama proyek). Untuk deploy versi produksi:
```bash
npx vercel --prod
```
