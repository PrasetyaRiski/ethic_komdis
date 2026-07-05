const path = require("path");
const pptxgen = require("pptxgenjs");

console.log("Memulai pembuatan slide presentasi EthicsKomdis...");

const pptx = new pptxgen();

// Mengatur layout widescreen 16:9
pptx.layout = "LAYOUT_16x9";

// Definisi palet warna Academic-Corporate (Slate Theme)
// Semua nilai warna harus dalam format HEX tanpa karakter '#'
const COLORS = {
  bg: "0F172A",       // Slate 900 (Latar belakang gelap premium)
  card: "1E293B",     // Slate 800 (Latar belakang kartu/box)
  accent: "6366F1",   // Indigo 500 (Aksen utama / Biru-Ungu)
  light: "F8FAFC",    // Slate 50 (Teks utama terang)
  muted: "94A3B8",    // Slate 400 (Teks sekunder / muted)
  crimson: "EF4444",  // Red 500 (Pelanggaran / Peringatan)
  emerald: "10B981"   // Emerald 500 (Prestasi / Sukses)
};

// Helper untuk membuat slide standar dengan header & footer
function createStandardSlide(title) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };

  // Garis aksen di bagian paling atas
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.15,
    fill: { color: COLORS.accent }
  });

  // Judul Slide
  slide.addText(title, {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.8,
    fontSize: 26,
    bold: true,
    color: COLORS.light,
    fontFace: "Arial",
    align: "left"
  });

  // Footer Kiri
  slide.addText("DApp EthicsKomdis | Komisi Disiplin Kampus", {
    x: 0.8,
    y: 7.0,
    w: 6.0,
    h: 0.3,
    fontSize: 10,
    color: COLORS.muted,
    fontFace: "Arial"
  });

  // Footer Kanan (Nomor Halaman otomatis / Statis)
  slide.addText("Teknologi Blockchain Ethereum", {
    x: 9.5,
    y: 7.0,
    w: 3.0,
    h: 0.3,
    fontSize: 10,
    color: COLORS.muted,
    fontFace: "Arial",
    align: "right"
  });

  return slide;
}

// Helper untuk menggambar kartu/box informasi bertema
function drawCard(slide, x, y, w, h, title, titleColor, bullets, bulletColor) {
  // Box Background
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x,
    y: y,
    w: w,
    h: h,
    fill: { color: COLORS.card },
    line: { color: COLORS.accent, width: 1 }
  });

  // Box Title
  slide.addText(title, {
    x: x + 0.3,
    y: y + 0.3,
    w: w - 0.6,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: titleColor,
    fontFace: "Arial"
  });

  // Box Content (Bullets)
  const bulletText = bullets.map(b => "•  " + b).join("\n\n");
  slide.addText(bulletText, {
    x: x + 0.3,
    y: y + 1.0,
    w: w - 0.6,
    h: h - 1.3,
    fontSize: 13,
    color: bulletColor || COLORS.light,
    fontFace: "Arial",
    lineSpacing: 18
  });
}

// =============================================================================
// SLIDE 1: COVER SLIDE
// =============================================================================
const slide1 = pptx.addSlide();
slide1.background = { color: COLORS.bg };

// Aksen dekoratif sisi kiri (kotak vertikal)
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 0.4,
  h: 7.5,
  fill: { color: COLORS.accent }
});

// Judul Utama
slide1.addText("SISTEM PENCATATAN POIN PELANGGARAN\nDAN PRESTASI ETIKA MAHASISWA", {
  x: 1.0,
  y: 1.8,
  w: 11.3,
  h: 1.8,
  fontSize: 34,
  bold: true,
  color: COLORS.light,
  fontFace: "Arial",
  align: "left"
});

// Subjudul
slide1.addText("Aplikasi Terdesentralisasi (DApp) untuk Transparansi & Akuntabilitas Kampus", {
  x: 1.0,
  y: 3.8,
  w: 11.3,
  h: 0.6,
  fontSize: 18,
  color: COLORS.accent,
  fontFace: "Arial",
  align: "left"
});

// Pembatas dekoratif horizontal
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 1.0,
  y: 4.6,
  w: 4.0,
  h: 0.05,
  fill: { color: COLORS.muted }
});

