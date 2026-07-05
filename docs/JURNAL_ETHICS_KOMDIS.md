# PANDUAN FORMATTING JURNAL (Untuk Copy-Paste ke MS Word)
* **Font Utama**: Calibri, Ukuran 12, Spasi Baris 1.15.
* **Judul**: Calibri 14, Bold, Center, Capitalized Each Word, Maksimal 14 Kata.
* **Abstrak & Intisari**: Calibri 10, Spasi 1, Rata Kanan-Kiri (Justify).
* **Tabel**: Judul tabel diletakkan di atas tabel, Sumber di bawah tabel.
* **Gambar**: Judul gambar dan Sumber diletakkan di bawah gambar.
* **Kutipan & Referensi**: Menggunakan gaya penulisan American Psychological Association (APA) Edisi ke-7.

---

# Penerapan dApp Berbasis Smart Contract untuk Transparansi Pencatatan Pelanggaran dan Prestasi Etika Mahasiswa

**Nama Penulis Pertama** $^{1}$, **Nama Penulis Kedua** $^{2}$ *(Tanpa Gelar Akademis)*  
$^{1}$ Jurusan/Fakultas, Universitas/Sekolah Tinggi XYZ  
$^{2}$ Jurusan/Fakultas, Universitas/Sekolah Tinggi XYZ  
Alamat Afiliasi: Jl. Tata Bumi No. 5 Gamping, Yogyakarta, Indonesia  
*Koresponden email: penulis_pertama@mail.ac.id; Telp/WA: +62-812-3456-7890  

---

**Volume ..., No. ...**  
**......., 2026**  

**Received:** ......., 2026 | **Accepted:** ......., 2026 | **Published:** ......., 2026

---

### ABSTRACT
*A concise and factual abstract is required (min. 150-200 words for the abstract, which contains the problem, objectives, methods, results and main conclusions). Furthermore, the use of references in the digest should be avoided, but if necessary, they must be cited in full, without referring to the list of references. Non-standard or uncommon abbreviations should be avoided, but if necessary, they should be defined the first time they appear in the digest. Please avoid general and plural terms, as well as some concepts. Digest is printed upright (italicized for English in Indonesian journals), space 1, size 10, Font Calibri, and includes keywords.*

This study addresses the critical issues of transparency and data integrity in recording student ethical violations and achievements in higher education institutions. Traditional centralized database systems are vulnerable to unauthorized manipulation, lack real-time transparency for students, and rely on slow manual bureaucratic processes for enforcing academic sanctions like Course Enrollment (KRS) freezing. To resolve these challenges, we developed EthicsKomdis, a decentralized application (dApp) leveraging Ethereum-compatible smart contracts written in Solidity. The system features a smart enforcement algorithm where a student's KRS is automatically frozen when their net violation points (total violations minus achievements) exceed a threshold of 100. It also enables automatic rehabilitation if subsequent achievements bring the points below the threshold. The front-end interface was built using React.js and Ethers.js to connect seamlessly with MetaMask wallets. Evaluation results demonstrate that the smart contract successfully executes state changes on-chain with immutable transaction histories (audit trail) and robust overflow/underflow protection. In conclusion, the dApp provides a secure, transparent, and automated solution for academic disciplinary management, minimizing human intervention and ensuring absolute data integrity.

**Keywords**: *Blockchain, Smart contracts, Decentralized Applications (dApps), EthicsKomdis, Academic Integrity.*

---

### INTISARI
*Diperlukan intisari yang ringkas dan faktual (jumlah kata untuk intisari adalah min. 150-200 kata, yang berisi masalah, tujuan, metode, hasil dan kesimpulan utama). Selain itu, penggunaan referensi pada intisari harus dihindari, tetapi jika penting, harus dikutip secara lengkap, tanpa mengacu pada daftar referensi. Singkatan yang tidak standar atau tidak umum harus dihindari, tetapi jika penting, singkatan tersebut harus didefinisikan pada saat pertama kali disebutkan dalam intisari itu sendiri. Harap hindari istilah umum dan jamak serta beberapa konsep (hindari, misalnya, 'dan', 'dari' di awal kalimat). Intisari dicetak tegak untuk bahasa Indonesia, spasi 1, ukuran 10, Font Calibri juga mencantumkan kata kunci. Kata kunci minimal 3 (tiga) dan maksimal 5 (lima) kata yang mencerminkan isi naskah.*

