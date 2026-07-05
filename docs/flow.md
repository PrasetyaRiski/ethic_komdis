# Sistem Pencatatan Poin Pelanggaran dan Prestasi Etika Mahasiswa
## Business Flow & Technical Documentation

---

## 1. Overview

DApp ini adalah sistem berbasis blockchain (Ethereum-compatible) yang digunakan oleh **Komisi Disiplin (Komdis)** kampus untuk mencatat poin pelanggaran dan poin prestasi mahasiswa secara **transparan, immutable, dan terdesentralisasi**. Setiap transaksi tercatat on-chain, sehingga tidak dapat dimanipulasi oleh pihak mana pun.

---

## 2. Actor & Authorization Model

### 2.1 Aktor 1: Admin Komdis (`adminKomdis`)
- **Identitas**: Ethereum address yang digunakan saat deploy kontrak menjadi `adminKomdis` secara otomatis.
- **Hak Akses Eksklusif (Protected by `onlyKomdis` modifier)**:
  - `registerStudent(nim, name)` — Mendaftarkan mahasiswa baru ke dalam sistem.
  - `addViolation(nim, points, description)` — Menambahkan poin pelanggaran.
  - `addReward(nim, points, description)` — Menambahkan poin apresiasi/prestasi.
- **Enforcement**: Semua fungsi mutasi state dilindungi oleh `modifier onlyKomdis`. Jika address pemanggil bukan `adminKomdis`, transaksi akan `revert` secara otomatis.

### 2.2 Aktor 2: Mahasiswa (Student / Public)
- **Identitas**: Semua Ethereum address (termasuk mahasiswa itu sendiri).
- **Hak Akses (Read-Only)**:
  - `getStudentStatus(nim)` — Melihat status poin dan status KRS secara real-time.
- **Catatan**: Tidak ada fungsi bagi mahasiswa untuk memodifikasi data mereka sendiri. Transparansi dijamin tanpa risiko manipulasi.

---

## 3. Business Flow Diagram

```
[Admin Komdis]                         [Smart Contract: EthicsKomdis.sol]
     |                                              |
     |------ registerStudent(nim, name) ----------->|
     |                                              |--> Simpan data Student ke mapping
     |                                              |--> Emit: LogStudentRegistered
     |                                              |
     |------ addViolation(nim, pts, desc) -------->|
     |                                              |--> violationPoints += pts
     |                                              |--> Emit: LogViolationAdded
     |                                              |--> [AUTO-CHECK] netPoints >= THRESHOLD?
     |                                              |       YES --> isFrozen = true
     |                                              |       YES --> Emit: LogStudentFrozen
     |                                              |
     |------ addReward(nim, pts, desc) ----------->|
     |                                              |--> rewardPoints += pts
     |                                              |--> Emit: LogRewardAdded
     |                                              |--> [AUTO-CHECK] netPoints < THRESHOLD?
     |                                              |       YES --> isFrozen = false (unfreeze)
     |                                              |       YES --> Emit: LogStudentUnfrozen
     |
[Mahasiswa / Public]
     |
     |------ getStudentStatus(nim) -------------->|
     |                                              |--> Returns: name, violationPoints,
     |                                              |             rewardPoints, isFrozen, netPoints
```

---

## 4. KRS Freeze Algorithm (Smart Enforcement Logic)

### 4.1 Formula
```
Net Points (Poin Bersih) = violationPoints - rewardPoints
```

### 4.2 Threshold
```
THRESHOLD_LOCK = 100
```

### 4.3 Enforcement Rules

| Kondisi                          | Aksi Otomatis Smart Contract         |
|----------------------------------|--------------------------------------|
| `netPoints >= 100`               | `isFrozen = true` → KRS Dibekukan    |
| `netPoints < 100`                | `isFrozen = false` → Status Aktif    |

### 4.4 Overflow Protection
Karena `violationPoints` dan `rewardPoints` adalah tipe `uint256` (unsigned), pengurangan `violationPoints - rewardPoints` dapat menyebabkan **integer underflow** jika poin reward melebihi poin pelanggaran.

