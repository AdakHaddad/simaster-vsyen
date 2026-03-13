# PRD: Sistem Presensi Otomatis Berbasis Pengenalan Wajah Terintegrasi SIMASTER

---

## Informasi Dokumen

| Atribut | Keterangan |
|---------|------------|
| **Judul Proyek** | Sistem Presensi Otomatis Berbasis Pengenalan Wajah melalui CCTV Terintegrasi SIMASTER |
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 13 Maret 2026 |
| **Penulis** | [Nama Mahasiswa], Fakultas Teknik, Universitas Gadjah Mada |
| **Status Dokumen** | Draft — Menunggu Review |

### Daftar Distribusi

| No. | Penerima | Jabatan/Unit |
|-----|----------|--------------|
| 1 | Wakil Dekan Bidang Akademik | Fakultas Teknik UGM |
| 2 | Direktur DTI | Direktorat Teknologi Informasi UGM |
| 3 | Kepala Bagian Sarana & Prasarana | Fakultas Teknik UGM |
| 4 | [Nama Dosen Pembimbing] | Fakultas Teknik UGM |

### Riwayat Revisi

| Versi | Tanggal | Penulis | Keterangan |
|-------|---------|---------|------------|
| 1.0 | 13 Maret 2026 | [Nama Mahasiswa] | Dokumen awal |

---

## 1. Ringkasan Eksekutif

### 1.1 Pernyataan Masalah

Sistem presensi perkuliahan yang berlaku saat ini di Fakultas Teknik Universitas Gadjah Mada masih mengandalkan metode manual (tanda tangan pada lembar presensi) dan/atau pemindaian sidik jari (*fingerprint*). Kedua metode tersebut memiliki sejumlah kelemahan signifikan:

- **Inefisiensi waktu:** proses presensi manual memakan waktu 5–15 menit dari durasi perkuliahan, terutama pada kelas dengan jumlah peserta besar.
- **Kerawanan manipulasi:** praktik "titip absen" (mahasiswa yang tidak hadir namun tercatat hadir melalui bantuan rekan) masih marak terjadi dan sulit dideteksi.
- **Antrian perangkat:** pada sistem *fingerprint*, antrian panjang terjadi terutama saat jam pergantian kuliah.
- **Data tidak *real-time*:** data kehadiran baru tersedia di SIMASTER setelah proses input manual oleh pihak administrasi, sehingga terdapat *delay* yang menghambat pemantauan akademik.

### 1.2 Solusi yang Diusulkan

Dokumen ini mengusulkan implementasi **sistem presensi otomatis berbasis pengenalan wajah (*face recognition*)** yang memanfaatkan infrastruktur CCTV yang telah terpasang di ruang kelas Fakultas Teknik UGM. Sistem ini akan terintegrasi langsung dengan **SIMASTER** (Sistem Informasi Akademik UGM) sehingga data kehadiran tercatat secara otomatis dan *real-time*.

### 1.3 Proposisi Nilai

| Aspek | Manfaat |
|-------|---------|
| **Efisiensi** | Presensi otomatis tanpa mengganggu waktu perkuliahan |
| **Akurasi** | Identifikasi berbasis biometrik wajah dengan tingkat akurasi tinggi (≥95%) |
| **Pencegahan Kecurangan** | Eliminasi praktik titip absen secara sistematis |
| **Data *Real-time*** | Data kehadiran langsung tersedia di SIMASTER untuk pemantauan dosen dan pimpinan |
| **Pemanfaatan Infrastruktur** | Mengoptimalkan CCTV eksisting yang selama ini hanya digunakan untuk keamanan |

---

## 2. Latar Belakang & Analisis Masalah

### 2.1 Kondisi Saat Ini

Proses presensi di lingkungan Universitas Gadjah Mada saat ini dilakukan melalui dua mekanisme utama:

1. **Presensi manual:** mahasiswa menandatangani lembar presensi yang diedarkan di kelas. Lembar ini kemudian diinput secara manual ke dalam SIMASTER oleh staf administrasi program studi.
2. **Presensi *fingerprint*:** beberapa ruang kelas telah dilengkapi perangkat pemindai sidik jari. Mahasiswa harus mengantri untuk memindai sidik jari sebelum atau sesudah perkuliahan.

Kedua metode tersebut masih memerlukan intervensi manual dan rentan terhadap berbagai masalah operasional.

### 2.2 Identifikasi *Pain Points*

| No. | Permasalahan | Dampak |
|-----|-------------|--------|
| 1 | Waktu presensi manual yang lama (5–15 menit per sesi) | Pengurangan waktu efektif perkuliahan sebesar 5–10% |
| 2 | Praktik titip absen pada presensi tanda tangan | Data kehadiran tidak akurat; ketidakadilan bagi mahasiswa yang hadir |
| 3 | Antrian panjang pada perangkat *fingerprint* | Keterlambatan masuk kelas; kerusakan perangkat akibat penggunaan intensif |
| 4 | *Delay* sinkronisasi data ke SIMASTER | Dosen dan pimpinan tidak dapat memantau kehadiran secara *real-time* |
| 5 | Biaya operasional lembar presensi | Penggunaan kertas berlebihan dan beban administrasi tambahan |
| 6 | Kesulitan rekapitulasi akhir semester | Staf administrasi memerlukan waktu ekstra untuk validasi data presensi |

### 2.3 Benchmark & Referensi

Beberapa institusi pendidikan tinggi telah mengimplementasikan atau meneliti sistem presensi berbasis pengenalan wajah, antara lain:

- **Telkom University:** implementasi pilot sistem presensi wajah di beberapa program studi menggunakan kamera khusus di pintu masuk ruang kelas.
- **Institut Teknologi Sepuluh Nopember (ITS):** penelitian dan pengembangan prototipe sistem presensi berbasis *deep learning* untuk pengenalan wajah.
- **Nanyang Technological University (NTU), Singapura:** penggunaan teknologi pengenalan wajah untuk presensi dan keamanan kampus.
- **Sejumlah penelitian akademik** menunjukkan bahwa metode pengenalan wajah modern (berbasis *deep learning* seperti ArcFace dan FaceNet) mampu mencapai akurasi di atas 99% pada kondisi ideal.