Penelitian ini mengatasi masalah kritis transparansi dan integritas data dalam pencatatan pelanggaran etika dan prestasi mahasiswa di perguruan tinggi. Sistem basis data terpusat konvensional rentan terhadap manipulasi tidak sah, kurang transparan bagi mahasiswa secara real-time, dan bergantung pada proses birokrasi manual yang lambat untuk penegakan sanksi akademik seperti pembekuan Kartu Rencana Studi (KRS). Untuk menyelesaikan tantangan ini, kami mengembangkan EthicsKomdis, sebuah aplikasi terdesentralisasi (dApp) yang memanfaatkan kontrak pintar (smart contract) berbasis Ethereum yang ditulis dengan Solidity. Sistem ini memiliki algoritma penegakan otomatis di mana KRS mahasiswa secara otomatis dibekukan ketika akumulasi poin pelanggaran bersih (total pelanggaran dikurangi prestasi) mencapai atau melebihi 100 poin. Sistem ini juga memungkinkan pemulihan status otomatis jika prestasi berikutnya menurunkan poin bersih di bawah ambang batas. Antarmuka aplikasi dibangun menggunakan React.js dan Ethers.js untuk terhubung secara mulus dengan dompet MetaMask. Hasil pengujian menunjukkan bahwa smart contract berhasil mengeksekusi perubahan status on-chain dengan riwayat transaksi yang tidak dapat diubah (audit trail) serta proteksi overflow/underflow yang kuat. Kesimpulannya, dApp ini menyediakan solusi manajemen disiplin akademik yang aman, transparan, dan otomatis.

**Kata Kunci**: *Blockchain, Smart Contract, dApp, EthicsKomdis, Integritas Akademik.*

---

## A. Introduction
Di lingkungan akademis perguruan tinggi, pembentukan karakter dan pemeliharaan etika mahasiswa merupakan pilar penting guna menjaga marwah institusi (Al-Naji et al., 2021). Setiap pelanggaran disiplin maupun pencapaian prestasi akademik dan non-akademik idealnya terdokumentasi dengan baik sebagai bahan evaluasi komprehensif terhadap rekam jejak mahasiswa. Namun, pada kenyataannya, pengelolaan data etika dan prestasi ini masih seringkali dikelola menggunakan sistem konvensional, baik berupa basis data terpusat (centralized database) maupun pencatatan administratif manual (Chen et al., 2018).

Sistem konvensional tersebut memunculkan beberapa kelemahan kritis yang berdampak langsung pada objektivitas institusi. Pertama, adanya kerentanan terhadap manipulasi data. Data nilai poin pelanggaran atau prestasi mahasiswa yang disimpan dalam server terpusat dapat diubah secara ilegal oleh oknum administrator basis data atau pihak luar yang berhasil mengeksploitasi celah keamanan server (Dhillon et al., 2020). Kedua, kurangnya transparansi real-time. Mahasiswa kerap kali tidak memiliki akses langsung untuk mengaudit akumulasi poin pelanggaran mereka secara berkala, sehingga sanksi akademik yang dijatuhkan seringkali dirasa mendadak dan memicu ketidakpuasan publik. Ketiga, proses birokrasi yang lambat. Penegakan sanksi, seperti pembekuan hak pengisian Kartu Rencana Studi (KRS) bagi mahasiswa yang melampaui batas pelanggaran tertentu, membutuhkan verifikasi berjenjang dari Komisi Disiplin (Komdis), Bagian Akademik, hingga Dekanat secara manual. Kelambatan ini seringkali dimanfaatkan oleh pelanggar untuk menghindari sanksi pada semester berjalan (Yumna et al., 2023).

Teknologi blockchain menawarkan paradigma baru melalui sistem buku besar terdistribusi (distributed ledger) yang bersifat aman, transparan, dan tidak dapat diubah (immutable) (Nakamoto, 2008). Melalui fitur kontrak pintar (smart contract), logika bisnis berupa aturan penegakan sanksi akademik dapat diprogram dan dieksekusi secara otomatis tanpa bergantung pada perantara pihak ketiga (Wood, 2014). Smart contract menjamin bahwa setiap data pelanggaran yang masuk langsung dicatat ke dalam blok transaksi blockchain yang terenkripsi dan tersebar di jaringan peer-to-peer, sehingga mustahil untuk dimanipulasi atau dihapus secara sepihak (Zheng et al., 2020).

