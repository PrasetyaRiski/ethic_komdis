# Ethics & Komdis - Blockchain System

Sistem blockchain untuk manajemen pelanggaran etika dan komunikasi disiplin berbasis Ethereum smart contract.

## 📋 Deskripsi

Proyek ini adalah aplikasi blockchain yang menggunakan smart contract Ethereum untuk mengelola dan mencatat pelanggaran etika serta komunikasi disiplin. Sistem ini memastikan transparansi, ketertelusuran, dan keamanan data pelanggaran.

## ✨ Fitur

- 📝 Pencatatan pelanggaran etika secara terdesentralisasi
- 🔐 Keamanan data menggunakan blockchain
- 🔍 Transparansi dan ketertelusuran semua transaksi
- 💼 Interface pengguna yang mudah digunakan
- ⚡ Real-time updates menggunakan smart contract events

## 🏗️ Struktur Proyek

```
ethic_komdis/
├── antarmuka/          # Frontend aplikasi (React + Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── backend/            # Smart contracts dan deployment
│   ├── contracts/
│   │   └── EthicsKomdis.sol
│   ├── scripts/
│   │   └── deploy.cjs
│   └── hardhat.config.js
├── konektor/           # Connector untuk interaksi blockchain
│   └── ethicConnector.js
├── docs/               # Dokumentasi
│   ├── PANDUAN.md
│   ├── JURNAL_ETHICS_KOMDIS.md
│   └── flow.md
└── README.md
```

## 🚀 Teknologi yang Digunakan

### Frontend
- React.js
- Vite
- TailwindCSS
- ethers.js
- lucide-react

### Backend/Blockchain
- Solidity
- Hardhat
- Ethereum
- ethers.js

## 📦 Instalasi

### Prasyarat
- Node.js (v16 atau lebih tinggi)
- npm atau yarn
- MetaMask atau wallet Ethereum lainnya

### Langkah Instalasi

1. Clone repository
```bash
git clone https://github.com/PrasetyaRiski/ethic_komdis.git
cd ethic_komdis
```

2. Install dependencies root
```bash
npm install
```

3. Install dependencies frontend
```bash
cd antarmuka
npm install
cd ..
```

4. Install dependencies backend
```bash
cd backend
npm install
cd ..
```

## 🔧 Konfigurasi

1. Buat file `.env` di folder `backend/` dengan isi:
```env
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_key_here
```

2. Konfigurasi network di `backend/hardhat.config.js` sesuai kebutuhan

## 💻 Cara Menggunakan

### Deploy Smart Contract

```bash
cd backend
npx hardhat compile
npx hardhat run scripts/deploy.cjs --network [network_name]
```

### Menjalankan Frontend

```bash
cd antarmuka
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 📚 Dokumentasi Lengkap

Untuk dokumentasi lengkap, silakan baca:
- [Panduan Lengkap](docs/PANDUAN.md)
- [Jurnal Proyek](docs/JURNAL_ETHICS_KOMDIS.md)
- [Flow Diagram](docs/flow.md)

## 🤝 Kontribusi

Kontribusi, issues, dan feature requests sangat diterima!

## 📝 Lisensi

Proyek ini adalah proyek akademis untuk keperluan pembelajaran blockchain dan smart contract.

## 👥 Tim Pengembang

- PrasetyaRiski

## 📧 Kontak

Untuk pertanyaan atau saran, silakan buka issue di repository ini.

---

⭐ Jangan lupa beri star jika proyek ini bermanfaat!