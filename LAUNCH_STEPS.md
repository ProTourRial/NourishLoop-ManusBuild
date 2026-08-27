# Tahapan Peluncuran NourishLoop

Dokumen ini adalah urutan kerja praktis untuk membawa **NourishLoop** dari kondisi saat ini sampai siap diuji, dirilis di Google Play, dan diajukan ke Shipaton 2026. Gunakan sebagai checklist bersama. Langkah yang melibatkan akun Google Play, identitas pembayaran, atau publikasi toko harus dilakukan atau disetujui oleh pemilik akun.

## Kondisi Saat Ini

| Komponen | Kondisi terverifikasi | Tindakan berikutnya |
|---|---|---|
| Proyek RevenueCat | `NourishLoop` telah tersedia | Pertahankan sebagai proyek pusat monetisasi |
| Aplikasi RevenueCat | Hanya **Test Store** yang tersedia | Tambahkan aplikasi Android Google Play |
| Entitlement | `nourishloop_pro` aktif | Kaitkan seluruh produk premium dengannya |
| Offering | `default` ditetapkan sebagai current | Ganti atau lengkapi paketnya dengan produk Google Play produksi |
| Kode mobile | Menggunakan entitlement `nourishloop_pro` | Tambahkan Android public SDK key melalui konfigurasi aman setelah aplikasi Android RevenueCat ada |
| Paket | Monthly, Yearly, dan Lifetime tersedia pada Test Store | Buat paket dengan produk Google Play yang sebenarnya |
| Kualitas kode | Lint, TypeScript, dan 3 tes lulus | Lanjutkan dengan build perangkat Android |

> **Batas penting:** konfigurasi Test Store berguna untuk memeriksa konsep monetisasi, tetapi tidak menggantikan aplikasi Android Google Play dan produk berlangganan nyata untuk rilis publik.

## Tahap 1 — Tetapkan Identitas Rilis Android

Pastikan nama tampilan aplikasi tetap **NourishLoop** dan identitas paket Android pada `app.config.ts` tidak diubah setelah Anda membuat aplikasi pertama di Google Play Console. Identitas paket tersebut harus sama pada Google Play Console dan aplikasi Android di RevenueCat. Gunakan ikon `assets/images/icon.png` sebagai dasar ikon listing karena sudah dalam format persegi 1024×1024.

| Pemilik tindakan | Checklist | Bukti selesai |
|---|---|---|
| Anda | Buat atau pilih akun Google Play Console organisasi/pribadi yang berhak menerbitkan aplikasi | Akses ke Google Play Console aktif |
| Anda | Buat aplikasi baru dengan nama **NourishLoop**, bahasa default English, dan jenis aplikasi **App** | Draft aplikasi tampil di dashboard Play Console |
| Anda | Salin persis package name dari konfigurasi aplikasi ketika diminta | Tidak ada konflik package name |
| Saya | Menjaga package name di kode dan menyiapkan pembaruan konfigurasi bila diperlukan sebelum build pertama | `app.config.ts` konsisten |

## Tahap 2 — Buat Produk Berlangganan di Google Play

Mulai dengan dua paket premium yang sederhana agar pengalaman hakim mudah diuji: langganan **Monthly** dan **Yearly**. Paket **Lifetime** dapat dibiarkan hanya di Test Store atau dihapus dari offering produksi bila tidak ingin menjual akses sekali bayar. Jangan memasukkan harga contoh ke kode; harga akan berasal dari Google Play/RevenueCat saat produk live.

| Produk yang disarankan | Product ID Google Play | Keterangan |
|---|---|---|
| NourishLoop Plus Monthly | `nourishloop_plus_monthly` | Akses langganan bulanan ke fitur Plus |
| NourishLoop Plus Yearly | `nourishloop_plus_yearly` | Akses langganan tahunan dengan nilai lebih baik |