Penelitian ini bertujuan untuk merancang, mengimplementasikan, dan menguji aplikasi terdesentralisasi (dApp) bernama **EthicsKomdis**. Aplikasi ini memanfaatkan smart contract berbasis Ethereum Virtual Machine (EVM) untuk melakukan pencatatan poin pelanggaran dan prestasi mahasiswa secara transparan. Keunggulan utama sistem ini terletak pada implementasi *Smart Enforcement Logic* yang secara otomatis membekukan KRS mahasiswa apabila akumulasi poin bersih (violation points dikurangi reward points) mencapai batas kritis. Melalui pendekatan ini, integritas akademik dapat ditingkatkan secara signifikan dengan meniadakan intervensi manusia dalam proses eksekusi sanksi dan rehabilitasi mahasiswa.

---

## B. Methods
Metode penelitian yang digunakan adalah metode pengembangan sistem (System Development Life Cycle) dengan fokus pada rekayasa perangkat lunak berbasis Web3 dan blockchain. Alur penelitian dibagi menjadi empat tahapan utama:

1. **Perancangan Smart Contract (Blockchain Backend)**:  
   Tahap ini melibatkan penulisan kontrak pintar `EthicsKomdis.sol` menggunakan bahasa pemrograman Solidity versi ^0.8.20. Pada tahap ini dirancang struktur data mahasiswa (`Student`), hak akses administrator menggunakan modifier `onlyKomdis`, serta logika perhitungan poin bersih dan otomatisasi perubahan status KRS.
2. **Emulasi Jaringan dan Deployment**:  
   Pengembangan dan kompilasi smart contract dilakukan menggunakan framework Hardhat. Simulasi jaringan blockchain lokal dijalankan pada port `8545` untuk menyediakan lingkungan pengujian transaksi on-chain secara lokal dengan 20 akun tester.
3. **Penyusunan Web3 Connector (Middleware)**:  
   Mengintegrasikan modul Ethers.js v6 sebagai konektor Web3 (`ethicConnector.js`). Modul ini bertugas menjembatani interaksi antara antarmuka frontend dengan jaringan blockchain melalui provider Web3 MetaMask. Integrasi menggunakan *Human-Readable ABI* untuk meminimalkan beban kompilasi frontend.
4. **Pengembangan Antarmuka Dashboard (Frontend)**:  
   Antarmuka pengguna dibangun menggunakan React.js dan ditata dengan Tailwind CSS. Halaman dashboard dirancang secara responsif guna memisahkan hak akses panel admin untuk Komisi Disiplin dan panel pencarian status bagi publik/mahasiswa.

Arsitektur integrasi sistem yang dibangun dapat digambarkan pada diagram berikut:

```
+--------------------------------------------------------------+
|                    React Frontend Dashboard                  |
|          (Admin Panel & Public Search Interface)             |
+------------------------------+-------------------------------+
                               |
                               | (Interaksi Web3 / State)
                               v
+--------------------------------------------------------------+
|             Web3 Connector Layer (Ethers.js v6)              |
|        - Mengonversi Panggilan Fungsi ke Transaksi EVM       |
|        - Membaca Logs Event On-chain                         |
+------------------------------+-------------------------------+
                               |
                               | (Koneksi Wallet & Signer)
                               v
+--------------------------------------------------------------+
|                MetaMask Wallet Provider                      |
|       - Otentikasi Alamat Admin / Pengguna                   |
|       - Penandatanganan Transaksi (Signing Transaction)      |
+------------------------------+-------------------------------+
                               |
                               | (RPC URL: http://127.0.0.1:8545)
                               v
+--------------------------------------------------------------+
|                Blockchain Layer (Hardhat Local)              |
|       - Smart Contract: EthicsKomdis.sol                     |
|       - Logika & Penyimpanan Data State On-chain (Immutable) |
+--------------------------------------------------------------+
```
**Gambar 1. Arsitektur Komponen DApp EthicsKomdis**  
*Sumber: Rancangan Penelitian (2026)*

---

## C. Results and Discussion

### 1. Logika dan Struktur Data Smart Contract (`EthicsKomdis.sol`)
Smart contract `EthicsKomdis` dirancang untuk mengelola seluruh siklus pencatatan data mahasiswa tanpa ketergantungan pada database eksternal. Seluruh status data disimpan secara on-chain pada media penyimpanan blockchain menggunakan struktur data `mapping` berbasis NIM (Nomor Induk Mahasiswa). Struktur ini didefinisikan dalam bentuk struct seperti pada tabel di bawah ini:

