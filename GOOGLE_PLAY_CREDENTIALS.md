# Membuat Service Account Google Play untuk RevenueCat

Dokumen ini menjelaskan cara membuat **Service Account Credentials JSON** yang diminta oleh formulir aplikasi Android RevenueCat. File JSON ini adalah kredensial sensitif yang memberi RevenueCat akses terbatas untuk memvalidasi transaksi Google Play. **Jangan unggah file ke GitHub, jangan masukkan isi file ke chat, dan jangan taruh file di folder proyek aplikasi.** Unduh dan unggah langsung dari browser Anda ke RevenueCat.

> Gunakan nilai aplikasi NourishLoop berikut pada langkah yang memintanya: package name **`com.app.nourishloop`** dan custom URL scheme **`manusnourishloop`**.

## Ringkasan Tahap

| Tahap | Lokasi | Hasil |
|---|---|---|
| 1 | Google Play Console | Akun developer dan aplikasi NourishLoop dibuat |
| 2 | Google Play Console → API access | Proyek Google Cloud ditautkan |
| 3 | Google Cloud Console | Service account dan JSON key dibuat |
| 4 | Google Play Console → Users and permissions | Service account memperoleh izin yang diperlukan |
| 5 | RevenueCat | JSON diunggah dan kredensial divalidasi |

## Tahap 1 — Siapkan Aplikasi di Google Play Console

Masuk ke Google Play Console dengan akun pemilik. Buat aplikasi baru bernama **NourishLoop**, dengan bahasa default English dan tipe **App**. Pada saat package name diperlukan, gunakan `com.app.nourishloop` persis seperti tertulis. Jangan memakai `com.example.app`; itu hanya nilai contoh dan akan membuat aplikasi tidak cocok dengan build NourishLoop.

Jika aplikasi draft sudah dibuat, lanjutkan ke menu **Setup → API access**. Anda harus memiliki izin administrator Play Console untuk menghubungkan proyek cloud dan mengelola pengguna.

## Tahap 2 — Tautkan Proyek Google Cloud

Di halaman **Setup → API access**, pilih opsi untuk menautkan proyek Google Cloud. Anda dapat menggunakan proyek baru yang khusus untuk NourishLoop atau proyek yang sudah ada dan memang Anda kelola. Catat **Project ID** yang dipilih, karena Project ID tersebut digunakan saat membuat service account.

Jika menu meminta aktivasi API, aktifkan minimal **Google Play Android Developer API** untuk proyek yang ditautkan. RevenueCat juga merekomendasikan **Cloud Pub/Sub API** dan **Cloud Monitoring API** saat menyiapkan kredensial agar integrasi notifikasi dan validasi dapat berjalan sebagaimana mestinya.[1]

## Tahap 3 — Buat Service Account di Google Cloud

Di Google Cloud Console, pilih proyek yang sama dengan proyek pada langkah sebelumnya. Buka **IAM & Admin → Service Accounts**, lalu buat service account baru.

| Isian | Nilai yang disarankan |
|---|---|
| Service account name | `revenuecat-service-account` |
| Description | `RevenueCat Google Play integration for NourishLoop` |
| Project | Proyek Google Cloud yang ditautkan ke Play Console |

Setelah service account terbentuk, salin alamat emailnya. Bentuknya biasanya seperti `revenuecat-service-account@PROJECT_ID.iam.gserviceaccount.com`. Email ini akan diundang sebagai pengguna di Google Play Console pada tahap berikutnya.

Di halaman service account, pilih tab **Keys**, lalu **Add key → Create new key → JSON**. Unduh file JSON sekali saja dan simpan secara lokal di folder aman yang tidak disinkronkan ke GitHub atau proyek. Google biasanya hanya menampilkan kesempatan unduh saat key dibuat; buat key baru jika file hilang.

## Tahap 4 — Beri Izin Service Account di Google Play Console

Kembali ke Google Play Console dan buka **Users and permissions → Invite new users**. Masukkan email service account yang disalin tadi. Pada **App permissions**, pilih aplikasi NourishLoop. Kemudian pilih izin akun yang diperlukan RevenueCat berikut:[1]

