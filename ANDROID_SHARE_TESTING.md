# Pengujian Android: Preferensi dan Berbagi Daftar Belanja

NourishLoop sekarang membuat file teks daftar belanja sementara dan membukanya lewat **Android system share sheet**. Pengguna dapat memilih WhatsApp, Google Keep, aplikasi catatan lain, email, atau aplikasi lain yang terpasang dan menerima teks berformat. Daftar ini tidak memilih atau mengirim ke WhatsApp secara otomatis; pengguna tetap memilih tujuan dan mengonfirmasi berbagi melalui dialog sistem.

> **Status pengujian lingkungan:** lint, TypeScript, dan 12 tes deterministik berhasil. Android Debug Bridge (ADB) tidak tersedia di lingkungan kerja ini, sehingga pembukaan WhatsApp/Notes sebenarnya tidak dapat dilakukan dari sini. Jalankan langkah berikut pada build Android/ APK dan emulator Android yang memiliki aplikasi target, atau—lebih disarankan—perangkat Android fisik.

## Prasyarat

| Item | Kebutuhan |
|---|---|
| Build aplikasi | Gunakan profile `preview` untuk APK internal melalui **Publish** |
| Target uji | Emulator Android dengan Play Store dan WhatsApp/Google Keep terpasang, atau perangkat Android fisik |
| Data awal | Buat Flexible Week atau simpan setidaknya satu meal idea agar Shopping List memiliki isi |
| Koneksi | Tidak diperlukan untuk membuka share sheet setelah daftar belanja dimuat |

## Skenario 1 — Preferensi Alergi dan Batasan Bahan

1. Buka tab **Profile**.
2. Pada **Ingredient considerations**, pilih misalnya `Dairy` atau `Gluten`.
3. Tambahkan satu bahan personal pada kolom **Add an ingredient**, misalnya `lentils`, lalu tekan tombol tambah.
4. Kembali ke **Today** dan pilih **Find my next meal**.
5. Selesaikan Quick Check-in dan buat rekomendasi.
6. Pastikan halaman hasil menyebutkan bahwa pertimbangan bahan telah digunakan. Kembali ke Profile untuk memastikan pilihan tersimpan.

Pengaturan ini berfungsi sebagai **preferensi penyaringan awal**, bukan jaminan keamanan alergi. Pengguna tetap perlu memeriksa label, kontaminasi silang, dan kecocokan setiap bahan secara mandiri.

## Skenario 2 — Daftar Belanja Adaptif

1. Dari **Today**, pilih **Build a flexible week**.
2. Gunakan **Swap this idea** pada setidaknya satu hari.
3. Pilih **Build shopping list**.
4. Pastikan daftar mengelompokkan bahan menjadi Bases, Proteins & pairings, Produce, Flavor makers, dan Optional extras.
5. Periksa teks **Instead:** pada setiap item untuk memastikan alternatif bahan terlihat.
6. Centang satu atau dua item, tutup aplikasi, lalu buka kembali untuk memastikan status centang disimpan.

## Skenario 3 — Berbagi ke WhatsApp atau Aplikasi Catatan

1. Pada halaman **Shopping List**, tekan **Share to WhatsApp, Notes, or another app** atau ikon share di kanan atas.
2. Pastikan Android system share sheet muncul.
3. Pilih **WhatsApp**, pilih chat tujuan, lalu pastikan draf pesan memuat judul, kategori, checkbox, dan alternatif bahan.
4. Ulangi dengan **Google Keep** atau aplikasi catatan yang tersedia dan pastikan file/teks daftar dapat diterima.
5. Batalkan share sheet sekali untuk memastikan aplikasi tetap berada di Shopping List tanpa perubahan data.

Expo Sharing mendukung berbagi file lokal ke aplikasi kompatibel melalui `shareAsync`; ketersediaan tujuan bergantung pada aplikasi yang terpasang di perangkat.[1] NourishLoop memakai file teks sementara agar kategori, item yang sudah dicentang, dan substitusi mudah dibaca pada WhatsApp maupun aplikasi catatan.

## Hasil yang Diharapkan

| Skenario | Hasil lulus |
|---|---|
| Alergi/bahan dihindari | Preferensi tersimpan dan ikut dikirim ke Check-in/rekomendasi berikutnya |
| Katalog tidak cocok | Aplikasi memberikan ide “familiar flexible plate” yang mengutamakan batasan, bukan memilih ide katalog yang bentrok |
| Daftar belanja | Bahan dari Flexible Week dan Saved Ideas dipadukan, dilengkapi substitusi serta jumlah ide sumber |
| Share sheet | Android menampilkan aplikasi penerima yang terpasang; WhatsApp/Notes menerima daftar teks yang terformat |
| Pembatalan share | Tidak ada crash dan data daftar tetap ada |

## Referensi

[1] [Expo SDK — Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)
