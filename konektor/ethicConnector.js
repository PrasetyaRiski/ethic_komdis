/**
 * @file ethicConnector.js
 * @description Modul konektor Web3 untuk menghubungkan MetaMask dengan
 *              Smart Contract EthicsKomdis. Menggunakan Ethers.js.
 *
 * Cara penggunaan dari komponen React:
 *   import { connectWallet, getContractInstance } from '../../konektor/ethicConnector';
 *
 *   const { provider, signer, account } = await connectWallet();
 *   const contract = getContractInstance(CONTRACT_ADDRESS, signer);
 *   const status = await contract.getStudentStatus("12345");
 */

import { ethers } from "ethers";

// ============================================================================
// HUMAN-READABLE ABI (Concise Interface Definition)
// ============================================================================
// Hanya fungsi-fungsi yang digunakan oleh frontend yang perlu didefinisikan.
// Ethers.js mendukung format Human-Readable ABI sebagai array of strings.

const ETHICS_KOMDIS_ABI = [
  // --- State-changing functions (onlyKomdis) ---
  "function registerStudent(string nim, string name) external",
  "function addViolation(string nim, uint256 points, string description) external",
  "function addReward(string nim, uint256 points, string description) external",

  // --- View functions (public) ---
  "function getStudentStatus(string nim) external view returns (string name, uint256 violationPoints, uint256 rewardPoints, bool isFrozen, uint256 netPoints)",
  "function isStudentRegistered(string nim) external view returns (bool)",
  "function adminKomdis() external view returns (address)",
  "function THRESHOLD_LOCK() external view returns (uint256)",

  // --- Events ---
  "event LogStudentRegistered(string indexed nim, string name, uint256 timestamp)",
  "event LogViolationAdded(string indexed nim, uint256 points, string description, uint256 totalViolationPoints, uint256 timestamp)",
  "event LogRewardAdded(string indexed nim, uint256 points, string description, uint256 totalRewardPoints, uint256 timestamp)",
  "event LogStudentFrozen(string indexed nim, uint256 netPoints, uint256 timestamp)",
  "event LogStudentUnfrozen(string indexed nim, uint256 netPoints, uint256 timestamp)",
];

// ============================================================================
// WALLET CONNECTION
// ============================================================================

/**
 * @notice Menghubungkan MetaMask dan mendapatkan provider, signer, serta address.
 * @dev Fungsi ini akan meminta izin akses akun dari MetaMask (window.ethereum).
 *      Throws jika MetaMask tidak terinstal atau pengguna menolak permintaan.
 * @returns {Promise<{provider: ethers.BrowserProvider, signer: ethers.Signer, account: string}>}
 *          Object berisi provider, signer, dan connected account address.
 * @throws {Error} Jika MetaMask tidak ditemukan atau akses ditolak.
 */
export async function connectWallet() {
  // Periksa ketersediaan MetaMask
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "MetaMask tidak terdeteksi. Silakan install ekstensi MetaMask terlebih dahulu."
    );
  }

  try {
    // Meminta akses ke akun MetaMask (memunculkan popup MetaMask)
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Pastikan MetaMask terhubung ke jaringan lokal Hardhat dengan chainId 1337
    await ensureCorrectNetwork();

    // Membuat BrowserProvider dari window.ethereum (Ethers.js v6)
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Mendapatkan signer (akun yang aktif di MetaMask)
    const signer = await provider.getSigner();

    // Mendapatkan address yang terhubung
    const account =
      typeof signer.getAddress === "function"
        ? await signer.getAddress()
        : signer.address;

    console.log(`[EthicConnector] Wallet terhubung: ${account}`);

    return { provider, signer, account };
  } catch (error) {
    if (error.code === 4001) {
      throw new Error("Koneksi wallet ditolak oleh pengguna.");
    }
    throw new Error(`Gagal menghubungkan wallet: ${error.message}`);
  }
}

/**
 * @notice Memastikan MetaMask berada pada jaringan lokal Hardhat (chainId 1337).
 *         Jika tidak, mencoba beralih ke jaringan tersebut, atau menambahkannya
 *         ke MetaMask bila belum terdaftar.
 * @dev Hardhat node dijalankan dengan `chainId: 1337` (lihat hardhat.config.js).
 *      Nilai hex untuk 1337 adalah 0x539.
 */
