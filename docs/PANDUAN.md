# Panduan Penggunaan & Dokumentasi Teknis
## DApp Sistem Pencatatan Pelanggaran & Prestasi Etika Mahasiswa (EthicsKomdis)

Dokumen ini berisi penjelasan menyeluruh mengenai arsitektur sistem, logika kontrak pintar (smart contract), panduan instalasi, konfigurasi, serta petunjuk operasional lengkap untuk DApp **EthicsKomdis**.

---

## Daftar Isi
1. [Latar Belakang & Deskripsi Sistem](#1-latar-belakang--deskripsi-sistem)
2. [Arsitektur Proyek (Struktur Monorepo)](#2-arsitektur-proyek-struktur-monorepo)
3. [Analisis Logika Smart Contract (`EthicsKomdis.sol`)](#3-analisis-logika-smart-contract-ethicskomdissol)
4. [Petunjuk Instalasi & Konfigurasi](#4-petunjuk-instalasi--konfigurasi)
5. [Panduan Operasional Fitur DApp](#5-panduan-operasional-fitur-dapp)
6. [Troubleshooting & Penanganan Masalah](#6-troubleshooting--penanganan-masalah)

---

## 1. Latar Belakang & Deskripsi Sistem

Di lingkungan akademis perguruan tinggi, pencatatan pelanggaran etika dan pencapaian prestasi mahasiswa seringkali dikelola menggunakan sistem konvensional (basis data terpusat atau bahkan manual). Sistem seperti ini memiliki beberapa kelemahan kritis:
- **Kerentanan Manipulasi**: Data nilai atau poin dapat diubah secara ilegal oleh oknum yang memiliki akses basis data.
- **Kurangnya Transparansi**: Mahasiswa seringkali tidak mengetahui secara *real-time* riwayat penambahan poin pelanggaran atau prestasi mereka.
- **Proses Birokrasi Lambat**: Pembekuan Kartu Rencana Studi (KRS) atau beasiswa akibat pelanggaran etika memerlukan proses administrasi manual yang memakan waktu.

**DApp EthicsKomdis** memecahkan masalah ini dengan memanfaatkan teknologi **Blockchain**. Sistem ini mencatat setiap pelanggaran dan prestasi mahasiswa ke dalam buku besar terdistribusi (ledger) yang bersifat **Immutable** (tidak dapat diubah) dan **Transparent** (dapat diaudit oleh siapa saja). Sistem ini dilengkapi dengan **Smart Enforcement Logic** yang secara otomatis membekukan hak KRS mahasiswa jika akumulasi poin pelanggaran bersih mereka melebihi ambang batas yang ditentukan.

---

## 2. Arsitektur Proyek (Struktur Monorepo)

Proyek ini dibangun menggunakan struktur **Monorepo** 4-folder untuk menjaga keteraturan kode antara backend blockchain dan frontend aplikasi web.

```
e:\Blockchain\
├── docs/             # Dokumen alur bisnis (flow.md) & Panduan ini (PANDUAN.md)
├── backend/          # Kontrak pintar Solidity, skrip deploy, & konfigurasi Hardhat
├── konektor/         # Modul integrasi Ethers.js untuk menjembatani MetaMask dengan Frontend
└── antarmuka/        # Kode frontend web menggunakan React.js, Tailwind CSS, & Lucide React
```

### Penjelasan Folder:
- **`docs/`**: Berisi file dokumentasi bisnis dan panduan sistem.
- **`backend/`**: Berisi lingkungan kerja Hardhat. Berkas utama di sini adalah `contracts/EthicsKomdis.sol` (smart contract utama) dan `scripts/deploy.cjs` (skrip deployment ke jaringan blockchain).
- **`konektor/`**: Berisi `ethicConnector.js` yang mengekspor fungsi-fungsi utilitas Ethers.js untuk koneksi wallet, inisialisasi kontrak, pemformatan address, dan manajemen event listener.
- **`antarmuka/`**: Berisi aplikasi React yang menyajikan dashboard interaktif bagi Admin Komdis maupun Mahasiswa.

---

## 3. Analisis Logika Smart Contract (`EthicsKomdis.sol`)

Kontrak pintar dirancang menggunakan bahasa **Solidity ^0.8.20** dengan beberapa fitur utama:

### 3.1 Skema Data Mahasiswa (`struct Student`)
Setiap data mahasiswa disimpan dalam mapping dengan NIM (Nomor Induk Mahasiswa) sebagai kata kunci unik (`primary key`).
```solidity
struct Student {
    string name;             // Nama lengkap mahasiswa
    uint256 violationPoints; // Akumulasi poin pelanggaran
    uint256 rewardPoints;    // Akumulasi poin apresiasi/prestasi
    bool isFrozen;           // Status pembekuan KRS (true = dibekukan)
    bool isRegistered;       // Menandakan apakah NIM telah terdaftar
}
```

### 3.2 Hak Akses Khusus (`modifier onlyKomdis`)
Keamanan sistem dijaga melalui pembatasan akses. Fungsi untuk mendaftarkan mahasiswa, menambah pelanggaran, dan menambah prestasi dilindungi oleh modifier `onlyKomdis`. Hanya address pemilik/deployer kontrak (`adminKomdis`) yang berhak memanggil fungsi-fungsi mutasi state tersebut.
```solidity
modifier onlyKomdis() {
    require(
        msg.sender == adminKomdis,
        "EthicsKomdis: Akses ditolak. Hanya Admin Komdis yang berwenang."
    );
    _;
}
```

### 3.3 Algoritma Pembekuan & Rehabilitasi KRS
Sistem menghitung **Poin Bersih (Net Points)** mahasiswa menggunakan rumus:
$$\text{Net Points} = \text{violationPoints} - \text{rewardPoints}$$

Aturan penegakan status:
1. Jika $\text{Net Points} \ge 100$, status `isFrozen` otomatis diubah menjadi `true` (KRS dibekukan).
2. Jika $\text{Net Points} < 100$ (misalnya setelah mahasiswa diberikan poin apresiasi atas prestasinya), status `isFrozen` otomatis dicabut kembali menjadi `false` (rehabilitasi status aktif).

### 3.4 Proteksi Terhadap Integer Underflow
Tipe data `uint256` di Solidity tidak mendukung nilai negatif. Apabila `rewardPoints` lebih besar daripada `violationPoints`, pengurangan langsung (`violationPoints - rewardPoints`) akan memicu error pembagian/operasi matematika (revert). 

Untuk mengatasinya, dibuat fungsi helper internal `_calculateNetPoints`:
```solidity
function _calculateNetPoints(
    uint256 violationPts,
    uint256 rewardPts
) internal pure returns (uint256) {
    if (violationPts >= rewardPts) {
        return violationPts - rewardPts;
    } else {
        return 0; // Mengamankan nilai minimum tetap 0 jika prestasi > pelanggaran
    }
}
```

### 3.5 Event Log sebagai Audit Trail
Setiap perubahan data memancarkan `event` on-chain yang tersimpan di dalam logs transaksi blockchain:
- `LogStudentRegistered`
- `LogViolationAdded`
- `LogRewardAdded`
- `LogStudentFrozen`
- `LogStudentUnfrozen`

Logs ini dapat dibaca oleh frontend untuk menyajikan riwayat aktivitas (audit ledger) yang valid tanpa perlu bergantung pada database eksternal.

---

## 4. Petunjuk Instalasi & Konfigurasi

Berikut langkah-langkah untuk menjalankan DApp ini secara lokal di komputer Anda menggunakan sistem operasi Windows.

### Prasyarat:
- **Node.js** (versi 18.x atau yang lebih baru)
- **Git**
- Ekstensi browser **MetaMask**

---

### Langkah 1: Instalasi Dependensi
Buka terminal PowerShell pada direktori root proyek (`e:\Blockchain`), lalu jalankan perintah:
```powershell
# Menginstal dependensi backend (Hardhat)
npm install
```

Kemudian masuk ke folder `antarmuka` untuk menginstal dependensi frontend:
```powershell
cd antarmuka
npm install
```
Kembali ke folder utama:
```powershell
cd ..
```

---

### Langkah 2: Jalankan Local Blockchain Hardhat
Gunakan Hardhat untuk mensimulasikan jaringan Ethereum lokal di komputer Anda. Jalankan perintah berikut di terminal pertama:
```powershell
npx hardhat node
```
*Terminal ini harus tetap aktif selama Anda menjalankan aplikasi. Hardhat akan menyediakan 20 akun tester lengkap dengan private key masing-masing akun yang berisi 10000 ETH tiruan.*

---

### Langkah 3: Kompilasi & Deploy Smart Contract
Buka terminal kedua (tetap di direktori `e:\Blockchain`), lalu jalankan perintah migrasi kontrak ke jaringan lokal:
```powershell
npx hardhat run backend/scripts/deploy.cjs --network localhost
```
Setelah berhasil, terminal akan menampilkan log seperti berikut:
```text
EthicsKomdis deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Deployer (Admin Komdis) address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

### Langkah 4: Konfigurasi Alamat Kontrak di Frontend
Buka file `e:\Blockchain\antarmuka\src\App.jsx`. Pada baris ke-36, temukan variabel `CONTRACT_ADDRESS` dan ubah nilainya sesuai alamat kontrak yang baru saja ter-deploy:
```javascript
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Sesuaikan dengan output deploy Anda
```

---

### Langkah 5: Hubungkan MetaMask ke Blockchain Lokal
1. Buka ekstensi **MetaMask** di browser Anda.
2. Klik menu pilihan jaringan di pojok kiri atas, lalu pilih **Add Network** -> **Add a network manually**.
3. Isi parameter jaringan lokal berikut:
   - **Network Name**: `Hardhat Localhost`
   - **New RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
4. Klik **Save** dan beralihlah ke jaringan baru tersebut.

---

### Langkah 6: Impor Akun Admin ke MetaMask
Agar dapat bertindak sebagai **Admin Komdis**, Anda harus mengimpor akun pertama (Account #0) dari simulasi Hardhat ke MetaMask:
1. Lihat log terminal `npx hardhat node`. Cari bagian **Account #0** dan salin **Private Key**-nya (biasanya berawalan `0xac09...`).
2. Di MetaMask, klik ikon profil lingkaran Anda, pilih **Import account**.
3. Masukkan (paste) Private Key yang telah disalin, lalu klik **Import**.
4. Akun tersebut kini terhubung dan siap digunakan sebagai administrator aplikasi.

---

### Langkah 7: Jalankan Aplikasi Frontend
Masuk ke direktori frontend dan jalankan server pengembangan lokal Vite:
```powershell
cd antarmuka
npm run dev
```
Setelah aktif, buka alamat URL yang tampil di terminal (biasanya `http://localhost:5173`) di browser Anda.

---

## 5. Panduan Operasional Fitur DApp

Setelah aplikasi berjalan di browser, berikut adalah cara mengoperasikan fitur-fitur yang tersedia:

### 5.1 Menghubungkan Wallet
- Di pojok kanan atas halaman, klik tombol **Hubungkan Dompet / Connect Wallet**.
- MetaMask akan meminta konfirmasi koneksi. Pilih akun admin yang telah Anda impor sebelumnya.
- Jika berhasil terhubung, tombol akan berubah menjadi badge alamat dompet Anda (misalnya: `0xf39F...2266`) dan status jaringan akan berwarna hijau **Terkoneksi (Localhost)**.

### 5.2 Menu Pendaftaran Mahasiswa Baru (Admin)
- Menu ini hanya dapat diakses apabila dompet yang terhubung adalah address Admin Komdis.
- Masukkan **NIM** (misalnya: `10112001`) dan **Nama Lengkap** mahasiswa.
- Klik **Daftarkan Mahasiswa**.
- Setujui transaksi yang muncul pada MetaMask (transaksi lokal tanpa biaya uang asli).
- Setelah transaksi sukses, pop-up notifikasi hijau akan muncul menandakan mahasiswa berhasil didaftarkan.

### 5.3 Input Poin Pelanggaran (Admin)
- Masukkan **NIM** mahasiswa terdaftar.
- Tentukan jumlah **Poin Pelanggaran** yang ingin diberikan.
- Tulis **Deskripsi Pelanggaran** (misalnya: *Mencontek saat UTS*).
- Klik **Kirim Pelanggaran** dan setujui transaksi di MetaMask.
- Jika akumulasi poin bersih (pelanggaran dikurangi prestasi) melebihi atau sama dengan 100, status KRS mahasiswa akan otomatis berubah menjadi **DIBEKUKAN** (merah).

### 5.4 Input Poin Prestasi / Rehabilitasi (Admin)
- Masukkan **NIM** mahasiswa terdaftar.
- Masukkan jumlah **Poin Prestasi/Apresiasi** yang ingin diberikan.
- Tulis **Deskripsi Prestasi** (misalnya: *Juara 1 Lomba Blockchain Nasional*).
- Klik **Kirim Prestasi** dan setujui transaksi di MetaMask.
- Jika setelah poin prestasi ditambahkan, nilai poin bersih mahasiswa turun di bawah 100, status beku mahasiswa tersebut otomatis dicabut dan kembali menjadi **AKTIF** (hijau).

### 5.5 Pencarian Status Mahasiswa (Publik / Umum)
- Fitur ini dapat digunakan oleh siapa saja (termasuk mahasiswa) tanpa perlu menggunakan akun admin.
- Masukkan **NIM** mahasiswa pada kotak pencarian di bagian atas dashboard, lalu klik tombol cari atau tekan Enter.
- Dashboard akan menampilkan profil lengkap mahasiswa: Nama, Total Poin Pelanggaran, Total Poin Prestasi, Poin Bersih, serta **Status KRS** saat ini (Aktif / Dibekukan).

### 5.6 Audit Ledger & Riwayat Kejadian (Audit Trail)
- Bagian bawah dashboard menampilkan log riwayat kejadian secara *real-time* yang ditarik langsung dari smart contract event logs.
- Setiap aktivitas registrasi, penambahan pelanggaran, penambahan prestasi, pembekuan, dan pencabutan pembekuan akan tercatat di sini lengkap dengan hash transaksi blockchain, timestamp, dan detail kasus.

---

## 6. Troubleshooting & Penanganan Masalah

### 6.1 Transaksi Gagal dengan Kode Error: "Nonce too high" / "Replacement transaction underpriced"
- **Penyebab**: MetaMask mengingat riwayat transaksi dari sesi Hardhat sebelumnya yang nomor urutnya (nonce) sudah tidak sinkron setelah Anda merestart terminal Hardhat node.
- **Solusi**: 
  1. Buka MetaMask.
  2. Klik Profil Anda -> **Settings** -> **Advanced**.
  3. Gulir ke bawah dan klik tombol **Clear activity tab data** (atau **Reset Account** pada versi MetaMask lama).
  4. Ini akan mereset cache transaksi MetaMask tanpa memengaruhi saldo Anda, dan transaksi berikutnya akan berjalan lancar.

### 6.2 Error: "EthicsKomdis: Akses ditolak. Hanya Admin Komdis yang berwenang."
- **Penyebab**: Anda sedang mencoba mendaftarkan mahasiswa atau menambahkan poin menggunakan akun MetaMask yang bukan merupakan deployer kontrak.
- **Solusi**: Ganti akun MetaMask aktif Anda ke akun deployer (Account #0 Hardhat yang diimpor pada Langkah 6 bagian Instalasi).

### 6.3 Indikator Status Menunjukkan "Terputus" (Disconnected)
- **Penyebab**: Aplikasi frontend tidak dapat mendeteksi penyedia Web3 (MetaMask) atau terminal `npx hardhat node` terhenti.
- **Solusi**: Pastikan ekstensi MetaMask aktif di browser, dan pastikan perintah `npx hardhat node` berjalan di terminal Anda tanpa ada error crash.

---
*Dokumen panduan ini disiapkan khusus sebagai pelengkap DApp EthicsKomdis.*