// Tech Stack Badge info
slide1.addText("Platform: Solidity | Hardhat | Ethers.js | React | Tailwind CSS", {
  x: 1.0,
  y: 5.0,
  w: 11.3,
  h: 0.5,
  fontSize: 14,
  color: COLORS.muted,
  fontFace: "Arial"
});

slide1.addText("Dikelola Oleh: Komisi Disiplin (Komdis) Kampus", {
  x: 1.0,
  y: 5.6,
  w: 11.3,
  h: 0.5,
  fontSize: 13,
  bold: true,
  color: COLORS.light,
  fontFace: "Arial"
});


// =============================================================================
// SLIDE 2: LATAR BELAKANG & MASALAH
// =============================================================================
const slide2 = createStandardSlide("Latar Belakang & Permasalahan");

// Kartu Masalah (Kiri)
drawCard(
  slide2,
  0.8,
  1.5,
  5.6,
  5.0,
  "Masalah Sistem Terpusat / Manual",
  COLORS.crimson,
  [
    "Risiko Manipulasi Data: Basis data terpusat rawan diubah secara ilegal oleh oknum dalam internal kampus.",
    "Kurangnya Transparansi: Mahasiswa tidak dapat mengakses atau memvalidasi riwayat poin pelanggaran mereka secara transparan.",
    "Sanksi Lambat & Subjektif: Pembekuan hak akademis (KRS) memerlukan proses rekapitulasi manual yang rawan penundaan."
  ]
);

// Kartu Dampak (Kanan)
drawCard(
  slide2,
  6.9,
  1.5,
  5.6,
  5.0,
  "Dampak Negatif Bagi Kampus",
  COLORS.muted,
  [
    "Menurunnya tingkat kepercayaan mahasiswa terhadap keadilan keputusan Komisi Disiplin.",
    "Ketidakadilan bagi mahasiswa berprestasi jika poin apresiasi tidak terdata secara konsisten.",
    "Beban kerja administratif yang berlebih untuk verifikasi status mahasiswa secara berkala."
  ]
);


// =============================================================================
// SLIDE 3: SOLUSI BLOCKCHAIN
// =============================================================================
const slide3 = createStandardSlide("Solusi: Decentralized Application (DApp)");

// Mengapa Blockchain (Kiri)
drawCard(
  slide3,
  0.8,
  1.5,
  5.6,
  5.0,
  "Keunggulan Teknologi Blockchain",
  COLORS.accent,
  [
    "Immutabilitas Mutlak: Setiap data pelanggaran dan prestasi yang masuk ke blockchain tidak dapat diubah atau dihapus oleh siapapun.",
    "Transparansi Publik: Seluruh mahasiswa dapat secara langsung mengaudit data status mereka langsung dari smart contract.",
    "Konsensus Terdistribusi: Sistem berjalan mandiri tanpa bergantung pada kerentanan server database tunggal."
  ]
);

// Hasil Penerapan (Kanan)
drawCard(
  slide3,
  6.9,
  1.5,
  5.6,
  5.0,
  "Keuntungan Sistem Terdesentralisasi",
  COLORS.emerald,
  [
    "Meningkatkan akuntabilitas kerja Komdis di mata seluruh civitas akademika.",
    "Otomatisasi Penegakan Hukum: Sanksi pembekuan KRS dieksekusi langsung oleh kode pintar (Smart Contract) secara adil.",
    "Audit Ledger Permanen: Riwayat kejadian terarsip secara on-chain sebagai rekam jejak etis mahasiswa."
  ]
);


// =============================================================================
// SLIDE 4: ARSITEKTUR & TEKNOLOGI STACK
// =============================================================================
const slide4 = createStandardSlide("Arsitektur Sistem & Pilihan Teknologi");

// Kita gambar 4 box horizontal untuk menggambarkan Monorepo 4-Folder
const layers = [
  {
    title: "1. Backend Layer",
    tech: "Solidity & Hardhat",
    desc: "Berisi Smart Contract EthicsKomdis.sol. Menyimpan state data mahasiswa, mengelola modifier hak akses Komdis, dan memancarkan log transaksi."
  },
  {
    title: "2. Connector Layer",
    tech: "Ethers.js",
    desc: "Menghubungkan frontend browser dengan Node Blockchain. Membaca data kontrak pintas dan mengirimkan transaksi bertanda tangan."
  },
  {
    title: "3. Frontend Layer",
    tech: "React.js & Tailwind",
    desc: "Dashboard web interaktif bertema Academic-Corporate yang memisahkan panel administrasi Komdis dan fitur pencarian publik."
  },
  {
    title: "4. Wallet Layer",
    tech: "MetaMask Client",
    desc: "Penyedia tanda tangan digital kriptografis. Digunakan oleh Admin Komdis untuk memvalidasi transaksi perubahan data."
  }
];