Keunggulan proposal ini dibandingkan referensi tersebut adalah **pemanfaatan infrastruktur CCTV yang sudah ada**, sehingga meminimalkan biaya investasi perangkat keras tambahan.

---

## 3. Tujuan & Sasaran

### 3.1 Tujuan Umum

Mengembangkan dan mengimplementasikan sistem presensi otomatis berbasis pengenalan wajah yang terintegrasi dengan SIMASTER untuk meningkatkan efisiensi, akurasi, dan transparansi pencatatan kehadiran mahasiswa di Fakultas Teknik UGM.

### 3.2 Tujuan Khusus

1. Membangun modul pengenalan wajah yang mampu mengidentifikasi mahasiswa melalui *feed* CCTV eksisting di ruang kelas.
2. Mengintegrasikan sistem dengan SIMASTER sehingga data presensi tercatat secara otomatis dan *real-time*.
3. Menyediakan *dashboard* pemantauan bagi dosen untuk memverifikasi dan mengelola data presensi.
4. Mengeliminasi praktik titip absen melalui verifikasi biometrik wajah.
5. Mengurangi waktu yang terbuang untuk proses presensi konvensional.

### 3.3 *Key Performance Indicators* (KPI)

| KPI | Target | Metode Pengukuran |
|-----|--------|-------------------|
| Akurasi pengenalan wajah | ≥ 95% | Perbandingan hasil deteksi dengan presensi manual verifikasi |
| Waktu presensi per mahasiswa | < 5 detik | Pengukuran *timestamp* dari deteksi hingga pencatatan |
| Insiden titip absen | 0 (nol) | Audit silang dengan pengamatan langsung di kelas |
| Ketersediaan sistem (*uptime*) | ≥ 99% selama jam kuliah | Monitoring *log* sistem |
| Kepuasan pengguna (dosen & mahasiswa) | ≥ 80% puas/sangat puas | Survei akhir pilot |
| Latensi sinkronisasi ke SIMASTER | < 30 detik | Pengukuran selisih *timestamp* deteksi vs. *timestamp* record SIMASTER |

---

## 4. Ruang Lingkup Pilot

### 4.1 Lokasi

Pilot project akan dilaksanakan di **1–2 ruang kelas** di lingkungan Fakultas Teknik UGM, dengan prioritas ruang yang telah dilengkapi CCTV dengan spesifikasi memadai. Kandidat lokasi:

- **KPFT (Komplek Pendidikan Fakultas Teknik):** ruang kuliah utama dengan kapasitas 40–80 mahasiswa.
- **Ruang Kuliah Departemen Teknik Elektro dan Teknologi Informasi (DTETI):** ruang dengan infrastruktur CCTV yang relatif baru.

Pemilihan ruang final akan ditentukan setelah **audit CCTV** pada fase persiapan.

### 4.2 Jumlah Peserta Target

- **50–100 mahasiswa** yang terdaftar pada mata kuliah yang diampu di ruang pilot.
- Peserta dipilih berdasarkan mata kuliah yang dijadwalkan secara reguler di ruang kelas pilot.

### 4.3 Durasi Pilot

- **1 (satu) semester akademik** penuh, meliputi fase pengembangan, *enrollment*, pengujian, dan evaluasi.
- Estimasi total: **~20 minggu** (lihat bagian Timeline & Milestones).

### 4.4 Batasan Ruang Lingkup

- Sistem ini **hanya** digunakan untuk pencatatan presensi kehadiran perkuliahan reguler.
- **Tidak** mencakup: presensi ujian (UTS/UAS), kontrol akses keamanan gedung, atau pemantauan perilaku mahasiswa.
- **Tidak** menggantikan mekanisme presensi manual secara permanen selama fase pilot; presensi manual tetap tersedia sebagai *fallback*.

---

## 5. Arsitektur Sistem

### 5.1 Diagram Arsitektur Tingkat Tinggi

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────────────┐
│  CCTV Eksisting  │────▶│  Stream Capture      │────▶│  Face Detection &        │
│  (Ruang Kelas)   │     │  Module (RTSP)       │     │  Recognition Engine      │
└─────────────────┘     └──────────────────────┘     │  (InsightFace/ArcFace)   │
                                                      └───────────┬──────────────┘
                                                                  │
                                                                  ▼
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────────────┐
│  SIMASTER        │◀───│  Attendance API       │◀───│  Matching Service         │
│  Database        │    │  (FastAPI Gateway)    │    │  (vs DB Wajah Mahasiswa)  │
└────────┬────────┘     └──────────────────────┘     └──────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Dashboard Monitoring Dosen (Web App)                                           │
│  - Status presensi real-time                                                    │
│  - Override manual                                                              │
│  - Rekapitulasi kehadiran                                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Komponen Sistem

#### 5.2.1 Stream Capture Module

- **Fungsi:** mengambil *video feed* dari CCTV eksisting melalui protokol RTSP (*Real Time Streaming Protocol*).
- **Proses:** *frame extraction* pada interval tertentu (misalnya 1–2 frame per detik) untuk efisiensi komputasi.
- **Output:** *frame* gambar yang diteruskan ke modul pengenalan wajah.

#### 5.2.2 Face Detection & Recognition Engine

- **Fungsi:** mendeteksi keberadaan wajah dalam *frame* dan menghasilkan *face embedding* (representasi vektor numerik dari wajah).
- **Library yang direkomendasikan:**
  - **InsightFace** (dengan model ArcFace): akurasi tinggi, *open-source*, mendukung deteksi multi-wajah.
  - **Alternatif:** DeepFace, FaceNet — sebagai opsi cadangan jika InsightFace tidak kompatibel dengan infrastruktur.
- **Proses:** deteksi wajah → *alignment* → ekstraksi *embedding* (vektor 512 dimensi).

#### 5.2.3 Matching Service

- **Fungsi:** mencocokkan *face embedding* hasil deteksi dengan database *embedding* wajah mahasiswa yang terdaftar pada mata kuliah terkait.
- **Metode:** perhitungan *cosine similarity* antara *embedding* terdeteksi dengan *embedding* tersimpan.
- **Threshold:** *confidence score* ≥ 0.6 (dapat dikalibrasi selama fase pengujian).
- **Output:** NIM mahasiswa yang teridentifikasi beserta *confidence score*.

#### 5.2.4 Middleware / API Gateway