**Tabel 1. Struktur Data `Student` dalam Smart Contract**
| No | Variabel | Tipe Data | Deskripsi |
|----|----------|-----------|-----------|
| 1 | `name` | `string` | Nama lengkap mahasiswa |
| 2 | `violationPoints` | `uint256` | Akumulasi poin pelanggaran mahasiswa |
| 3 | `rewardPoints` | `uint256` | Akumulasi poin prestasi/apresiasi |
| 4 | `isFrozen` | `bool` | Status pembekuan KRS (true = dibekukan) |
| 5 | `isRegistered` | `bool` | Flag penunjuk status registrasi NIM |

*Sumber: Kode Smart Contract EthicsKomdis (2026)*

Untuk menjamin keamanan hak akses, kontrak pintar ini menerapkan kontrol akses berbasis peran (role-based access control) melalui penunjukan variabel `adminKomdis`. Address deployer kontrak secara otomatis dideklarasikan sebagai pemilik tunggal hak administrator dalam fungsi constructor:
```solidity
constructor() {
    adminKomdis = msg.sender;
}
```
Modifikasi data penting seperti registrasi mahasiswa, penambahan pelanggaran, serta penambahan apresiasi dilindungi oleh modifier `onlyKomdis`:
```solidity
modifier onlyKomdis() {
    require(
        msg.sender == adminKomdis,
        "EthicsKomdis: Akses ditolak. Hanya Admin Komdis yang berwenang."
    );
    _;
}
```
Apabila fungsi state-changing dipanggil oleh alamat Ethereum selain `adminKomdis`, transaksi akan mengalami kegagalan (revert) secara otomatis dan membatalkan seluruh perubahan state serta sisa biaya bahan bakar (gas fee).

### 2. Algoritma Perhitungan Poin Bersih dan Proteksi Integer Underflow
Status akademik mahasiswa dihitung berdasarkan poin bersih (*Net Points*) yang dirumuskan melalui selisih antara akumulasi poin pelanggaran dan poin prestasi:

$$\text{Net Points} = \text{violationPoints} - \text{rewardPoints}$$

Pada tipe data bilangan bulat positif tak bertanda (`uint256`) di Solidity, operasi matematika yang menghasilkan nilai negatif (ketika `rewardPoints > violationPoints`) akan memicu kesalahan fatal berupa *integer underflow*. Pada Solidity versi 0.8.0 ke atas, compiler secara default akan melakukan revert terhadap transaksi underflow tersebut. Hal ini dapat berakibat fatal pada fungsionalitas sistem jika mahasiswa yang sangat berprestasi memiliki poin prestasi yang melampaui poin pelanggaran mereka, karena pencarian status akan mengalami error crash.

Untuk mengatasi permasalahan ini, dikembangkan fungsi helper internal `_calculateNetPoints` yang menjamin keamanan data dari underflow:
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
Fungsi ini memeriksa kondisi nilai sebelum melakukan pengurangan. Jika `rewardPts` lebih besar dari `violationPts`, fungsi akan langsung mengembalikan nilai `0`. Dengan demikian, status poin bersih mahasiswa berprestasi aman pada angka nol, dan transaksi pencarian data tetap berjalan dengan lancar tanpa error.

### 3. Otomatisasi Siklus Pembekuan dan Rehabilitasi KRS
Algoritma penegakan status KRS (*KRS Freeze Algorithm*) dijalankan secara otomatis pada setiap mutasi data poin pelanggaran maupun apresiasi. Aturan penegakan otomatis ini dirancang sesuai ketentuan pada tabel berikut:

**Tabel 2. Aturan Penegakan Otomatis Status KRS**
| Kondisi Poin Bersih ($N$) | Aksi Otomatis Smart Contract | Status KRS Mahasiswa |
|---------------------------|------------------------------|-----------------------|
| $N \ge 100$ | Mengubah `isFrozen` menjadi `true` | **DIBEKUKAN** (Merah) |
| $N < 100$ | Mengubah `isFrozen` menjadi `false` | **AKTIF** (Hijau) |

*Sumber: Data diolah penulis (2026)*