const boxW = 2.7;
const boxH = 4.8;
const gap = 0.3;
const startX = 0.8;
const startY = 1.6;

layers.forEach((layer, idx) => {
  const currentX = startX + idx * (boxW + gap);

  // Background Box
  slide4.addShape(pptx.shapes.RECTANGLE, {
    x: currentX,
    y: startY,
    w: boxW,
    h: boxH,
    fill: { color: COLORS.card },
    line: { color: COLORS.accent, width: 1 }
  });

  // Layer Title
  slide4.addText(layer.title, {
    x: currentX + 0.15,
    y: startY + 0.3,
    w: boxW - 0.3,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: COLORS.accent,
    fontFace: "Arial",
    align: "center"
  });

  // Subtitle / Tech
  slide4.addText(layer.tech, {
    x: currentX + 0.15,
    y: startY + 0.7,
    w: boxW - 0.3,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: COLORS.light,
    fontFace: "Arial",
    align: "center"
  });

  // Pembatas garis kecil
  slide4.addShape(pptx.shapes.RECTANGLE, {
    x: currentX + 0.4,
    y: startY + 1.2,
    w: boxW - 0.8,
    h: 0.02,
    fill: { color: COLORS.muted }
  });

  // Desc
  slide4.addText(layer.desc, {
    x: currentX + 0.2,
    y: startY + 1.4,
    w: boxW - 0.4,
    h: boxH - 1.6,
    fontSize: 12,
    color: COLORS.muted,
    fontFace: "Arial",
    align: "left",
    lineSpacing: 18
  });
});


// =============================================================================
// SLIDE 5: DETAIL SMART CONTRACT
// =============================================================================
const slide5 = createStandardSlide("Struktur Smart Contract: EthicsKomdis");

// Komponen Logika (Kiri)
drawCard(
  slide5,
  0.8,
  1.5,
  5.6,
  5.0,
  "Logika & Keamanan Kontrak Pintar",
  COLORS.accent,
  [
    "Struktur Data Student: Menyimpan nama, violationPoints, rewardPoints, isFrozen, dan isRegistered secara aman.",
    "Modifier onlyKomdis: Penjaga hak akses agar fungsi-fungsi mutasi state (tambah poin/mahasiswa) hanya dapat dieksekusi oleh dompet Admin.",
    "Re-registration Guard: Verifikasi otomatis untuk mencegah duplikasi pendaftaran NIM mahasiswa yang sama."
  ]
);

// Event Ledger (Rangan)
drawCard(
  slide5,
  6.9,
  1.5,
  5.6,
  5.0,
  "Audit Trail melalui Event Logs",
  COLORS.emerald,
  [
    "LogStudentRegistered: Mencatat NIM, Nama, dan Waktu registrasi mahasiswa baru.",
    "LogViolationAdded & LogRewardAdded: Mencatat histori penambahan poin lengkap beserta deskripsi pelanggaran/prestasi.",
    "LogStudentFrozen & LogStudentUnfrozen: Mencatat kapan terjadinya pembekuan atau pemulihan KRS mahasiswa secara tepat."
  ]
);


// =============================================================================
// SLIDE 6: ALGORITMA ENFORCEMENT & REHABILITASI
// =============================================================================
const slide6 = createStandardSlide("Algoritma Pembekuan & Rehabilitasi KRS");

// Formula Box (Atas)
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8,
  y: 1.4,
  w: 11.7,
  h: 1.3,
  fill: { color: COLORS.card },
  line: { color: COLORS.accent, width: 1 }
});

slide6.addText("Formula Poin Bersih (Net Points)", {
  x: 1.1,
  y: 1.5,
  w: 11.1,
  h: 0.3,
  fontSize: 14,
  bold: true,
  color: COLORS.accent,
  fontFace: "Arial"
});