- **Fungsi:** menjembatani komunikasi antara sistem pengenalan wajah dengan SIMASTER.
- **Implementasi:** FastAPI (Python) dengan autentikasi berbasis token (JWT/OAuth2).
- **Fitur:** *rate limiting*, *logging*, validasi data, *error handling*.

#### 5.2.5 Dashboard Monitoring

- **Fungsi:** antarmuka web bagi dosen untuk memantau dan mengelola presensi.
- **Fitur utama:**
  - Tampilan status presensi *real-time* per sesi kuliah.
  - Kemampuan *override* manual (menandai hadir/tidak hadir secara manual).
  - Rekapitulasi kehadiran per mahasiswa dan per mata kuliah.
  - Notifikasi untuk kasus *low confidence* yang memerlukan verifikasi manual.

### 5.3 *Tech Stack* yang Direkomendasikan

| Komponen | Teknologi | Justifikasi |
|----------|-----------|-------------|
| Bahasa pemrograman utama | Python 3.10+ | Ekosistem *machine learning* dan *computer vision* yang matang |
| *Computer vision* | OpenCV 4.x | Standar industri untuk pemrosesan video dan gambar |
| Pengenalan wajah | InsightFace (ArcFace) | Akurasi *state-of-the-art*, *open-source*, dokumentasi lengkap |
| *Backend* API | FastAPI | Performa tinggi, *async*, dokumentasi otomatis (OpenAPI) |
| Basis data lokal | PostgreSQL 15+ | Reliabel, mendukung *pgvector* untuk pencarian *embedding* |
| *Frontend* dashboard | React.js / Vue.js | Komponen UI modern, komunitas besar |
| Penyimpanan *embedding* | pgvector (ekstensi PostgreSQL) | Pencarian vektor efisien tanpa infrastruktur tambahan |
| *Message queue* (opsional) | Redis / RabbitMQ | Untuk antrean pemrosesan *frame* jika diperlukan |
| Containerisasi | Docker & Docker Compose | Kemudahan *deployment* dan reproduksi lingkungan |

---

## 6. Kebutuhan Integrasi SIMASTER

> **Catatan:** Bagian ini ditujukan secara khusus sebagai dasar pengajuan permintaan akses kepada **DTI (Direktorat Teknologi Informasi) UGM**.

### 6.1 Data yang Dibutuhkan dari SIMASTER (Read Access)

| No. | Data | Detail | Keperluan |
|-----|------|--------|-----------|
| 1 | Data mahasiswa | NIM, nama lengkap, foto (dari KTM atau data akademik) | Pembuatan database *face embedding* untuk pencocokan |
| 2 | Data mata kuliah | Kode MK, nama MK, SKS, semester | Identifikasi sesi kuliah yang sedang berlangsung |
| 3 | Data jadwal kuliah | Hari, jam mulai, jam selesai, ruang kelas, dosen pengampu | Penentuan waktu aktif sistem dan validasi lokasi |
| 4 | Data peserta MK (KRS) | Daftar NIM mahasiswa yang terdaftar per mata kuliah per semester | Pembatasan pencocokan hanya pada mahasiswa yang terdaftar di MK terkait |
| 5 | Data dosen pengampu | NIP/NIU, nama dosen, mata kuliah yang diampu | Otorisasi akses dashboard dan verifikasi presensi |

### 6.2 Data yang Dikirim ke SIMASTER (Write Access)

| No. | Data | Format | Keterangan |
|-----|------|--------|------------|
| 1 | NIM mahasiswa | String (14 digit) | Identitas mahasiswa yang terdeteksi hadir |
| 2 | Kode mata kuliah | String | Mata kuliah pada sesi presensi terkait |
| 3 | *Timestamp* kehadiran | ISO 8601 (datetime) | Waktu deteksi kehadiran |
| 4 | Status kehadiran | Enum: `HADIR`, `TIDAK_HADIR`, `TERLAMBAT` | Status presensi mahasiswa |
| 5 | *Confidence score* | Float (0.0 – 1.0) | Tingkat kepercayaan hasil pengenalan wajah |
| 6 | Metode verifikasi | Enum: `AUTO_FACE`, `MANUAL_OVERRIDE` | Apakah presensi otomatis atau diubah manual oleh dosen |

### 6.3 Mekanisme Integrasi yang Diusulkan

#### Opsi 1: REST API *(Preferred)*

- **Read endpoints** untuk mengambil data mahasiswa, jadwal, dan peserta MK.
- **Write endpoint** untuk mengirimkan record presensi.
- **Autentikasi:** OAuth2 / API key dengan *scope* terbatas.
- **Format data:** JSON.
- **Keunggulan:** integrasi *real-time*, standar industri, mudah di-*maintain*.

Contoh spesifikasi endpoint yang diharapkan:

```
GET  /api/v1/mahasiswa/{nim}              → Data mahasiswa (nama, foto)
GET  /api/v1/matakuliah/{kode_mk}/peserta → Daftar peserta MK
GET  /api/v1/jadwal?ruang={kode_ruang}&hari={hari} → Jadwal per ruang
POST /api/v1/presensi                     → Submit record presensi
```

#### Opsi 2: Database View Read-Only + Dedicated Write Table

- Akses *read-only view* ke tabel mahasiswa, jadwal, dan KRS pada database SIMASTER.
- Tabel khusus (*dedicated table*) untuk penulisan data presensi yang kemudian disinkronkan ke tabel presensi utama SIMASTER.
- **Keunggulan:** tidak memerlukan pengembangan API baru di sisi SIMASTER.
- **Kekurangan:** *coupling* lebih tinggi, risiko keamanan akses database langsung.

#### Opsi 3: File-Based Batch Sync *(Fallback)*

- Ekspor data mahasiswa dan jadwal dalam format CSV/JSON secara periodik.
- Impor data presensi ke SIMASTER melalui unggah file batch.
- **Keunggulan:** tidak memerlukan koneksi *real-time*.
- **Kekurangan:** data tidak *real-time*, memerlukan proses manual/semi-manual.

### 6.4 Permintaan Akses Spesifik kepada DTI

Melalui dokumen ini, kami secara resmi mengajukan permintaan berikut kepada DTI UGM:

1. **API credential/token** untuk akses data mahasiswa dan jadwal kuliah dengan *scope* terbatas pada kebutuhan sistem presensi.
2. **Endpoint untuk submit data presensi** atau mekanisme alternatif untuk menuliskan record kehadiran ke SIMASTER.
3. **Akses ke *sandbox/staging environment*** SIMASTER untuk keperluan pengembangan dan pengujian tanpa memengaruhi data produksi.
4. **Dokumentasi API SIMASTER** yang relevan dengan kebutuhan integrasi (format data, autentikasi, *rate limit*, *error code*).
5. **Kontak teknis (*point of contact*)** di DTI untuk koordinasi teknis selama fase pengembangan dan pengujian.

---

## 7. Kebutuhan Infrastruktur

### 7.1 CCTV

| Spesifikasi | Minimum | Ideal |
|-------------|---------|-------|
| Resolusi | 1080p (Full HD) | 2K / 4K |
| *Frame rate* | 15 fps | 30 fps |
| Sudut pandang (*field of view*) | ≥ 90° | ≥ 120° |
| Posisi kamera | Menghadap area tempat duduk mahasiswa | Dua kamera: pintu masuk + area tempat duduk |
| Konektivitas | Ethernet (PoE) | Ethernet (PoE) dengan *dedicated VLAN* |
| Protokol streaming | RTSP | RTSP / ONVIF |

**Tindakan yang diperlukan:**
- Audit teknis terhadap CCTV eksisting di ruang kelas pilot untuk memastikan kesesuaian spesifikasi.
- Koordinasi dengan Bagian Sarana & Prasarana Fakultas Teknik untuk akses *feed* CCTV.

### 7.2 Server / Komputasi

| Komponen | Spesifikasi Minimum | Keterangan |
|----------|---------------------|------------|
| CPU | Intel Xeon / AMD EPYC (8 core+) | Untuk pemrosesan umum dan *serving* API |
| GPU | NVIDIA RTX 3060 (12 GB VRAM) atau setara | Untuk *inference* model pengenalan wajah |
| RAM | 32 GB | Untuk menampung model dan data *embedding* di memori |
| Storage | 500 GB SSD | Untuk OS, aplikasi, database, dan *log* |
| OS | Ubuntu 22.04 LTS | Kompatibilitas terbaik dengan *stack* Python/CUDA |

**Opsi penyediaan:**
- **On-premise:** memanfaatkan server GPU yang tersedia di laboratorium Fakultas Teknik atau Pusat Data UGM.
- **Cloud:** menggunakan layanan cloud computing (AWS/GCP/Azure) dengan GPU instance — cocok untuk fase pengembangan dan pengujian awal.

### 7.3 Jaringan

- Koneksi LAN/VLAN antara CCTV dan server pemrosesan dengan *bandwidth* minimal 10 Mbps per kamera.
- Koneksi server pemrosesan ke jaringan SIMASTER (melalui jaringan internal UGM).
- *Firewall rules* yang mengizinkan akses ke endpoint SIMASTER dari server pemrosesan.

### 7.4 Storage

| Data | Estimasi Ukuran | Kebijakan Retensi |
|------|----------------|-------------------|
| *Face embeddings* mahasiswa | ~2 KB per mahasiswa (vektor 512 dimensi) | Dihapus setelah mahasiswa lulus atau setiap akhir tahun akademik |
| Log presensi | ~0.5 KB per record | Disimpan selama 2 tahun sesuai kebijakan akademik |
| Log sistem & audit | ~1 GB per semester | Disimpan selama 1 tahun |
| Model *deep learning* | ~500 MB – 1 GB | Diperbarui sesuai kebutuhan |

> **Penting:** Sistem **tidak** menyimpan *raw image* atau rekaman video wajah mahasiswa. Hanya *face embedding* (representasi numerik) yang disimpan.

---

## 8. Keamanan Data & Privasi

### 8.1 Kerangka Hukum & Regulasi

Sistem ini dirancang dengan memperhatikan kepatuhan terhadap:

1. **Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP):**
   - Data biometrik wajah termasuk dalam kategori **data pribadi spesifik** (Pasal 4 ayat 2) yang memerlukan perlindungan khusus.
   - Pemrosesan data pribadi spesifik hanya diperbolehkan dengan **persetujuan eksplisit** dari subjek data (Pasal 34).
   - Kewajiban pengendali data untuk menjaga kerahasiaan, integritas, dan ketersediaan data (Pasal 35).

2. **Peraturan internal UGM** terkait pengelolaan data mahasiswa dan penggunaan infrastruktur teknologi informasi.

### 8.2 Klasifikasi Data

| Jenis Data | Klasifikasi | Perlakuan |
|------------|-------------|-----------|
| *Face embedding* | **Data Pribadi Spesifik (Biometrik)** | Enkripsi, akses terbatas, consent wajib |
| NIM & nama mahasiswa | Data Pribadi Umum | Akses terbatas sesuai kebutuhan |
| Log presensi | Data Akademik | Akses sesuai otorisasi |
| Log sistem | Data Operasional | Akses administrator |

### 8.3 Kebijakan Persetujuan (*Informed Consent*)

- Setiap mahasiswa peserta pilot **wajib** menandatangani formulir *informed consent* sebelum proses *enrollment* wajah.
- Formulir *consent* mencakup:
  - Penjelasan tujuan pengumpulan data biometrik.
  - Jenis data yang dikumpulkan dan cara penyimpanannya.
  - Hak mahasiswa untuk menarik persetujuan (*opt-out*) kapan saja.
  - Mekanisme *opt-out*: mahasiswa yang menolak akan menggunakan presensi manual sebagai alternatif.
  - Informasi kontak penanggung jawab perlindungan data.
- Template formulir *informed consent* terlampir pada **Lampiran C**.

### 8.4 Perlindungan Teknis

| Aspek | Implementasi |
|-------|-------------|
| Enkripsi *at-rest* | AES-256 untuk database *embedding* dan log presensi |
| Enkripsi *in-transit* | TLS 1.3 untuk seluruh komunikasi antar komponen |
| Autentikasi API | OAuth2 / JWT dengan *token expiry* |
| *Access control* | RBAC (*Role-Based Access Control*): Admin, Dosen, Sistem |
| *Audit log* | Pencatatan setiap akses, modifikasi, dan penghapusan data dengan *timestamp* dan identitas pengakses |
| *Network security* | CCTV *feed* melalui VLAN terpisah; *firewall rules* ketat |
| *Data minimization* | Hanya *face embedding* yang disimpan; **tidak ada penyimpanan *raw image*** |
| Isolasi data pilot | Data pilot disimpan terpisah dari data produksi SIMASTER |