export async function ensureCorrectNetwork() {
  // Hardhat default chainId is 31337 (hex 0x7a69). Using this value avoids
  // conflicts with MetaMask's built‑in "Hardhat Localhost" network.
  const expectedChainId = 31337;
  const currentChainId = await getCurrentChainId();
  if (currentChainId === expectedChainId) return;

  // Try to switch to the Hardhat network using the standard EIP‑3326 method.
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x7a69" }], // 31337 in hex
    });
  } catch (switchError) {
    // If the network is not yet added to MetaMask, error code 4902 is thrown.
    if (switchError.code === 4902) {
      // Add the Hardhat network. The RPC endpoint is the same as the default
      // Hardhat node (http://127.0.0.1:8545).
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7a69",
            chainName: "Hardhat Localhost",
            rpcUrls: ["http://127.0.0.1:8545"],
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
          },
        ],
      });
    } else {
      // Propagate any other error with a clearer message.
      throw new Error(`Gagal beralih ke jaringan Hardhat (chainId 31337): ${switchError.message}`);
    }
  }
}

// ============================================================================
// CONTRACT INSTANCE FACTORY
// ============================================================================

/**
 * @notice Membuat dan mengembalikan instance kontrak EthicsKomdis yang siap digunakan.
 * @dev Gunakan `signer` agar instance dapat mengirim transaksi (write operations).
 *      Gunakan `provider` jika hanya butuh read-only operations.
 * @param {string} contractAddress - Address kontrak EthicsKomdis yang sudah di-deploy.
 * @param {ethers.Signer | ethers.Provider} signerOrProvider - Signer atau Provider dari Ethers.js.
 * @returns {ethers.Contract} Instance kontrak yang sudah terkonfigurasi dengan ABI dan address.
 * @throws {Error} Jika contractAddress kosong atau tidak valid.
 *
 * @example
 * // Dengan signer (untuk write operations):
 * const { signer } = await connectWallet();
 * const contract = getContractInstance("0xYourContractAddress", signer);
 * await contract.registerStudent("12345", "Budi Santoso");
 *
 * @example
 * // Dengan provider (untuk read-only operations):
 * const { provider } = await connectWallet();
 * const contract = getContractInstance("0xYourContractAddress", provider);
 * const status = await contract.getStudentStatus("12345");
 */
export function getContractInstance(contractAddress, signerOrProvider) {
  if (!contractAddress) {
    throw new Error(
      "[EthicConnector] Contract address tidak valid. Pastikan kontrak sudah di-deploy dan address sudah dikonfigurasi."
    );
  }

  if (!signerOrProvider) {
    throw new Error(
      "[EthicConnector] Signer atau Provider diperlukan untuk membuat contract instance."
    );
  }

  const contract = new ethers.Contract(
    contractAddress,
    ETHICS_KOMDIS_ABI,
    signerOrProvider
  );

  console.log(`[EthicConnector] Contract instance dibuat: ${contractAddress}`);
  return contract;
}

// ============================================================================
// UTILITY HELPERS
// ============================================================================

/**
 * @notice Memformat address Ethereum menjadi format pendek (truncated).
 * @param {string} address - Full Ethereum address (0x...).
 * @returns {string} Address yang disingkat, contoh: "0x1234...abcd"
 */
export function formatAddress(address) {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * @notice Mendapatkan chain ID jaringan yang sedang aktif di MetaMask.
 * @returns {Promise<number>} Chain ID sebagai number.
 */
export async function getCurrentChainId() {
  if (!window.ethereum) return null;
  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  return parseInt(chainIdHex, 16);
}

/**
 * @notice Mendaftarkan listener untuk perubahan akun MetaMask.
 * @param {Function} callback - Fungsi yang akan dipanggil dengan array accounts baru.
 */
export function onAccountsChanged(callback) {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", callback);
  }
}

/**
 * @notice Mendaftarkan listener untuk perubahan jaringan MetaMask.
 * @param {Function} callback - Fungsi yang akan dipanggil dengan chainId baru.
 */
export function onChainChanged(callback) {
  if (window.ethereum) {
    window.ethereum.on("chainChanged", callback);
  }
}

/**
 * @notice Menghapus semua listener MetaMask (cleanup saat komponen unmount).
 */
export function removeAllListeners() {
  if (window.ethereum && window.ethereum.removeAllListeners) {
    window.ethereum.removeAllListeners("accountsChanged");
    window.ethereum.removeAllListeners("chainChanged");
  }
}

// ============================================================================
// EXPORTS DEFAULT
// ============================================================================
export default {
  connectWallet,
  getContractInstance,
  formatAddress,
  getCurrentChainId,
  onAccountsChanged,
  onChainChanged,
  removeAllListeners,
  ETHICS_KOMDIS_ABI,
};