slide6.addText("Net Points = violationPoints - rewardPoints  (Minimum 0)", {
  x: 1.1,
  y: 1.8,
  w: 11.1,
  h: 0.4,
  fontSize: 20,
  bold: true,
  color: COLORS.light,
  fontFace: "Arial"
});

slide6.addText("*Proteksi Underflow: Jika rewardPoints > violationPoints, Net Points otomatis di-set ke 0 untuk mencegah crash integer underflow.", {
  x: 1.1,
  y: 2.3,
  w: 11.1,
  h: 0.3,
  fontSize: 11,
  color: COLORS.muted,
  fontFace: "Arial"
});

// Aturan Pembekuan (Bawah Kiri)
drawCard(
  slide6,
  0.8,
  2.9,
  5.6,
  3.6,
  "Aturan Pembekuan KRS (Freeze)",
  COLORS.crimson,
  [
    "Pemberlakuan Otomatis: Jika Net Points mencapai atau melebihi THRESHOLD_LOCK (100 Poin).",
    "Status isFrozen: Di-set menjadi 'true' secara on-chain.",
    "Akses Terkunci: Mahasiswa dibekukan dari hak pengisian KRS dan beasiswa akademis."
  ]
);

// Aturan Rehabilitasi (Bawah Kanan)
drawCard(
  slide6,
  6.9,
  2.9,
  5.6,
  3.6,
  "Aturan Rehabilitasi (Unfreeze)",
  COLORS.emerald,
  [
    "Pencabutan Otomatis: Jika mahasiswa mendapatkan poin prestasi baru sehingga Net Points turun < 100.",
    "Status isFrozen: Di-set kembali menjadi 'false'.",
    "Pemulihan Instan: Hak akademis dipulihkan seketika tanpa perlu pengajuan manual ke rektorat."
  ]
);


// =============================================================================
// SLIDE 7: ALUR KERJA OPERASIONAL
// =============================================================================
const slide7 = createStandardSlide("Alur Kerja Operasional Aplikasi");

const steps = [
  {
    num: "Langkah 1",
    title: "Koneksi Wallet",
    desc: "Admin Komdis menghubungkan MetaMask ke DApp menggunakan jaringan Hardhat Localhost."
  },
  {
    num: "Langkah 2",
    title: "Registrasi NIM",
    desc: "Admin mendaftarkan identitas mahasiswa baru (NIM & Nama) secara on-chain."
  },
  {
    num: "Langkah 3",
    title: "Pemberian Kasus",
    desc: "Admin memasukkan poin pelanggaran atau prestasi beserta deskripsi detail kasus."
  },
  {
    num: "Langkah 4",
    title: "Evaluasi & Audit",
    desc: "Kontrak mengevaluasi status KRS dan menulis log ke audit ledger secara instan."
  }
];

steps.forEach((step, idx) => {
  const currentX = startX + idx * (boxW + gap);

  // Background Box
  slide7.addShape(pptx.shapes.RECTANGLE, {
    x: currentX,
    y: startY + 0.6,
    w: boxW,
    h: boxH - 1.2,
    fill: { color: COLORS.card },
    line: { color: COLORS.accent, width: 1 }
  });

  // Step Number
  slide7.addText(step.num, {
    x: currentX + 0.15,
    y: startY + 0.9,
    w: boxW - 0.3,
    h: 0.3,
    fontSize: 14,
    bold: true,
    color: COLORS.accent,
    fontFace: "Arial",
    align: "center"
  });

  // Step Title
  slide7.addText(step.title, {
    x: currentX + 0.15,
    y: startY + 1.3,
    w: boxW - 0.3,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: COLORS.light,
    fontFace: "Arial",
    align: "center"
  });

  // Line
  slide7.addShape(pptx.shapes.RECTANGLE, {
    x: currentX + 0.4,
    y: startY + 1.8,
    w: boxW - 0.8,
    h: 0.02,
    fill: { color: COLORS.muted }
  });

  // Description
  slide7.addText(step.desc, {
    x: currentX + 0.2,
    y: startY + 2.1,
    w: boxW - 0.4,
    h: boxH - 3.5,
    fontSize: 12,
    color: COLORS.muted,
    fontFace: "Arial",
    align: "left",
    lineSpacing: 18
  });
});