### 8.5 Kebijakan Retensi Data

| Data | Periode Retensi | Tindakan Setelah Periode |
|------|----------------|--------------------------|
| *Face embedding* | Sampai akhir semester pilot atau mahasiswa *opt-out* | Dihapus secara permanen (*secure delete*) |
| Log presensi | 2 tahun akademik | Diarsipkan sesuai kebijakan akademik UGM |
| *Audit log* | 1 tahun | Dihapus secara permanen |

### 8.6 Kontrol Akses

| Role | Hak Akses |
|------|-----------|
| **Administrator Sistem** | Konfigurasi sistem, manajemen *embedding*, *audit log* |
| **Dosen Pengampu** | Lihat presensi MK sendiri, *override* manual, rekapitulasi |
| **Mahasiswa** | Lihat status presensi sendiri (melalui SIMASTER) |
| **DTI** | Monitoring integrasi, akses *log* teknis |
| **Pimpinan Fakultas** | Rekapitulasi agregat (tanpa data biometrik) |

### 8.7 Persetujuan Etik

Apabila diperlukan oleh regulasi UGM, pengajuan persetujuan akan disampaikan kepada **Komite Etik Penelitian** Universitas Gadjah Mada, mengingat sistem ini melibatkan pengumpulan data biometrik dari subjek manusia.

---

## 9. Alur Proses (*User Flow*)

### 9.1 Proses Enrollment (Registrasi Awal)

```
┌──────────────┐     ┌────────────────────┐     ┌─────────────────────┐
│ Mahasiswa     │────▶│ Informed Consent   │────▶│ Pengambilan Foto    │
│ mendaftar     │     │ (tanda tangan)     │     │ Wajah / Ambil dari  │
│ pilot         │     │                    │     │ Data SIMASTER (KTM) │
└──────────────┘     └────────────────────┘     └──────────┬──────────┘
                                                           │
                                                           ▼
                                              ┌─────────────────────┐
                                              │ Generate Face       │
                                              │ Embedding           │
                                              │ (Vektor 512-d)      │
                                              └──────────┬──────────┘
                                                           │
                                                           ▼
                                              ┌─────────────────────┐
                                              │ Simpan Embedding    │
                                              │ ke Database Lokal   │
                                              │ (terenkripsi)       │
                                              └─────────────────────┘
```

1. Mahasiswa yang terdaftar pada mata kuliah pilot dihubungi dan diminta menandatangani *informed consent*.
2. Foto wajah mahasiswa diambil secara langsung (beberapa sudut wajah) **atau** diambil dari data foto yang sudah tersimpan di SIMASTER (foto KTM).
3. Sistem menghasilkan *face embedding* dari foto dan menyimpannya dalam database terenkripsi.
4. Mahasiswa yang memilih *opt-out* tidak di-*enroll* dan menggunakan presensi manual.

### 9.2 Proses Presensi Harian (Otomatis)

```
┌──────────────┐     ┌────────────────────┐     ┌─────────────────────┐
│ Mahasiswa     │────▶│ CCTV menangkap     │────▶│ Face Detection      │
│ memasuki      │     │ video frame        │     │ & Recognition       │
│ ruang kelas   │     │                    │     │                     │
└──────────────┘     └────────────────────┘     └──────────┬──────────┘
                                                           │
                                                    ┌──────┴──────┐
                                                    │             │
                                                    ▼             ▼
                                            ┌───────────┐  ┌───────────┐
                                            │ Match     │  │ Tidak     │
                                            │ ditemukan │  │ dikenali  │
                                            │ (≥ 0.6)  │  │ (< 0.6)  │
                                            └─────┬─────┘  └─────┬─────┘
                                                  │               │
                                                  ▼               ▼
                                            ┌───────────┐  ┌───────────┐
                                            │ Record    │  │ Tandai    │
                                            │ presensi  │  │ untuk     │
                                            │ HADIR ke  │  │ review    │
                                            │ SIMASTER  │  │ dosen     │
                                            └───────────┘  └───────────┘
```

1. Pada waktu perkuliahan (sesuai jadwal dari SIMASTER), sistem secara otomatis aktif dan mulai memproses *feed* CCTV.
2. Setiap *frame* dianalisis untuk mendeteksi wajah.
3. Wajah yang terdeteksi dicocokkan dengan database *embedding* mahasiswa yang terdaftar pada mata kuliah tersebut.
4. Jika *match* ditemukan dengan *confidence* ≥ threshold, presensi otomatis dicatat ke SIMASTER.
5. Jika *confidence* di bawah threshold atau wajah tidak dikenali, notifikasi dikirim ke *dashboard* dosen untuk verifikasi manual.

### 9.3 Verifikasi Dosen (Dashboard)

1. Dosen membuka *dashboard* presensi melalui browser (terintegrasi atau berdiri sendiri).
2. Dashboard menampilkan daftar mahasiswa yang terdaftar pada sesi kuliah aktif beserta status presensi (*hadir*, *belum terdeteksi*, *confidence rendah*).
3. Dosen dapat melakukan *override* manual:
   - Menandai mahasiswa hadir yang gagal terdeteksi oleh sistem.
   - Menandai mahasiswa tidak hadir jika terdeteksi secara salah (*false positive*).
4. Dosen mengkonfirmasi finalisasi presensi di akhir sesi kuliah.

### 9.4 Mekanisme *Fallback*

Untuk memastikan keberlangsungan proses presensi, mekanisme *fallback* disediakan:

- **Jika sistem pengenalan wajah tidak berfungsi** (gangguan teknis, server *down*): presensi dilakukan secara manual (tanda tangan atau daftar hadir dosen).
- **Jika mahasiswa gagal terdeteksi berulang kali:** dosen dapat mencatat kehadiran secara manual melalui *dashboard*.
- **Jika mahasiswa *opt-out*:** presensi manual digunakan untuk mahasiswa tersebut.

---

## 10. Timeline & Milestones