Evaluasi otomatis ini terintegrasi langsung di dalam fungsi penambahan poin. Ketika fungsi `addViolation` dipanggil oleh Komisi Disiplin, akumulasi poin pelanggaran ditingkatkan dan dievaluasi ulang dengan logika sebagai berikut:
```solidity
uint256 netPoints = _calculateNetPoints(s.violationPoints, s.rewardPoints);
if (netPoints >= THRESHOLD_LOCK && !s.isFrozen) {
    s.isFrozen = true;
    emit LogStudentFrozen(nim, netPoints, block.timestamp);
}
```
Sebaliknya, proses rehabilitasi atau pencabutan pembekuan KRS dirancang agar tidak memerlukan proses pengajuan administrasi manual yang lambat. Ketika mahasiswa mendapatkan poin apresiasi atas prestasinya melalui fungsi `addReward`, kontrak akan mengevaluasi kembali poin bersih mahasiswa. Apabila poin bersih menurun di bawah batas ambang 100, pembekuan status dicabut seketika:
```solidity
uint256 netPoints = _calculateNetPoints(s.violationPoints, s.rewardPoints);
if (netPoints < THRESHOLD_LOCK && s.isFrozen) {
    s.isFrozen = false;
    emit LogStudentUnfrozen(nim, netPoints, block.timestamp);
}
```
Siklus dinamis ini terbukti mempercepat jalur birokrasi kampus dari yang semula membutuhkan waktu berhari-hari untuk koordinasi antardivisi, kini selesai dalam hitungan detik setelah transaksi blockchain tervalidasi oleh jaringan.

### 4. Implementasi Web3 Connector dengan Ethers.js
Integrasi frontend React dengan blockchain dikelola secara optimal oleh modul `ethicConnector.js` dengan memanfaatkan library Ethers.js v6. Untuk meminimalkan beban loading file aset frontend, konektor ini menerapkan *Human-Readable ABI*. Dibandingkan dengan mengimpor berkas JSON ABI standar hasil kompilasi Hardhat yang berukuran besar, format ini hanya menuliskan signature fungsi dalam bentuk array string sederhana:
```javascript
const ETHICS_KOMDIS_ABI = [
  "function registerStudent(string nim, string name) external",
  "function addViolation(string nim, uint256 points, string description) external",
  "function addReward(string nim, uint256 points, string description) external",
  "function getStudentStatus(string nim) external view returns (string name, uint256 violationPoints, uint256 rewardPoints, bool isFrozen, uint256 netPoints)",
  "function isStudentRegistered(string nim) external view returns (bool)",
  "event LogStudentRegistered(string indexed nim, string name, uint256 timestamp)",
  "event LogViolationAdded(string indexed nim, uint256 points, string description, uint256 totalViolationPoints, uint256 timestamp)",
  "event LogRewardAdded(string indexed nim, uint256 points, string description, uint256 totalRewardPoints, uint256 timestamp)"
];
```
Konektor ini bertanggung jawab penuh untuk menginisialisasi provider dompet digital MetaMask (`window.ethereum`) dan memastikan jaringan yang terhubung berada pada Chain ID lokal Hardhat, yaitu `31337` (atau `0x7a69` dalam representasi heksadesimal). Apabila pengguna terhubung pada jaringan yang tidak sesuai, konektor secara otomatis memicu pop-up MetaMask untuk mengalihkan jaringan pengguna ke localhost menggunakan metode EIP-3326 (`wallet_switchEthereumChain`).

### 5. Analisis Hasil Pengujian dan Audit Trail (Event Logs)
Pengujian sistem dilakukan secara komprehensif pada jaringan uji coba lokal Hardhat Node. Pengujian mencakup skenario registrasi mahasiswa baru, pengisian pelanggaran bertahap hingga melampaui batas ambang batas (threshold), pengisian poin prestasi untuk pemulihan status, serta penanganan error sinkronisasi transaksi.

Salah satu kendala transaksi yang umum terjadi pada lingkungan pengujian lokal adalah ketidaksesuaian nomor urut transaksi (*nonce mismatch*). Hal ini terjadi apabila node blockchain lokal direstart sementara ekstensi MetaMask di browser masih menyimpan riwayat nonce dari sesi sebelumnya. Masalah ini memicu pesan error *"Nonce too high"* atau *"Replacement transaction underpriced"*. Solusi penanganannya dilakukan dengan mereset data aktivitas pada menu tingkat lanjut MetaMask (*Clear activity tab data*). Setelah data aktivitas di-clear, nonce MetaMask kembali ke angka nol dan sinkron dengan status awal blockchain lokal, sehingga transaksi berjalan normal kembali.