**Solusi**: Fungsi `getStudentStatus()` menggunakan conditional check:
```solidity
uint256 netPoints;
if (s.violationPoints >= s.rewardPoints) {
    netPoints = s.violationPoints - s.rewardPoints;
} else {
    netPoints = 0; // Underflow-safe: treated as zero net points
}
```
Ini memastikan bahwa mahasiswa berprestasi (reward > violation) tidak pernah memiliki `netPoints` negatif — melainkan aman di `0`, dan status mereka tetap `AKTIF`.

### 4.5 Freeze Re-Evaluation
Setiap kali `addViolation()` atau `addReward()` dipanggil, kontrak secara otomatis mengevaluasi ulang `isFrozen`:
- Jika admin memberi banyak poin apresiasi sehingga `netPoints` turun < 100, **pembekuan akan otomatis dicabut**.
- Ini memungkinkan siklus "rehabilitasi" mahasiswa tanpa intervensi manual.

---

## 5. Event Log & Audit Trail

| Event                  | Trigger Function  | Data yang Dicatat                             |
|------------------------|-------------------|--------------------------------------------|
| `LogStudentRegistered` | `registerStudent` | `nim`, `name`, `timestamp`                |
| `LogViolationAdded`    | `addViolation`    | `nim`, `points`, `description`, `timestamp` |
| `LogRewardAdded`       | `addReward`       | `nim`, `points`, `description`, `timestamp` |
| `LogStudentFrozen`     | `addViolation`    | `nim`, `netPoints`, `timestamp`            |
| `LogStudentUnfrozen`   | `addReward`       | `nim`, `netPoints`, `timestamp`            |

Semua event ini dapat diquery oleh frontend untuk membangun **Audit Ledger** yang transparan dan dapat diverifikasi oleh siapapun menggunakan block explorer.

---

## 6. Technology Stack

| Layer        | Technology                        | Role                                      |
|--------------|-----------------------------------|-------------------------------------------|
| **Backend**  | Solidity `^0.8.20`, Hardhat (JS)  | Smart Contract & Deployment               |
| **Konektor** | Ethers.js v6, MetaMask            | Web3 Provider, Signer, Contract Instance  |
| **Frontend** | React.js + Vite, Tailwind CSS     | Dashboard UI, User Interaction            |
| **Network**  | Hardhat Local / Ethereum Testnet  | Blockchain execution environment          |

---

## 7. Deployment Flow

```
1. npx hardhat node                             # Jalankan local blockchain (terminal 1)
2. npx hardhat run scripts/deploy.js \          # Deploy EthicsKomdis.sol (terminal 2)
   --network localhost
3. Salin Contract Address ke                    # Paste ke antarmuka/src/App.jsx
   konektor/ethicConnector.js                   # (konstanta CONTRACT_ADDRESS)
4. cd antarmuka && npm install                  # Install frontend dependencies
5. npm run dev                                  # Jalankan frontend dev server
6. Buka MetaMask → Network: Localhost 8545      # Gunakan RPC URL: http://127.0.0.1:8545
7. Import Account #0 dari Hardhat node          # Account #0 = adminKomdis (deployer)
```

---

## 8. Security Considerations

- **Access Control**: Modifier `onlyKomdis` mencegah address tidak sah memanggil fungsi mutasi.
- **Input Validation**: Semua fungsi memeriksa bahwa mahasiswa sudah terdaftar sebelum modifikasi.
- **Overflow Safety**: Solidity 0.8.x menggunakan checked arithmetic secara default. Underflow pada `uint256` ditangani secara eksplisit di `getStudentStatus()`.
- **Re-registration Guard**: `registerStudent()` akan `revert` jika NIM sudah terdaftar.
- **Reentrancy**: Tidak ada transfer ETH atau external call, sehingga reentrancy bukan vektor serangan dalam kontrak ini.

---

*Dokumen ini dibuat secara otomatis sebagai bagian dari repositori DApp — Sistem Pencatatan Poin Pelanggaran dan Prestasi Etika Mahasiswa.*