Di Google Play Console, buat subscription dan base plan untuk setiap produk. Konfigurasikan negara penjualan, harga, serta free trial jika Anda ingin memberi akses otomatis kepada juri. Bila free trial tidak tersedia untuk kebutuhan lomba, siapkan promo code yang bisa dimasukkan ke materi Devpost. Produk dan aplikasi perlu menyelesaikan status pengujian Google Play sebelum transaksi nyata dapat dilakukan.

## Tahap 3 — Tambahkan Aplikasi Android ke RevenueCat

Di dashboard RevenueCat, tambahkan aplikasi Android dalam proyek **NourishLoop** dan masukkan package name yang sama dengan Google Play. Hubungkan integrasi Google Play sesuai alur RevenueCat. Setelah aplikasi Android tercatat, masukkan kedua produk Google Play ke katalog RevenueCat.

| Konfigurasi RevenueCat | Nilai yang harus digunakan |
|---|---|
| Proyek | `NourishLoop` |
| Aplikasi baru | Android / Google Play |
| Entitlement | `nourishloop_pro` |
| Offering current | `default` atau offering produksi baru yang Anda tetapkan sebagai current |
| Monthly package | `$rc_monthly` → produk `nourishloop_plus_monthly` |
| Annual package | `$rc_annual` → produk `nourishloop_plus_yearly` |

Kaitkan kedua produk premium ke entitlement `nourishloop_pro`, lalu tambahkan produk itu ke offering current. Langkah ini memastikan pembelian yang berhasil akan memberi entitlement yang dibaca langsung oleh kode aplikasi.

Untuk panduan pembuatan, izin, dan pengunggahan file Service Account Credentials JSON secara aman, lihat [`GOOGLE_PLAY_CREDENTIALS.md`](./GOOGLE_PLAY_CREDENTIALS.md).

## Tahap 4 — Tambahkan Android Public SDK Key ke Aplikasi

Setelah aplikasi Android dibuat di RevenueCat, ambil **Android public SDK key** untuk aplikasi itu. Public SDK key berbeda dari secret API key dan memang digunakan di aplikasi client. Jangan menaruh key tersebut ke GitHub atau file source yang dikomit.

Tambahkan key dengan nama `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` melalui panel Secrets proyek. Setelah key tersedia, saya dapat menjalankan validasi konfigurasi dan menyiapkan checkpoint terbaru. Kode sudah akan melakukan tiga hal secara otomatis pada build Android: mengonfigurasi RevenueCat, memeriksa entitlement `nourishloop_pro`, serta menampilkan produk dari current offering.

## Tahap 5 — Buat Build Android untuk Pengujian

Setelah key RevenueCat dan produk Google Play siap, buka checkpoint terbaru dari panel proyek dan klik **Publish** untuk memulai build Android. Proses ini adalah cara yang disarankan untuk menghasilkan APK; jangan membuat APK secara manual di lingkungan kerja. Untuk uji awal, gunakan jalur **Internal testing** di Google Play sehingga Anda dan tester terdaftar dapat memasang build tanpa menunggu rilis publik.

Konfigurasi rilis sudah disiapkan dalam `eas.json`. Profil `preview` menargetkan artefak APK untuk distribusi internal, sedangkan profil `production` menargetkan Android App Bundle untuk Google Play. Kedua profil tidak berisi SDK key. Variabel Android RevenueCat telah dibuat dalam konfigurasi rahasia proyek dengan nilai kosong; saat key Android tersedia, ganti nilainya melalui Secrets, buat checkpoint baru, lalu gunakan Publish untuk build yang sesuai.