| Fase | Durasi | Aktivitas Utama | Deliverable |
|------|--------|-----------------|-------------|
| **Fase 1: Persiapan** | 4 minggu | - Audit teknis CCTV di ruang pilot<br>- Pengajuan & koordinasi akses SIMASTER ke DTI<br>- *Setup* infrastruktur server<br>- Finalisasi desain arsitektur | Laporan audit CCTV; akses SIMASTER (staging); server siap |
| **Fase 2: Pengembangan** | 8 minggu | - Pengembangan modul *stream capture*<br>- Pengembangan modul *face recognition*<br>- Integrasi dengan API/data SIMASTER<br>- Pengembangan *dashboard* dosen<br>- *Unit testing* & *integration testing* | Sistem *end-to-end* berfungsi di *staging* |
| **Fase 3: Enrollment** | 2 minggu | - Sosialisasi kepada mahasiswa peserta pilot<br>- Pengumpulan *informed consent*<br>- Registrasi wajah mahasiswa<br>- Validasi database *embedding* | Database *embedding* lengkap; *consent forms* terkumpul |
| **Fase 4: Pilot Testing (UAT)** | 4 minggu | - Pengujian sistem di ruang kelas pilot<br>- *User Acceptance Testing* dengan dosen dan mahasiswa<br>- Iterasi perbaikan berdasarkan *feedback*<br>- Monitoring performa & akurasi | Laporan UAT; *bug fixes* diterapkan |
| **Fase 5: Evaluasi** | 2 minggu | - Analisis data akurasi dan performa<br>- Survei kepuasan pengguna<br>- Penyusunan laporan evaluasi<br>- Rekomendasi untuk *scale-up* | Laporan evaluasi final; rekomendasi |
| **Total** | **~20 minggu** | | |

### Milestones Kunci

| Minggu ke- | Milestone |
|------------|-----------|
| 2 | Audit CCTV selesai; spesifikasi CCTV tervalidasi |
| 4 | Akses *staging* SIMASTER diperoleh; server ter-*setup* |
| 8 | Modul *face recognition* berfungsi dengan akurasi ≥ 90% pada data uji |
| 12 | Integrasi SIMASTER berhasil (*end-to-end test* lewat) |
| 14 | *Enrollment* mahasiswa selesai |
| 18 | UAT selesai; sistem stabil untuk penggunaan harian |
| 20 | Laporan evaluasi final disampaikan kepada pemangku kepentingan |

---

## 11. Risiko & Mitigasi

| No. | Risiko | Probabilitas | Dampak | Strategi Mitigasi |
|-----|--------|-------------|--------|-------------------|
| 1 | CCTV eksisting memiliki resolusi rendah (< 720p) | Sedang | Tinggi — akurasi pengenalan menurun signifikan | Audit teknis di awal; jika tidak memenuhi spesifikasi, ajukan penambahan/penggantian kamera |
| 2 | Penolakan atau keterlambatan akses SIMASTER oleh DTI | Tinggi | Tinggi — proyek terhambat | Siapkan mekanisme *offline/batch sync* (Opsi 3); jalin komunikasi intensif dengan DTI sejak awal |
| 3 | Tingkat *false positive/negative* tinggi | Sedang | Sedang — kepercayaan pengguna menurun | Kalibrasi *threshold confidence*; sediakan mekanisme *override* manual; lakukan *re-training* jika perlu |
| 4 | Penolakan mahasiswa karena kekhawatiran privasi | Sedang | Tinggi — gagal memenuhi target *enrollment* | Sosialisasi transparan; *informed consent* yang jelas; opsi *opt-out* tanpa konsekuensi akademik |
| 5 | Pencahayaan ruangan tidak memadai | Rendah | Sedang — kualitas deteksi menurun | Evaluasi pencahayaan saat audit; gunakan kamera IR (*infrared*) atau rekomendasikan perbaikan pencahayaan |
| 6 | Perubahan penampilan mahasiswa (masker, kacamata, hijab) | Sedang | Sedang — gagal *match* | *Re-enrollment* periodik; *capture* multi-sudut saat *enrollment*; model yang robust terhadap oklusi parsial |
| 7 | Server *down* atau gangguan jaringan | Rendah | Tinggi — presensi tidak tercatat | *Fallback* presensi manual; *local buffer* untuk menyimpan data sementara hingga koneksi pulih |
| 8 | Pelanggaran keamanan data (*data breach*) | Rendah | Sangat Tinggi — risiko hukum dan reputasi | Enkripsi berlapis; *access control* ketat; *audit log*; *incident response plan* |

---

## 12. Estimasi Biaya

| No. | Komponen | Estimasi Biaya | Keterangan |
|-----|----------|----------------|------------|
| 1 | Server GPU (on-premise / cloud) | Rp 5.000.000 – Rp 15.000.000 /semester | Cloud: ~$50–150/bulan untuk GPU instance; On-premise: memanfaatkan lab FT |
| 2 | Lisensi *software* | Rp 0 | Seluruh *stack* menggunakan *open-source* |
| 3 | Upgrade CCTV (jika diperlukan) | Rp 3.000.000 – Rp 8.000.000 /kamera | Hanya jika CCTV eksisting tidak memenuhi spesifikasi |
| 4 | Biaya jaringan tambahan | Rp 0 – Rp 2.000.000 | Jika diperlukan konfigurasi VLAN tambahan |
| 5 | Operasional bulanan (listrik, internet) | Rp 500.000 – Rp 1.000.000 /bulan | Asumsi menggunakan infrastruktur UGM |
| 6 | Pengembangan (*man-hour*) | Rp 0 | Dikerjakan sebagai proyek mahasiswa / tugas akhir |
| **Total estimasi** | | **Rp 5.500.000 – Rp 26.000.000 /semester** | |

**Catatan:**
- Sebagian besar komponen dapat diperoleh tanpa biaya dengan memanfaatkan infrastruktur dan fasilitas yang sudah tersedia di UGM (server laboratorium, jaringan kampus, CCTV eksisting).
- Biaya tertinggi bersumber dari kebutuhan komputasi GPU, yang dapat diminimalkan dengan memanfaatkan *server* GPU di laboratorium Fakultas Teknik atau dengan pengajuan akses ke Pusat Data UGM.
- Tidak terdapat biaya lisensi *software* karena seluruh *tech stack* yang direkomendasikan bersifat *open-source*.