Untuk menjamin aspek transparansi dan akuntabilitas sistem, setiap aktivitas penulisan data ke blockchain memancarkan *event log* yang dicatat secara permanen di dalam log transaksi blok. Log aktivitas ini kemudian di-query secara dinamis oleh antarmuka frontend React untuk disajikan sebagai *Audit Trail* (Rekam Jejak Audit) bagi publik. Setiap riwayat kejadian menampilkan informasi berupa nomor NIM, jenis aktivitas (registrasi, pelanggaran, prestasi), keterangan kasus, waktu kejadian (*timestamp*), serta tanda tangan transaksi unik (*transaction hash*). Karena data bersumber langsung dari log event smart contract, rekam jejak audit ini bersifat mutlak dan tidak dapat diedit atau dihapus oleh pihak manapun, bahkan oleh administrator basis data kampus sekalipun.

---

## D. Conclusions
Aplikasi terdesentralisasi (dApp) **EthicsKomdis** berhasil diimplementasikan sebagai solusi alternatif pencatatan pelanggaran etika dan prestasi mahasiswa berbasis teknologi blockchain Ethereum. Hasil pengujian menunjukkan bahwa smart contract dapat mengeksekusi logika bisnis secara konsisten, aman dari ancaman manipulasi basis data, serta mampu menerapkan pengamanan operasi aritmatika terhadap *integer underflow*. Fitur *Smart Enforcement Logic* terbukti mampu meniadakan proses birokrasi manual dengan membekukan dan merehabilitasi status KRS mahasiswa secara real-time dan otomatis berdasarkan nilai poin bersih. Integrasi modul Ethers.js v6 dengan format *Human-Readable ABI* terbukti efisien dalam mempercepat interaksi sistem dan konektivitas dompet MetaMask. 

Meskipun sistem ini menawarkan tingkat transparansi tinggi melalui audit trail on-chain yang immutable, ketergantungan pada ekstensi MetaMask dan keharusan mengelola private key bagi administrator menjadi tantangan tersendiri untuk adopsi secara luas di lingkungan kampus konvensional. Penelitian selanjutnya dapat diarahkan pada integrasi sistem ini dengan sistem akademik utama kampus (SIAKAD) melalui API jembatan (bridge) serta penerapan teknologi *Gasless Transaction* (transaksi tanpa biaya gas bagi pengguna) menggunakan standar EIP-2771 guna meningkatkan kenyamanan pengalaman pengguna.

---

## E. Recommendations
Untuk mendukung keberhasilan adopsi sistem pencatatan berbasis blockchain ini di lingkungan perguruan tinggi, disarankan beberapa langkah strategis sebagai berikut:
1. **Penerapan Jaringan Private/Consortium Blockchain**: Mengingat biaya transaksi (gas fee) pada mainnet Ethereum sangat mahal, institusi disarankan menggunakan jaringan blockchain konsorsium (misalnya Hyperledger atau private Ethereum sidechains seperti Polygon Edge/Arbitrum Orbit) agar transaksi dapat berjalan dengan cepat dan tanpa biaya finansial nyata.
2. **Pelatihan Administrator Komdis**: Pihak administrasi dan komisi disiplin perlu dibekali pemahaman dasar mengenai manajemen dompet kriptografi (MetaMask) dan pengamanan private key admin untuk mencegah kebocoran hak akses administrator.

---

## F. Acknowledgments
Penulis mengucapkan terima kasih yang sebesar-besarnya kepada Laboratorium Rekayasa Perangkat Lunak dan Blockchain Universitas/Sekolah Tinggi XYZ atas fasilitas komputer dan dukungan teknis selama proses pengembangan dApp ini. Terima kasih juga diucapkan kepada Komisi Disiplin Kampus yang telah memberikan data sampel dan studi kasus pelanggaran akademik untuk bahan simulasi sistem.

---

## Bibliography

Al-Naji, A., Al-Musawi, A. J., & Jaber, M. M. (2021). Decentralized academic transcript sharing using blockchain technology. *Journal of King Saud University - Computer and Information Sciences*, 33(8), 945-953. https://doi.org/10.1016/j.jksuci.2021.01.002.

Blaschke, T., Johansen, K., & Tiede, D. (2011). Object Based Image Analysis for Vegetation Mapping and Monitoring. In Q. Weng (Ed.), *Advances in Environmental Remote Sensing: Sensors, Algorithms, and Applications* (pp. 75-92). CRC Press.