// =============================================================================
// SLIDE 8: AUDIT LEDGER & TRANSPARANSI PUBLIK
// =============================================================================
const slide8 = createStandardSlide("Audit Ledger & Transparansi Publik");

// Audit Ledger (Kiri)
drawCard(
  slide8,
  0.8,
  1.5,
  5.6,
  5.0,
  "Manfaat Audit Trail On-Chain",
  COLORS.accent,
  [
    "Bukti Digital Autentik: Setiap pencatatan menyertakan hash transaksi blockchain unik yang berfungsi sebagai bukti hukum digital.",
    "Bebas Manipulasi: Riwayat kasus tidak dapat disunting kembali, mencegah praktik suap atau penghapusan data secara ilegal.",
    "Validasi Mandiri: Mahasiswa dapat melacak kebenaran status beku KRS mereka secara independen."
  ]
);

// Dashboard (Rangan)
drawCard(
  slide8,
  6.9,
  1.5,
  5.6,
  5.0,
  "Integrasi dengan Dashboard UI",
  COLORS.emerald,
  [
    "Pembacaan Langsung (Direct Read): Frontend membaca event logs langsung dari node blockchain tanpa perantara web server.",
    "Tampilan Log Historis: Menyajikan daftar aktivitas terbaru secara berurutan di bagian bawah antarmuka dashboard.",
    "Koneksi Tanpa Hambatan: Menampilkan hash transaksi yang dapat ditelusuri langsung menggunakan block explorer."
  ]
);


// =============================================================================
// SLIDE 9: KESIMPULAN
// =============================================================================
const slide9 = createStandardSlide("Kesimpulan & Nilai Manfaat");

const benefits = [
  {
    title: "Keamanan & Integritas",
    desc: "Teknologi blockchain menjamin bahwa catatan etika mahasiswa aman dari manipulasi internal maupun eksternal."
  },
  {
    title: "Keadilan Otomatis",
    desc: "Smart enforcement menghilangkan unsur subjektivitas dalam pemberian sanksi akademis (KRS freeze)."
  },
  {
    title: "Kredibilitas Akademik",
    desc: "Meningkatkan citra dan tata kelola universitas yang transparan, modern, dan akuntabel di era Web3."
  }
];

const colW = 3.6;
const colH = 4.8;
const colGap = 0.4;
const startColX = 0.8;
const startColY = 1.6;

benefits.forEach((benefit, idx) => {
  const currentX = startColX + idx * (colW + colGap);

  // Background Box
  slide9.addShape(pptx.shapes.RECTANGLE, {
    x: currentX,
    y: startColY,
    w: colW,
    h: colH,
    fill: { color: COLORS.card },
    line: { color: COLORS.accent, width: 1 }
  });

  // Icon Placeholder or Graphic element
  slide9.addShape(pptx.shapes.OVAL, {
    x: currentX + (colW / 2) - 0.4,
    y: startColY + 0.4,
    w: 0.8,
    h: 0.8,
    fill: { color: COLORS.accent }
  });

  // Title
  slide9.addText(benefit.title, {
    x: currentX + 0.2,
    y: startColY + 1.4,
    w: colW - 0.4,
    h: 0.6,
    fontSize: 18,
    bold: true,
    color: COLORS.light,
    fontFace: "Arial",
    align: "center"
  });

  // Divider
  slide9.addShape(pptx.shapes.RECTANGLE, {
    x: currentX + 0.8,
    y: startColY + 2.2,
    w: colW - 1.6,
    h: 0.02,
    fill: { color: COLORS.muted }
  });

  // Description
  slide9.addText(benefit.desc, {
    x: currentX + 0.3,
    y: startColY + 2.5,
    w: colW - 0.6,
    h: colH - 2.8,
    fontSize: 13,
    color: COLORS.muted,
    fontFace: "Arial",
    align: "center",
    lineSpacing: 20
  });
});

// Menyimpan file presentasi ke folder docs/
const outputPath = path.join(__dirname, "..", "..", "docs", "EthicsKomdis_Presentasi.pptx");

pptx.writeFile({ fileName: outputPath })
  .then((fileName) => {
    console.log(`\nSukses! File presentasi berhasil disimpan di: ${fileName}`);
  })
  .catch((err) => {
    console.error("Terjadi error saat menulis file presentasi:", err);
  });