---

## 13. Tim & Stakeholder

### 13.1 Tim Pengembang

| Peran | Nama | Afiliasi |
|-------|------|----------|
| **Pengusul / Pengembang Utama** | [Nama Mahasiswa] | Mahasiswa S1, Fakultas Teknik UGM |
| **Pembimbing Teknis** | [Nama Dosen Pembimbing] | Dosen, Departemen [Nama Departemen], FT UGM |

### 13.2 Stakeholder

| Stakeholder | Peran dalam Proyek | Kontribusi yang Diharapkan |
|------------|--------------------|-----------------------------|
| **DTI UGM** | Penyedia akses data & infrastruktur IT | Akses API/data SIMASTER; *staging environment*; dukungan teknis |
| **Wakil Dekan Bidang Akademik FT UGM** | Pemberi persetujuan akademik | Persetujuan pelaksanaan pilot; dukungan kebijakan |
| **Bagian Sarana & Prasarana FT UGM** | Penyedia akses CCTV | Akses *feed* CCTV ruang kelas; informasi teknis kamera |
| **Dosen Pengampu MK Pilot** | Verifikator presensi | Partisipasi aktif dalam UAT; *feedback* operasional |
| **Mahasiswa Peserta Pilot** | Pengguna akhir | Registrasi wajah; partisipasi dalam pilot; *feedback* |
| **Bagian Keamanan IT UGM** | Validator keamanan sistem | Review arsitektur keamanan; persetujuan *deployment* |

### 13.3 Matriks RACI

| Aktivitas | Pengusul | Pembimbing | DTI | Wakil Dekan | Sarpras |
|-----------|----------|------------|-------|-------------|---------|
| Pengembangan sistem | **R** | C | I | I | — |
| Audit CCTV | **R** | C | I | I | **A** |
| Integrasi SIMASTER | **R** | C | **A** | I | — |
| *Enrollment* mahasiswa | **R** | C | — | **A** | — |
| UAT & evaluasi | **R** | **A** | C | I | — |
| Persetujuan kebijakan | C | C | C | **A** | — |

> R = *Responsible*, A = *Accountable*, C = *Consulted*, I = *Informed*

---

## 14. Lampiran

### Lampiran A: Mockup Dashboard Presensi

```
┌─────────────────────────────────────────────────────────────────────┐
│  DASHBOARD PRESENSI — Sistem Pengenalan Wajah                      │
│  ─────────────────────────────────────────────────────────────────  │
│  Mata Kuliah: TIF1234 — Kecerdasan Buatan     Dosen: Dr. Ahmad S.  │
│  Jadwal: Senin, 07:30-09:10   Ruang: KPFT-301    Sesi ke-5        │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Status Presensi Real-time        Ringkasan                        │
│  ┌───────────────────────────┐    ┌─────────────────────────┐      │
│  │ No │ NIM      │ Nama     │    │ Total Peserta : 45      │      │
│  │────┼──────────┼──────────│    │ Hadir         : 38 (84%)│      │
│  │  1 │ 21/477.. │ Andi S.  │    │ Belum         :  5 (11%)│      │
│  │    │ ✅ HADIR │ 07:28:15 │    │ Conf. Rendah  :  2  (4%)│      │
│  │  2 │ 21/478.. │ Budi P.  │    └─────────────────────────┘      │
│  │    │ ✅ HADIR │ 07:29:02 │                                      │
│  │  3 │ 21/479.. │ Citra W. │    [Finalisasi Presensi]             │
│  │    │ ⚠️ LOW   │ conf:0.52│    [Ekspor Rekapitulasi]             │
│  │    │ [✅] [❌] │          │                                      │
│  │  4 │ 21/480.. │ Dewi R.  │                                      │
│  │    │ ⏳ BELUM │    —     │                                      │
│  │ .. │ ........ │ ........ │                                      │
│  └───────────────────────────┘                                      │
│                                                                     │
│  [◀ Sesi Sebelumnya]                      [Sesi Selanjutnya ▶]     │
└─────────────────────────────────────────────────────────────────────┘
```

### Lampiran B: Diagram Arsitektur Detail

```
                            ┌─────────────────────────────────────────┐
                            │         JARINGAN INTERNAL UGM           │
                            └───────────────────┬─────────────────────┘
                                                │
          ┌─────────────────────────────────────┼─────────────────────────────┐
          │                                     │                             │
          ▼                                     ▼                             ▼
┌──────────────────┐              ┌──────────────────────┐        ┌───────────────────┐
│   CCTV Kelas 1   │              │   SERVER PROCESSING   │        │     SIMASTER       │
│   (RTSP Feed)    │─────────────▶│                      │◀──────▶│   (REST API /      │
│                  │  Video Feed  │  ┌────────────────┐  │  JSON  │    Database)       │
│   CCTV Kelas 2   │─────────────▶│  │ Stream Capture │  │        │                   │
│   (RTSP Feed)    │              │  │ (OpenCV/RTSP)  │  │        │  - Data Mahasiswa  │
└──────────────────┘              │  └───────┬────────┘  │        │  - Jadwal & KRS    │
                                  │          │           │        │  - Record Presensi │
                                  │          ▼           │        └───────────────────┘
                                  │  ┌────────────────┐  │
                                  │  │ Face Detection │  │
                                  │  │ (InsightFace)  │  │
                                  │  └───────┬────────┘  │
                                  │          │           │
                                  │          ▼           │
                                  │  ┌────────────────┐  │
                                  │  │ Face Embedding │  │
                                  │  │ (ArcFace 512d) │  │
                                  │  └───────┬────────┘  │
                                  │          │           │
                                  │          ▼           │
                                  │  ┌────────────────┐  │       ┌───────────────────┐
                                  │  │ Matching       │  │       │   PostgreSQL +     │
                                  │  │ Service        │◀─┼──────▶│   pgvector         │
                                  │  │ (Cosine Sim.)  │  │       │   (Embedding DB)   │
                                  │  └───────┬────────┘  │       └───────────────────┘
                                  │          │           │
                                  │          ▼           │
                                  │  ┌────────────────┐  │
                                  │  │ Attendance API │  │
                                  │  │ (FastAPI)      │──┼──────▶ SIMASTER API
                                  │  └───────┬────────┘  │
                                  │          │           │
                                  └──────────┼───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │  Dashboard Web App   │
                                  │  (React/Vue.js)      │
                                  │  - Presensi realtime │
                                  │  - Override manual   │
                                  │  - Rekapitulasi      │
                                  └──────────────────────┘
                                             │
                                    ┌────────┴────────┐
                                    ▼                 ▼
                              ┌──────────┐     ┌──────────┐
                              │  Browser │     │  Browser │
                              │  Dosen   │     │  Admin   │
                              └──────────┘     └──────────┘
```