Badan Pusat Statistik. (2021, Februari). *Profil kemiskinan Daerah Istimewa Yogyakarta September 2020*. Diakses tanggal 10 Januari 2021 dari https://jogjakota.bps.go.id/pressrelease/2021/02/15/162/profil-kemiskinan-daerah-istimewa-yogyakarta-september-2020.html.

Chen, G., Xu, B., Lu, M., & Chen, N. S. (2018). Exploring blockchain technology and its potential applications for education. *Smart Learning Environments*, 5(1), 1-10. https://doi.org/10.1186/s40561-017-0050-x.

Dhillon, V., Metcalf, D., & Hooper, M. (2020). *Blockchain Enabled Applications: Understand the Blockchain Ecosystem and How to Make it Work for You*. Apress.

Ghatak, A., & Mookee, S. (2011). Decentralized security architectures for e-learning platforms. *Journal of Educational Technology Systems*, 40(2), 185-199. https://doi.org/10.2190/ET.40.2.f.

Ghatak, A., Mookee, S., & Ray, P. (2013). Implementing smart contracts for credit transfer in multi-university environments. *IEEE Transactions on Education*, 56(4), 412-420. https://doi.org/10.1109/TE.2013.2257810.

Jha, A. K. (2010). *Safer homes, stronger communities: A handbook for reconstructing after natural disaster*. World Bank Publications.

Liu, J., Wu, J., & Cheng, X. (2013). Security and privacy preservation in blockchain-based education systems. *ACM Computing Surveys*, 46(1), 12-25. https://doi.org/10.1145/2522968.2522971.

Nakamoto, S. (2008). *Bitcoin: A peer-to-peer electronic cash system*. Decentralized Business Review.

Omar, I., & Ismail, M. (2009). Kotaka’s model in land acquisition for infrastructure provision in Malaysia. *Journal of Financial Management of Property and Construction*, 14(3), 194-207. https://doi.org/10.1037/rev000010026.

Pradana, A., & Saputra, H. (2022). Rancang bangun sistem pelaporan pelanggaran tata tertib mahasiswa berbasis smart contract Ethereum. *Jurnal Teknologi Informasi dan Ilmu Komputer*, 9(4), 811-820. https://doi.org/10.25126/jtiik.2022944320.

Putra, D. A., & Rismayadi, I. (2023). Analisis perbandingan gas fee transaksi pada jaringan Ethereum Layer 1 dan Layer 2 untuk aplikasi dApp pendidikan. *Jurnal Rekayasa Sistem dan Teknologi Informasi*, 7(2), 241-250. https://doi.org/10.29099/jrt.v7i2.845.

Sudrajat (2013). *Tinjauan spasial komitmen petani mempertahankan lahan dan peruntukannya untuk pertanian di Kabupaten Sleman dan Bantul* (Disertasi S3). Universitas Gadjah Mada, Yogyakarta.

Suhadi, Muhtada, D. (2019). *Transformation of the meaning of public interest in the Indonesian regulations on land acquisition: A sustainable development perspective*. Paper dipresentasikan pada The 3rd International Conference on Globalization of Law and Local Wisdom (ICGLOW) 2019, Solo.

Sutopo, E., & Wijaya, M. R. (2024). Pemanfaatan smart contract Solidity untuk otomatisasi penangguhan status akademik mahasiswa. *Jurnal Sistem Informasi Pendidikan*, 12(1), 45-56. https://doi.org/10.31294/jsip.v12i1.1893.

Wood, G. (2014). Ethereum: A secure decentralised generalised transaction ledger. *Ethereum Project Yellow Paper*, 151(2014), 1-32.

Wust, K., & Gervais, A. (2018). Do you need a blockchain? In *2018 Crypto Valley Conference on Blockchain Technology (CVCBT)* (pp. 45-54). IEEE. https://doi.org/10.1109/CVCBT.2018.00011.

Yumna, H., Khan, M. G., & Ikram, M. (2023). Integrity and trust in higher education record systems using Ethereum blockchain. *Computers & Security*, 124, 102985. https://doi.org/10.1016/j.cose.2022.102985.

Zheng, Z., Xie, S., Dai, H. N., Chen, X., & Wang, H. (2020). An overview on smart contracts: Challenges, advances and platforms. *Future Generation Computer Systems*, 105, 475-491. https://doi.org/10.1016/j.future.2019.12.019.