| Izin Google Play Console | Mengapa dibutuhkan |
|---|---|
| View app information and download bulk reports (read-only) | Membaca informasi aplikasi dan laporan yang dibutuhkan validasi produk |
| View financial data, orders, and cancellation survey response | Membaca data transaksi dan finansial |
| Manage orders and subscriptions | Memvalidasi serta menangani status subscription |
| Manage store presence | Mendukung kebutuhan konfigurasi integrasi RevenueCat |

Simpan undangan. Pastikan service account terlihat sebagai pengguna aktif di daftar Users and permissions. Pada Google Cloud, RevenueCat juga merekomendasikan peran **Pub/Sub Editor** (atau Admin) dan **Monitoring Viewer** bagi service account bila Anda menggunakan notifikasi Google/validasi lengkap.[1]

## Tahap 5 — Unggah JSON Langsung ke RevenueCat

Kembali ke formulir **New Play Store configuration** di RevenueCat. Isi bidangnya sebagai berikut, kemudian unggah file JSON yang baru Anda unduh menggunakan pemilih file pada browser.

| Bidang RevenueCat | Nilai NourishLoop |
|---|---|
| App name | `NourishLoop (Play Store)` |
| Google Play package name | `com.app.nourishloop` |
| Custom URL Scheme | `manusnourishloop` |
| Service Account Credentials JSON | File JSON yang dibuat pada Tahap 3 |
| Financial reports bucket ID | Biarkan kosong jika belum membutuhkan impor laporan historis |
| Apps Experience / Games Level Up Program | Biarkan kosong kecuali Anda benar-benar terdaftar dalam program tersebut |

Klik **Save**. Setelah tersimpan, gunakan tombol validasi kredensial pada halaman RevenueCat. RevenueCat menyatakan kredensial baru dapat memerlukan waktu hingga 36 jam untuk valid sepenuhnya; jangan mengunggah key berulang-ulang kecuali validator memberi kesalahan yang dapat diperbaiki.[1]

## Tahap 6 — Konfigurasi Setelah Kredensial Valid

Setelah validator menyatakan valid, tambahkan produk monthly dan yearly dari Google Play ke RevenueCat, kaitkan keduanya dengan entitlement **`nourishloop_pro`**, dan letakkan paketnya dalam current offering. Selanjutnya, ambil **Android public SDK key** dari aplikasi Android RevenueCat dan masukkan melalui Settings → Secrets proyek sebagai `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`. Jangan memakai key Test Store dan jangan gunakan secret API key.

Untuk uji pembelian, buat **Closed testing** track di Google Play Console, tambahkan akun Google tester ke daftar license testing dan daftar tester track, lalu buka opt-in URL dari perangkat tersebut. Google/RevenueCat merekomendasikan perangkat fisik dan akun tester yang sudah menjadi license tester. Upload build yang ditandatangani ke closed track agar produk pembelian dapat dimuat.[2]

## Pemeriksaan Sebelum Menekan Save

| Pemeriksaan | Kondisi benar |
|---|---|
| Project Google Cloud | Sama dengan yang ditautkan pada Google Play Console |
| Email service account | Telah diundang ke Play Console dan statusnya aktif |
| App permissions | Keempat izin dalam tabel Tahap 4 aktif |
| Package name | `com.app.nourishloop`, identik di Play Console, RevenueCat, dan konfigurasi build |
| JSON file | Diunggah langsung ke RevenueCat, tidak pernah masuk repo atau chat |
| Financial bucket | Kosong bila tidak melakukan impor laporan historis |

## Jika Validasi Gagal

Jangan kirim file JSON kepada saya. Periksa bahwa service account masih **Enabled** di Google Cloud, file yang diunggah berasal dari service account/proyek yang benar, dan empat izin Play Console telah diberikan. Jika validator masih gagal setelah menunggu waktu propagasi Google, buat service account key JSON baru, cabut key lama, dan unggah key baru langsung ke RevenueCat.[1]

## Referensi

[1] [RevenueCat — Creating Google Play service credentials](https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials)

[2] [RevenueCat — Testing purchases in Google Play sandbox](https://www.revenuecat.com/docs/test-and-launch/sandbox/google-play-store)