### Lampiran C: Template Informed Consent

---

**FORMULIR PERSETUJUAN PARTISIPASI (*INFORMED CONSENT*)**

**Proyek:** Sistem Presensi Otomatis Berbasis Pengenalan Wajah — Pilot Fakultas Teknik UGM

**Penyelenggara:** [Nama Mahasiswa], Fakultas Teknik, Universitas Gadjah Mada

---

Dengan menandatangani formulir ini, saya menyatakan bahwa:

1. Saya telah menerima penjelasan yang memadai mengenai tujuan, prosedur, dan manfaat dari proyek pilot sistem presensi berbasis pengenalan wajah ini.

2. Saya memahami bahwa:
   - Data biometrik wajah saya akan diambil dan diproses menjadi representasi numerik (*face embedding*) untuk keperluan presensi perkuliahan.
   - Sistem **tidak** menyimpan foto/gambar asli wajah saya, melainkan hanya representasi numerik terenkripsi.
   - Data saya akan disimpan secara aman dengan enkripsi dan hanya diakses oleh pihak yang berwenang.
   - Data biometrik saya akan dihapus secara permanen setelah periode pilot berakhir atau kapan pun saya menarik persetujuan.

3. Saya memahami bahwa partisipasi saya bersifat **sukarela** dan saya berhak:
   - Menarik persetujuan kapan saja tanpa konsekuensi akademik.
   - Meminta penghapusan data biometrik saya dari sistem.
   - Menggunakan metode presensi manual sebagai alternatif.

4. Saya menyetujui / tidak menyetujui **(coret yang tidak sesuai)** partisipasi dalam proyek pilot ini.

| | |
|---|---|
| Nama Lengkap | : ______________________________________ |
| NIM | : ______________________________________ |
| Program Studi | : ______________________________________ |
| Tanda Tangan | : ______________________________________ |
| Tanggal | : ______________________________________ |

---

### Lampiran D: Draft Surat Permohonan Akses SIMASTER kepada DTI

---

**[KOP SURAT FAKULTAS TEKNIK UGM]**

Nomor : ……/UN1/FT/…./2026
Lamp. : 1 (satu) berkas
Hal : **Permohonan Akses API/Data SIMASTER untuk Proyek Pilot Sistem Presensi Berbasis Pengenalan Wajah**

Kepada Yth.
Direktur Direktorat Teknologi Informasi (DTI)
Universitas Gadjah Mada
di Yogyakarta

Dengan hormat,

Sehubungan dengan rencana pelaksanaan proyek pilot **Sistem Presensi Otomatis Berbasis Pengenalan Wajah Terintegrasi SIMASTER** di lingkungan Fakultas Teknik UGM, bersama ini kami mengajukan permohonan akses terhadap data dan/atau *Application Programming Interface* (API) SIMASTER sebagai berikut:

**A. Data yang Dibutuhkan (Read Access):**
1. Data mahasiswa (NIM, nama lengkap, foto KTM) untuk peserta mata kuliah pilot.
2. Data mata kuliah dan jadwal perkuliahan (kode MK, jadwal, ruang, dosen pengampu).
3. Data Kartu Rencana Studi (KRS) / daftar peserta per mata kuliah.

**B. Akses Tulis (Write Access):**
1. Endpoint atau mekanisme untuk mengirimkan record presensi (NIM, kode MK, *timestamp*, status kehadiran).

**C. Fasilitas Pendukung:**
1. Akses ke *sandbox/staging environment* SIMASTER untuk pengembangan dan pengujian.
2. Dokumentasi teknis API SIMASTER yang relevan.
3. Penunjukan *point of contact* teknis dari DTI untuk koordinasi.

Proyek ini berskala pilot dengan ruang lingkup terbatas (1–2 ruang kelas, 50–100 mahasiswa, 1 semester) dan telah memperhatikan aspek keamanan data serta kepatuhan terhadap UU PDP. Dokumen *Product Requirements Document* (PRD) terlampir sebagai referensi teknis.

Atas perhatian dan kerja sama Bapak/Ibu, kami mengucapkan terima kasih.

Yogyakarta, ………………… 2026

Mengetahui,
Wakil Dekan Bidang Akademik
Fakultas Teknik UGM

**[Nama & Tanda Tangan]**
NIP. ……………………………

Pengusul,

**[Nama Mahasiswa]**
NIM. ……………………………

---

### Lampiran E: Referensi Teknis

1. **Deng, J., Guo, J., Xue, N., & Zafeiriou, S.** (2019). *ArcFace: Additive Angular Margin Loss for Deep Face Recognition.* Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR). — Basis model pengenalan wajah yang direkomendasikan.

2. **Schroff, F., Kalenichenko, D., & Philbin, J.** (2015). *FaceNet: A Unified Embedding for Face Recognition and Clustering.* Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR). — Arsitektur alternatif untuk *face embedding*.

3. **InsightFace** — Library *open-source* untuk deteksi dan pengenalan wajah. Repositori: https://github.com/deepinsight/insightface

4. **DeepFace** — Framework *face recognition* Python yang *lightweight*. Repositori: https://github.com/serengil/deepface

5. **pgvector** — Ekstensi PostgreSQL untuk pencarian vektor. Repositori: https://github.com/pgvector/pgvector

6. **Undang-Undang Nomor 27 Tahun 2022** tentang Perlindungan Data Pribadi (UU PDP), Republik Indonesia.

7. **FastAPI** — Framework web Python modern untuk membangun API. Dokumentasi: https://fastapi.tiangolo.com

---

*Dokumen ini disusun sebagai dasar pengajuan proyek pilot dan tidak mengikat secara hukum. Seluruh data contoh yang digunakan bersifat ilustratif.*

**— Akhir Dokumen —**