| Uji yang harus dilakukan | Hasil yang diharapkan |
|---|---|
| Membuka aplikasi | Today screen dan Check-in tampil tanpa crash |
| Membuat rekomendasi | API mengembalikan satu meal idea yang cocok dan dapat disimpan |
| Membuka Plus | Produk monthly/yearly dari RevenueCat tampil dengan harga Google Play |
| Membeli paket tester | Entitlement `nourishloop_pro` aktif dan tampilan berubah menjadi Plus aktif |
| Restore purchase | Akses Plus pulih untuk akun Google yang sama |
| Membuka Saved | Ide yang disimpan tetap muncul setelah aplikasi ditutup dan dibuka lagi |
| Rencana mingguan | Buat 3–5 ide, tukar satu ide, lalu pastikan perubahan tersimpan setelah aplikasi dibuka kembali |
| Daftar belanja | Pastikan daftar menggabungkan ide mingguan dan tersimpan, lalu centang satu item dan periksa statusnya setelah aplikasi dibuka kembali |
| Pengingat lembut | Pada perangkat Android fisik, aktifkan izin, jadwalkan satu pengingat, lalu cek notifikasi dengan pesan yang tidak menghakimi |
| Berbagi daftar belanja | Buka daftar yang memiliki isi, tekan Share, pilih WhatsApp atau aplikasi Notes, lalu verifikasi judul, kategori, checkbox, dan substitusi bahan muncul pada draf |

## Tahap 6 — Lengkapi Listing Google Play

Siapkan listing dalam bahasa Inggris agar selaras dengan materi kompetisi. Gunakan deskripsi yang menjelaskan bahwa NourishLoop adalah pendamping ide makanan fleksibel dan bukan alat diagnosa atau program penurunan berat badan. Lengkapi data safety, privacy policy URL, kategori aplikasi, kontak dukungan, serta semua konten rating yang dibutuhkan Google Play.

Untuk aset listing, gunakan ikon 1024×1024 yang tersedia dan buat screenshot **tanpa device frame** dari build asli. Ketentuan Shipaton meminta setidaknya satu screenshot beresolusi 1179×2556; gunakan perangkat/alat tangkap layar yang menghasilkan rasio tersebut atau adaptasi aset listing sesuai arahan Devpost.

## Tahap 7 — Siapkan Submission Shipaton

Gunakan `SHIPATON_SUBMISSION.md` sebagai naskah final. Dokumen itu telah berisi ringkasan proyek, deskripsi fitur, narasi untuk Nutrition & Healthy Eating, Design, Peace Prize, dan HAMM Award, skrip demo, serta instruksi pengujian hakim.

| Bahan submission | Sumber / tindakan |
|---|---|
| Link aplikasi publik | Google Play Store setelah rilis publik pertama |
| Deskripsi proyek dan kategori | `SHIPATON_SUBMISSION.md` |
| Video demo maksimal dua menit | Rekam dari build Android asli mengikuti storyboard dokumen submission |
| Ikon | `assets/images/icon.png` |
| Screenshot | Tangkap dari build asli tanpa device frame |
| Akses premium juri | Free trial atau promo code Google Play |
| Repository | <https://github.com/ProTourRial/NourishLoop> bila memilih atau memenuhi Next Gen Award |

## Urutan Kerja yang Direkomendasikan Hari Ini

Mulai dari Google Play Console dan RevenueCat karena keduanya menjadi prasyarat build yang dapat melakukan pembelian nyata. Setelah aplikasi Android RevenueCat punya public SDK key, masukkan key melalui panel Secrets dan beri tahu saya untuk menjalankan validasi. Berikutnya, gunakan **Publish** untuk membuat build internal Android, uji purchase/restore, lalu lakukan pengambilan screenshot dan video. Terakhir, masukkan URL Google Play, video publik, deskripsi, dan akses juri ke Devpost sebelum tenggat.

## Referensi

[1] [RevenueCat — Expo installation and configuration](https://www.revenuecat.com/docs/getting-started/installation/expo)

[2] [Expo — Using in-app purchases](https://docs.expo.dev/guides/in-app-purchases/)

[3] [NourishLoop — Shipaton submission draft](./SHIPATON_SUBMISSION.md)
