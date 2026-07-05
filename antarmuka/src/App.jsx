import { useState, useEffect, useCallback, useRef, Component } from "react";
import {
  connectWallet,
  getContractInstance,
  formatAddress,
  onAccountsChanged,
  onChainChanged,
  removeAllListeners,
} from "../../konektor/ethicConnector.js";
import {
  GraduationCap,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Search,
  UserPlus,
  Scale,
  Award,
  Loader2,
  Copy,
  ChevronRight,
  BookOpen,
  AlertOctagon,
  XCircle,
  Wifi,
  WifiOff,
  Activity,
  Lock,
  Unlock,
  ShieldAlert,
  Trophy,
  Bookmark,
} from "lucide-react";

// ============================================================================
// REACT ERROR BOUNDARY — Mencegah layar putih saat terjadi error render
// ============================================================================
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "#F8F9FC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
          fontFamily: "Inter, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}>
          <div style={{
            background: "#fff",
            border: "2px solid #E2E8F0",
            borderRadius: "1rem",
            padding: "2.5rem",
            maxWidth: "480px",
            boxShadow: "0 8px 28px rgba(10,18,50,0.14)",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
            <h2 style={{ color: "#1e3a8a", fontWeight: 800, marginBottom: "0.5rem" }}>
              Terjadi Kesalahan Tak Terduga
            </h2>
            <p style={{ color: "#6285d8", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Aplikasi mengalami error. Coba refresh halaman.
            </p>
            <pre style={{
              background: "#f0f4ff",
              border: "1px solid #bccff4",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              fontSize: "0.7rem",
              color: "#9B1C1C",
              textAlign: "left",
              overflowX: "auto",
              marginBottom: "1.5rem",
            }}>
              {this.state.error?.message || "Unknown error"}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "#1E3A8A",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.75rem 2rem",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              🔄 Refresh Halaman
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// CONFIGURATION — Contract address
// ============================================================================
// Pada saat pengembangan, Hardhat memberikan address default
// "0x5FbDB2315678afecb367f032d93F642f64180aa3". Setelah kontrak di‑deploy,
// salin address yang muncul di terminal (CONTRACT ADDRESS) dan set di file
// .env pada root proyek React:
//   REACT_APP_CONTRACT_ADDRESS=0x<address_yang_dideploy>
// React secara otomatis memuat variabel yang diawali dengan REACT_APP_.
// Jika variabel tidak ada, fallback ke placeholder (akan menimbulkan error
// pada getContractInstance, sehingga Anda akan diingatkan untuk mengatur
// address yang benar).
const CONTRACT_ADDRESS = (typeof process !== "undefined" && process.env.REACT_APP_CONTRACT_ADDRESS) || import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shortenAddress = (addr) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

const classNames = (...classes) => classes.filter(Boolean).join(" ");

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/** Animated spinner wrapper */
const Spinner = ({ size = "md" }) => {
  const sz = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-5 h-5";
  return <Loader2 className={`${sz} animate-spin`} />;
};

/** Toast Notification */
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = {
    success: "toast-success",
    error: "toast-error",
    info: "toast-info",
    warning: "toast-warning",
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    error: <XCircle className="w-5 h-5 shrink-0" />,
    info: <Activity className="w-5 h-5 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div className={`toast-base ${styles[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{toast.title}</p>
          {toast.message && (
            <p className="text-xs mt-1 opacity-80 break-words">{toast.message}</p>
          )}
        </div>
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/** Tab Component */
const Tab = ({ tabs, activeTab, onChange }) => (
  <div className="tab-container">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={classNames(
          "tab-item",
          activeTab === tab.id ? "tab-active" : "tab-inactive"
        )}
      >
        {tab.icon}
        <span className="hidden sm:inline">{tab.label}</span>
      </button>
    ))}
  </div>
);

/** Input Field */
const InputField = ({ label, id, placeholder, value, onChange, type = "text", hint }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="field-label">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="field-input"
    />
    {hint && <p className="text-xs text-navy-400 mt-1 opacity-70">{hint}</p>}
  </div>
);

/** Metric Card */
const MetricCard = ({ label, value, color, icon, subtitle }) => (
  <div className={`metric-card ${color}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">{label}</p>
        <p className="text-3xl font-black">{value}</p>
        {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
      </div>
      <div className="opacity-25 mt-1">{icon}</div>
    </div>
  </div>
);

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  // --- Wallet State ---
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState("register");
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);

  // --- Form States ---
  // Register
  const [regNim, setRegNim] = useState("");
  const [regName, setRegName] = useState("");
  const [isRegLoading, setIsRegLoading] = useState(false);

  // Violation
  const [vioNim, setVioNim] = useState("");
  const [vioPoints, setVioPoints] = useState("");
  const [vioDesc, setVioDesc] = useState("");
  const [isVioLoading, setIsVioLoading] = useState(false);

  // Reward
  const [rewNim, setRewNim] = useState("");
  const [rewPoints, setRewPoints] = useState("");
  const [rewDesc, setRewDesc] = useState("");
  const [isRewLoading, setIsRewLoading] = useState(false);

  // --- Student Search State ---
  const [searchNim, setSearchNim] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // --- Student Directory State ---
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [isLoadingStudentsList, setIsLoadingStudentsList] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  // =========================================================================
  // EFFECTS
  // =========================================================================

  useEffect(() => {
    setIsMetaMaskAvailable(
      typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    );
  }, []);

  useEffect(() => {
    if (!isMetaMaskAvailable) return;

    const handleAccountChange = (accounts) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else {
        setAccount(accounts[0]);
        showToast("info", "Akun Berganti", `Terhubung ke ${shortenAddress(accounts[0])}`);
      }
    };

    const handleChainChange = () => {
      showToast("warning", "Jaringan Berganti", "Halaman akan di-refresh untuk keamanan.");
      setTimeout(() => window.location.reload(), 1500);
    };

    onAccountsChanged(handleAccountChange);
    onChainChanged(handleChainChange);

    return () => removeAllListeners();
  }, [isMetaMaskAvailable]);

  // =========================================================================
  // HELPERS
  // =========================================================================

  const showToast = useCallback((type, title, message = "") => {
    setToast({ type, title, message });
  }, []);

  const handleDisconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setStudentData(null);
  };

  const copyAddress = async () => {
    if (!account) return;
    await navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // =========================================================================
  // WALLET CONNECTION
  // =========================================================================

  const handleConnectWallet = async () => {
    if (!isMetaMaskAvailable) {
      showToast("error", "MetaMask Tidak Ditemukan", "Silakan install ekstensi MetaMask.");
      return;
    }

    setIsConnecting(true);
    try {
      const result = await connectWallet();
      setProvider(result.provider);
      setSigner(result.signer);
      setAccount(result.account);

      if (
        CONTRACT_ADDRESS &&
        CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000"
      ) {
        const contractInstance = getContractInstance(CONTRACT_ADDRESS, result.signer);
        setContract(contractInstance);
        showToast(
          "success",
          "Wallet Terhubung!",
          `${shortenAddress(result.account)} siap berinteraksi dengan kontrak.`
        );
      } else {
        showToast(
          "warning",
          "Wallet Terhubung",
          "Contract address belum dikonfigurasi. Update CONTRACT_ADDRESS di App.jsx."
        );
      }
    } catch (err) {
      showToast("error", "Koneksi Gagal", err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // =========================================================================
  // CONTRACT INTERACTIONS
  // =========================================================================

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    if (!contract) {
      showToast("error", "Kontrak Belum Terhubung", "Hubungkan wallet terlebih dahulu.");
      return;
    }
    if (!regNim.trim() || !regName.trim()) {
      showToast("warning", "Form Tidak Lengkap", "NIM dan Nama Mahasiswa wajib diisi.");
      return;
    }

    setIsRegLoading(true);
    try {
      showToast("info", "Mengirim Transaksi...", "Konfirmasi di MetaMask.");
      const tx = await contract.registerStudent(regNim.trim(), regName.trim());
      showToast("info", "Transaksi Terkirim", `Hash: ${tx.hash.slice(0, 20)}...`);
      await tx.wait();
      showToast("success", "Mahasiswa Berhasil Didaftarkan!", `${regName} (${regNim}) telah tercatat di blockchain.`);
      setRegNim("");
      setRegName("");
      fetchRegisteredStudents(contract);
    } catch (err) {
      const msg = err?.reason || err?.data?.message || err.message || "Transaksi gagal.";
      showToast("error", "Registrasi Gagal", msg);
    } finally {
      setIsRegLoading(false);
    }
  };

  const handleAddViolation = async (e) => {
    e.preventDefault();
    if (!contract) {
      showToast("error", "Kontrak Belum Terhubung", "Hubungkan wallet terlebih dahulu.");
      return;
    }
    const points = parseInt(vioPoints);
    if (!vioNim.trim() || isNaN(points) || points <= 0 || !vioDesc.trim()) {
      showToast("warning", "Form Tidak Valid", "Semua field wajib diisi. Poin harus berupa angka positif.");
      return;
    }

    setIsVioLoading(true);
    try {
      showToast("info", "Mengirim Transaksi...", "Konfirmasi di MetaMask.");
      const tx = await contract.addViolation(vioNim.trim(), points, vioDesc.trim());
      showToast("info", "Transaksi Terkirim", `Hash: ${tx.hash.slice(0, 20)}...`);
      await tx.wait();
      showToast("error", "Poin Pelanggaran Ditambahkan", `+${points} poin pelanggaran untuk NIM ${vioNim}.`);
      setVioNim("");
      setVioPoints("");
      setVioDesc("");
    } catch (err) {
      const msg = err?.reason || err?.data?.message || err.message || "Transaksi gagal.";
      showToast("error", "Input Pelanggaran Gagal", msg);
    } finally {
      setIsVioLoading(false);
    }
  };

  const handleAddReward = async (e) => {
    e.preventDefault();
    if (!contract) {
      showToast("error", "Kontrak Belum Terhubung", "Hubungkan wallet terlebih dahulu.");
      return;
    }
    const points = parseInt(rewPoints);
    if (!rewNim.trim() || isNaN(points) || points <= 0 || !rewDesc.trim()) {
      showToast("warning", "Form Tidak Valid", "Semua field wajib diisi. Poin harus berupa angka positif.");
      return;
    }

    setIsRewLoading(true);
    try {
      showToast("info", "Mengirim Transaksi...", "Konfirmasi di MetaMask.");
      const tx = await contract.addReward(rewNim.trim(), points, rewDesc.trim());
      showToast("info", "Transaksi Terkirim", `Hash: ${tx.hash.slice(0, 20)}...`);
      await tx.wait();
      showToast("success", "Poin Apresiasi Ditambahkan", `+${points} poin prestasi untuk NIM ${rewNim}.`);
      setRewNim("");
      setRewPoints("");
      setRewDesc("");
    } catch (err) {
      const msg = err?.reason || err?.data?.message || err.message || "Transaksi gagal.";
      showToast("error", "Input Apresiasi Gagal", msg);
    } finally {
      setIsRewLoading(false);
    }
  };

  const handleSearchStudent = async (e, nimOverride = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetNim = nimOverride || searchNim;

    if (!targetNim.trim()) {
      showToast("warning", "NIM Kosong", "Masukkan NIM mahasiswa yang ingin dicari.");
      return;
    }

    setIsSearchLoading(true);
    setStudentData(null);
    setSearchError(null);

    try {
      // Use contract or create read-only instance for public access
      let searchContract = contract;
      if (!searchContract && CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        // Create read-only contract instance for public (no signer needed)
        const { ethers } = await import("ethers");
        const provider = new ethers.JsonRpcProvider("http://localhost:8545");
        const CONTRACT_ABI = [
          "function getStudentStatus(string nim) external view returns (string, uint256, uint256, bool, uint256)"
        ];
        searchContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      }
      
      if (!searchContract) {
        showToast("error", "Kontrak Tidak Tersedia", "Tidak dapat terhubung ke blockchain. Pastikan server berjalan.");
        return;
      }
      
      const result = await searchContract.getStudentStatus(targetNim.trim());
      // Destructure tuple result from ethers
      const [name, violationPoints, rewardPoints, isFrozen, netPoints] = result;
      setStudentData({
        nim: targetNim.trim(),
        name,
        violationPoints: Number(violationPoints),
        rewardPoints: Number(rewardPoints),
        isFrozen,
        netPoints: Number(netPoints),
      });
    } catch (err) {
      const msg = err?.reason || err?.data?.message || err.message || "";
      if (msg.includes("belum terdaftar") || msg.includes("NIM")) {
        setSearchError("Mahasiswa dengan NIM ini tidak ditemukan dalam sistem.");
      } else {
        setSearchError(`Gagal mengambil data: ${msg || "Terjadi kesalahan."}`);
      }
    } finally {
      setIsSearchLoading(false);
    }
  };

  const fetchRegisteredStudents = useCallback(async (contractInstance) => {
    if (!contractInstance) return;
    setIsLoadingStudentsList(true);
    try {
      const events = await contractInstance.queryFilter(
        "LogStudentRegistered"
      );

      console.log("📋 Total events fetched:", events.length);

      const studentsList = [];
      const nimSet = new Set();

      for (let idx = 0; idx < events.length; idx++) {
        const event = events[idx];
        console.log(`Event ${idx}:`, event);
        console.log(`Event.args ${idx}:`, event.args);
        
        try {
          // Get non-indexed parameter (name) directly from event args
          let name = event.args?.name ?? event.args?.[1] ?? "";
          
          console.log(`Event ${idx} - name (raw):`, name, typeof name);
          
          // Convert Result object to string if needed
          if (name && typeof name === "object") {
            try {
              name = name.toString ? name.toString() : String(name);
            } catch {
              name = "";
            }
          }
          
          console.log(`Event ${idx} - name (converted):`, name);

          // For indexed string (nim), MUST decode from transaction input
          let nim = "";
          
          if (event.transactionHash) {
            try {
              const provider = contractInstance.runner?.provider ?? contractInstance.provider;
              if (provider) {
                const tx = await provider.getTransaction(event.transactionHash);
                if (tx?.data) {
                  const iface = contractInstance.interface;
                  const decoded = iface.parseTransaction({ data: tx.data });
                  
                  console.log(`Event ${idx} - decoded.args:`, decoded.args);
                  
                  if (decoded?.args) {
                    let nimArg = decoded.args[0] !== undefined ? decoded.args[0] : null;
                    
                    console.log(`Event ${idx} - nimArg (raw):`, nimArg, typeof nimArg);
                    
                    if (nimArg) {
                      if (typeof nimArg === "object" && nimArg !== null) {
                        if (nimArg.toString && typeof nimArg.toString === "function") {
                          nim = nimArg.toString();
                        } else if (typeof nimArg === "string") {
                          nim = nimArg;
                        } else {
                          nim = JSON.stringify(nimArg);
                        }
                      } else if (typeof nimArg === "string") {
                        nim = nimArg;
                      } else {
                        nim = String(nimArg);
                      }
                      
                      nim = nim.trim();
                      
                      if (nim.startsWith('"') && nim.endsWith('"')) {
                        nim = nim.slice(1, -1);
                      }
                    }
                    
                    console.log(`Event ${idx} - nim (converted):`, nim);
                  }
                }
              }
            } catch (txErr) {
              console.warn(`Event ${idx} - Gagal decode NIM:`, txErr);
            }
          }

          // Only add if both nim and name are valid strings
          if (nim && typeof nim === "string" && nim.length > 0 && 
              name && typeof name === "string" && name.length > 0 && 
              !nimSet.has(nim)) {
            nimSet.add(nim);
            studentsList.push({ nim, name });
            console.log("✅ Student ditambahkan:", { nim, name });
          } else {
            console.log(`⚠️ Event ${idx} skipped:`, { nim, name, nimValid: nim && typeof nim === "string", nameValid: name && typeof name === "string" });
          }
        } catch (evErr) {
          console.warn(`Event ${idx} - Error:`, evErr);
        }
      }
      
      console.log("📊 Final studentsList:", studentsList);
      setRegisteredStudents(studentsList);
    } catch (err) {
      console.error("Gagal mengambil daftar mahasiswa dari blockchain:", err);
      setRegisteredStudents([]);
    } finally {
      setIsLoadingStudentsList(false);
    }
  }, []);

  const selectStudentForSearch = (nim) => {
    setSearchNim(nim);
    handleSearchStudent(null, nim);
    // Scroll to profile smoothly
    const element = document.getElementById("search-nim");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const selectStudentForViolation = (nim) => {
    setVioNim(nim);
    setActiveTab("violation");
    setTimeout(() => {
      const element = document.getElementById("vio-nim");
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const selectStudentForReward = (nim) => {
    setRewNim(nim);
    setActiveTab("reward");
    setTimeout(() => {
      const element = document.getElementById("rew-nim");
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Sync registered students when contract instance updates
  useEffect(() => {
    if (contract) {
      fetchRegisteredStudents(contract);
    } else {
      setRegisteredStudents([]);
    }
  }, [contract, fetchRegisteredStudents]);

  // =========================================================================
  // RENDER
  // =========================================================================

  const tabs = [
    { id: "register", label: "Registrasi Mahasiswa", icon: <UserPlus className="w-3.5 h-3.5" /> },
    { id: "violation", label: "Catat Pelanggaran", icon: <Scale className="w-3.5 h-3.5" /> },
    { id: "reward", label: "Apresiasi Prestasi", icon: <Award className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="app-root">
      {/* Background: subtle grid + deep navy gradient */}
      <div className="app-bg" />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ===================================================================
          UNIVERSITY HEADER BANNER
      =================================================================== */}
      <header className="uni-header">
        {/* Top accent bar */}
        <div className="header-accent-bar" />
        <div className="header-inner">
          {/* Left: Branding */}
          <div className="header-brand">
            <div className="header-logo">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="header-title-block">
              <h1 className="header-title">
                Portal Disiplin &amp; Prestasi Mahasiswa
              </h1>
              <p className="header-subtitle">
                <span className="font-semibold text-gold-400">EthicsKomdis</span>
                {" · "}Sistem Pencatatan Berbasis Blockchain · Komisi Disiplin
              </p>
            </div>
          </div>

          {/* Right: Wallet Button */}
          <div className="header-wallet-area">
            {account ? (
              <div className="wallet-connected-pill">
                <div className="wallet-dot-active" />
                <span className="wallet-address">{shortenAddress(account)}</span>
                <button
                  onClick={copyAddress}
                  title="Salin address"
                  className="wallet-copy-btn"
                >
                  {copied ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting || !isMetaMaskAvailable}
                className={classNames(
                  "btn-connect-wallet",
                  !isMetaMaskAvailable && "btn-disabled"
                )}
              >
                {isConnecting ? (
                  <>
                    <Spinner size="sm" />
                    <span>Menghubungkan...</span>
                  </>
                ) : (
                  <>
                    {isMetaMaskAvailable ? (
                      <Wifi className="w-4 h-4" />
                    ) : (
                      <WifiOff className="w-4 h-4" />
                    )}
                    <span>{isMetaMaskAvailable ? "Hubungkan Wallet" : "Install MetaMask"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ===================================================================
          MAIN CONTENT
      =================================================================== */}
      <main className="main-content">

        {/* Page Hero */}
        <div className="page-hero">
          <div className="hero-badge">
            <BookOpen className="w-3.5 h-3.5 text-gold-500" />
            <span>Sistem Terdesentralisasi · Immutable &amp; Transparan</span>
          </div>
          <h2 className="hero-heading">
            Sistem Pencatatan{" "}
            <span className="hero-heading-accent">Etika Mahasiswa</span>
          </h2>
          <p className="hero-desc">
            Platform resmi pencatatan poin pelanggaran dan apresiasi prestasi mahasiswa.
            Dieksekusi otomatis oleh <em>smart contract</em> yang terverifikasi di jaringan blockchain.
          </p>
        </div>

        {/* === STUDENT SEARCH — prominent at top === (PUBLIC READ-ONLY) */}
        <div className="search-section">
          <div className="search-card">
            <div className="search-card-header">
              <div className="search-icon-wrap">
                <Search className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <h3 className="search-card-title">Cari Status Mahasiswa</h3>
                <p className="search-card-sub">Pencarian publik untuk transparansi blockchain — siapa saja bisa melihat status tanpa login</p>
              </div>
            </div>
            <form onSubmit={handleSearchStudent} className="search-form">
              <div className="search-input-wrap">
                <Search className="search-input-icon" />
                <input
                  id="search-nim"
                  type="text"
                  value={searchNim}
                  onChange={(e) => setSearchNim(e.target.value)}
                  placeholder="Masukkan NIM mahasiswa (contoh: 2024001)..."
                  className="search-input"
                />
              </div>
              <button
                type="submit"
                disabled={isSearchLoading}
                className="btn-search"
              >
                {isSearchLoading ? <Spinner size="sm" /> : <Search className="w-4 h-4" />}
                <span className="hidden sm:block">{isSearchLoading ? "Mencari..." : "Cari Mahasiswa"}</span>
              </button>
            </form>
            <p className="search-public-note">
              🔓 Pencarian ini bersifat **publik & read-only** — siapa saja bisa melihat status mahasiswa tanpa login.
            </p>
          </div>
        </div>



        {/* Search Error */}
        {searchError && (
          <div className="alert-error animate-fade-in">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Data Tidak Ditemukan</p>
              <p className="text-xs mt-1 opacity-75">{searchError}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isSearchLoading && (
          <div className="loading-card animate-fade-in">
            <div className="loading-spinner-wrap">
              <Spinner size="lg" />
            </div>
            <p className="text-sm text-navy-300">Mengambil data dari blockchain...</p>
            <div className="loading-dots">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="loading-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===============================================================
            STUDENT PROFILE CARD (Appears after search)
        =============================================================== */}
        {studentData && !isSearchLoading && (
          <div className="student-profile animate-fade-in">
            {/* Status strip */}
            <div
              className={`profile-status-strip ${
                studentData.isFrozen ? "strip-frozen" : "strip-active"
              }`}
            />

            <div className="profile-body">
              {/* Identity row */}
              <div className="profile-identity">
                <div>
                  <div className="profile-nim-row">
                    <span className="profile-nim-label">NIM</span>
                    <span className="profile-nim-sep">·</span>
                    <span className="profile-nim-value">{studentData.nim}</span>
                  </div>
                  <h3 className="profile-name">{studentData.name}</h3>
                </div>
                <div className="profile-avatar">
                  <GraduationCap className="w-7 h-7 text-navy-300" />
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <MetricCard
                  label="Poin Pelanggaran"
                  value={studentData.violationPoints}
                  color="metric-violation"
                  icon={<Scale className="w-8 h-8" />}
                  subtitle="Total akumulasi"
                />
                <MetricCard
                  label="Poin Apresiasi"
                  value={studentData.rewardPoints}
                  color="metric-reward"
                  icon={<Award className="w-8 h-8" />}
                  subtitle="Total prestasi"
                />
              </div>

              {/* Net Points Bar */}
              <div className="net-points-bar">
                <div className="flex items-center justify-between mb-2">
                  <span className="net-points-label">Poin Bersih (Net Points)</span>
                  <span
                    className={`net-points-value ${
                      studentData.netPoints >= 100
                        ? "text-crimson"
                        : studentData.netPoints >= 60
                          ? "text-amber-500"
                          : "text-emerald-600"
                    }`}
                  >
                    {studentData.netPoints} / 100
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill ${
                      studentData.netPoints >= 100
                        ? "progress-danger"
                        : studentData.netPoints >= 60
                          ? "progress-warning"
                          : "progress-safe"
                    }`}
                    style={{
                      width: `${Math.min((studentData.netPoints / 100) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-navy-400">0</span>
                  <span className="text-[10px] text-navy-400">Batas Penangguhan KRS: 100</span>
                </div>
              </div>

              {/* =====================================================
                  STATUS BANNER
              ===================================================== */}
              {studentData.isFrozen ? (
                /* === FROZEN STATUS === */
                <div className="status-frozen">
                  <div className="status-icon-wrap status-icon-frozen">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-crimson rounded-full animate-pulse" />
                      <span className="status-label-frozen">⚠ STATUS AKADEMIK KRITIS</span>
                    </div>
                    <p className="status-title-frozen">
                      Status Akademik: KRS DITANGGUHKAN
                    </p>
                    <p className="status-desc-frozen">
                      Hak pengisian KRS dan beasiswa sementara dinonaktifkan.
                      Harap segera menghadap Komisi Disiplin untuk proses rehabilitasi akademik.
                    </p>
                    <div className="frozen-ticker">
                      <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                      <p className="animate-marquee whitespace-nowrap font-mono text-[10px]">
                        ■ PENANGGUHAN AKTIF ■ Net Points: {studentData.netPoints} ■ Batas: 100 ■ Harap Segera Menghadap Komisi Disiplin ■
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* === ACTIVE STATUS === */
                <div className="status-active">
                  <div className="status-icon-wrap status-icon-active">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="status-label-active">Status Aktif</span>
                    </div>
                    <p className="status-title-active">
                      Status Akademik: AKTIF / NORMAL
                    </p>
                    <p className="status-desc-active">
                      Mahasiswa memiliki akses akademik penuh. KRS dan hak beasiswa aktif.
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-30 shrink-0" />
                </div>
              )}
            </div>

            {/* Quick Stats Footer */}
            <div className="profile-stats-row">
              {[
                {
                  label: "Status",
                  value: studentData.isFrozen ? "Ditangguhkan" : "Aktif",
                  color: studentData.isFrozen ? "text-crimson" : "text-emerald-600",
                },
                {
                  label: "Poin Bersih",
                  value: `${studentData.netPoints} pts`,
                  color: studentData.netPoints >= 60 ? "text-amber-500" : "text-navy-700",
                },
                {
                  label: "Sisa Batas",
                  value: `${Math.max(100 - studentData.netPoints, 0)} pts`,
                  color: "text-navy-600",
                },
              ].map((stat) => (
                <div key={stat.label} className="stat-cell">
                  <p className="stat-label">{stat.label}</p>
                  <p className={`stat-value ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!studentData && !isSearchLoading && !searchError && (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <BookOpen className="w-7 h-7 text-navy-400" />
            </div>
            <div>
              <p className="empty-title">Belum Ada Data Mahasiswa</p>
              <p className="empty-desc">
                Masukkan NIM mahasiswa pada kolom pencarian di atas untuk melihat profil etika dan status KRS.
              </p>
            </div>
            <div className="empty-hint">
              <Activity className="w-3.5 h-3.5" />
              <span>Data diambil langsung dari blockchain secara real-time</span>
            </div>
          </div>
        )}

        {/* ===================================================================
            TWO-COLUMN GRID — ADMIN ONLY
        =================================================================== */}
        {account && (
          <div className="two-col-grid">

          {/* =================================================================
              COLUMN 1: PANEL KOMISI DISIPLIN
          ================================================================= */}
          <div className="space-y-4">
            {/* Panel Header */}
            <div className="panel-header">
              <div className="panel-header-icon bg-navy-100 border border-navy-200">
                <ShieldAlert className="w-4 h-4 text-navy-600" />
              </div>
              <div>
                <h3 className="panel-header-title">Panel Komisi Disiplin</h3>
                <p className="panel-header-sub">Akses Terbatas — Hanya Admin Komdis</p>
              </div>
              {account ? (
                <div className="ml-auto badge-admin-active">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Admin Aktif
                </div>
              ) : (
                <div className="ml-auto badge-admin-locked">
                  <Lock className="w-3 h-3" />
                  Terkunci
                </div>
              )}
            </div>

            {/* Form Card */}
            <div className="form-card">
              {/* Locked overlay */}
              {!account && (
                <div className="locked-overlay">
                  <div className="locked-icon-wrap">
                    <Lock className="w-7 h-7 text-navy-400" />
                  </div>
                  <div className="text-center px-6">
                    <p className="font-bold text-navy-700 text-base">Panel Terkunci</p>
                    <p className="text-navy-400 text-xs mt-1 max-w-xs">
                      Hubungkan Wallet MetaMask Admin Komdis untuk mengakses panel ini.
                    </p>
                  </div>
                  <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className="btn-connect-overlay"
                  >
                    <Wallet className="w-4 h-4" />
                    {isConnecting ? "Menghubungkan..." : "Hubungkan MetaMask"}
                  </button>
                </div>
              )}

              <div className="p-5 space-y-5">
                {/* Tabs */}
                <Tab tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                {/* =====================================================
                    TAB 1: REGISTRASI MAHASISWA
                ===================================================== */}
                {activeTab === "register" && (
                  <form onSubmit={handleRegisterStudent} className="space-y-4 animate-fade-in">
                    <div className="form-section-header border-b border-navy-200">
                      <UserPlus className="w-4 h-4 text-navy-600" />
                      <h4 className="form-section-title">Pencatatan Mahasiswa Baru</h4>
                    </div>
                    <div className="info-note note-blue">
                      <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-xs">
                        NIM bersifat <strong>unik dan permanen</strong> — tidak dapat diubah setelah terdaftar di blockchain.
                      </p>
                    </div>
                    <InputField
                      label="NIM (Nomor Induk Mahasiswa)"
                      id="reg-nim"
                      placeholder="Contoh: 2024001"
                      value={regNim}
                      onChange={setRegNim}
                    />
                    <InputField
                      label="Nama Lengkap Mahasiswa"
                      id="reg-name"
                      placeholder="Contoh: Budi Santoso"
                      value={regName}
                      onChange={setRegName}
                    />
                    <button
                      type="submit"
                      disabled={isRegLoading || !account}
                      className="btn-primary-navy w-full"
                    >
                      {isRegLoading ? (
                        <>
                          <Spinner size="sm" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Daftarkan Mahasiswa ke Blockchain</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-navy-400 text-center">
                      Transaksi ini akan dicatat secara permanen dan tidak dapat dihapus.
                    </p>
                  </form>
                )}

                {/* =====================================================
                    TAB 2: PENCATATAN PELANGGARAN MAHASISWA
                ===================================================== */}
                {activeTab === "violation" && (
                  <form onSubmit={handleAddViolation} className="space-y-4 animate-fade-in">
                    <div className="form-section-header border-b border-crimson/20">
                      <Scale className="w-4 h-4 text-crimson" />
                      <h4 className="form-section-title">Pencatatan Pelanggaran Mahasiswa</h4>
                    </div>
                    <div className="info-note note-red">
                      <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-xs">
                        Jika total poin bersih mencapai <strong>≥ 100 poin</strong>, status KRS mahasiswa akan
                        <strong> ditangguhkan otomatis</strong> oleh smart contract.
                      </p>
                    </div>
                    <InputField
                      label="NIM Mahasiswa Pelanggar"
                      id="vio-nim"
                      placeholder="Masukkan NIM"
                      value={vioNim}
                      onChange={setVioNim}
                    />
                    <InputField
                      label="Bobot Poin Pelanggaran"
                      id="vio-points"
                      placeholder="Contoh: 25"
                      type="number"
                      value={vioPoints}
                      onChange={setVioPoints}
                      hint="Nilai harus berupa bilangan bulat positif."
                    />
                    <div className="space-y-1.5">
                      <label htmlFor="vio-desc" className="field-label">
                        Deskripsi &amp; Kronologi Pelanggaran
                      </label>
                      <textarea
                        id="vio-desc"
                        value={vioDesc}
                        onChange={(e) => setVioDesc(e.target.value)}
                        placeholder="Contoh: Terbukti melakukan plagiarisme pada tugas akhir berdasarkan sidang komisi tanggal..."
                        rows={3}
                        className="field-textarea"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isVioLoading || !account}
                      className="btn-danger-crimson w-full"
                    >
                      {isVioLoading ? (
                        <>
                          <Spinner size="sm" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <Scale className="w-4 h-4" />
                          <span>Catat Pelanggaran ke Blockchain</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* =====================================================
                    TAB 3: APRESIASI PRESTASI MAHASISWA
                ===================================================== */}
                {activeTab === "reward" && (
                  <form onSubmit={handleAddReward} className="space-y-4 animate-fade-in">
                    <div className="form-section-header border-b border-emerald-600/20">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <h4 className="form-section-title">Apresiasi Prestasi Mahasiswa</h4>
                    </div>
                    <div className="info-note note-green">
                      <Trophy className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-xs">
                        Poin apresiasi akan <strong>mengurangi poin bersih</strong> mahasiswa dan dapat
                        <strong> memulihkan status KRS</strong> secara otomatis jika net points kembali di bawah 100.
                      </p>
                    </div>
                    <InputField
                      label="NIM Mahasiswa Berprestasi"
                      id="rew-nim"
                      placeholder="Masukkan NIM"
                      value={rewNim}
                      onChange={setRewNim}
                    />
                    <InputField
                      label="Bobot Poin Apresiasi"
                      id="rew-points"
                      placeholder="Contoh: 30"
                      type="number"
                      value={rewPoints}
                      onChange={setRewPoints}
                      hint="Nilai harus berupa bilangan bulat positif."
                    />
                    <div className="space-y-1.5">
                      <label htmlFor="rew-desc" className="field-label">
                        Deskripsi Prestasi &amp; Pencapaian
                      </label>
                      <textarea
                        id="rew-desc"
                        value={rewDesc}
                        onChange={(e) => setRewDesc(e.target.value)}
                        placeholder="Contoh: Mewakili kampus dalam kompetisi nasional dan meraih Juara I tingkat nasional..."
                        rows={3}
                        className="field-textarea field-textarea-green"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isRewLoading || !account}
                      className="btn-success-emerald w-full"
                    >
                      {isRewLoading ? (
                        <>
                          <Spinner size="sm" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4" />
                          <span>Berikan Apresiasi ke Blockchain</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Network Info Card */}
            <div className="network-card">
              <div className="flex items-center gap-3">
                <div className="network-icon-wrap">
                  <Activity className="w-4 h-4 text-navy-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Jaringan Aktif</p>
                  <p className="text-sm font-bold text-navy-700 truncate">
                    {account ? "Hardhat Local (Chain ID: 31337)" : "Tidak Terhubung"}
                  </p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${account ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
              </div>
              {CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000" && (
                <div className="network-contract">
                  <p className="text-[10px] text-navy-400 uppercase font-semibold tracking-wider mb-1">
                    Contract Address
                  </p>
                  <p className="text-xs font-mono text-navy-600 break-all">{CONTRACT_ADDRESS}</p>
                </div>
              )}
            </div>
          </div>

          {/* =================================================================
              COLUMN 2: BUKU CATATAN RESMI / AUDIT LEDGER
          ================================================================= */}
          <div className="space-y-6">
            {/* Column Header */}
            <div className="panel-header">
              <div className="panel-header-icon bg-gold-50 border border-gold-200">
                <Bookmark className="w-4 h-4 text-gold-600" />
              </div>
              <div>
                <h3 className="panel-header-title">Buku Catatan Resmi Mahasiswa</h3>
                <p className="panel-header-sub">Query data real-time dari blockchain · Audit Trail Immutable</p>
              </div>
            </div>

            {/* Informational Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="info-stat-card">
                <div className="info-stat-icon bg-navy-100">
                  <ShieldAlert className="w-4 h-4 text-navy-600" />
                </div>
                <p className="info-stat-label">Sistem</p>
                <p className="info-stat-value">Blockchain</p>
              </div>
              <div className="info-stat-card">
                <div className="info-stat-icon bg-crimson-light">
                  <Scale className="w-4 h-4 text-crimson" />
                </div>
                <p className="info-stat-label">Batas KRS</p>
                <p className="info-stat-value text-crimson">100 Poin</p>
              </div>
              <div className="info-stat-card">
                <div className="info-stat-icon bg-emerald-50">
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="info-stat-label">Solidity</p>
                <p className="info-stat-value text-emerald-700">^0.8.20</p>
              </div>
            </div>

            {/* Direktori Mahasiswa Terdaftar */}
            <div className="directory-card animate-fade-in">
              <div className="directory-header">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-navy-700" />
                  <h4 className="directory-title font-serif">Direktori Mahasiswa</h4>
                </div>
                <span className="directory-count font-mono text-[10px]">
                  {isLoadingStudentsList ? (
                    <Spinner size="sm" />
                  ) : (
                    `${registeredStudents.length} Mahasiswa`
                  )}
                </span>
              </div>

              {/* Table Search Input */}
              {account && registeredStudents.length > 0 && (
                <div className="directory-search-wrap">
                  <Search className="directory-search-icon" />
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama atau NIM..."
                    className="directory-search-input"
                  />
                </div>
              )}

              {/* Directory Content */}
              {!account ? (
                <div className="directory-empty">
                  <Lock className="w-6 h-6 text-navy-400 mb-1.5" />
                  <p className="text-xs font-bold text-navy-700">Direktori Terkunci</p>
                  <p className="text-[10px] text-navy-400 mt-0.5">Hubungkan wallet admin untuk melihat daftar.</p>
                </div>
              ) : isLoadingStudentsList ? (
                <div className="directory-loading">
                  <Spinner size="md" />
                  <p className="text-xs text-navy-400 mt-2">Membaca daftar dari blockchain...</p>
                </div>
              ) : registeredStudents.length === 0 ? (
                <div className="directory-empty">
                  <BookOpen className="w-6 h-6 text-navy-400 mb-1.5" />
                  <p className="text-xs font-bold text-navy-700">Belum Ada Mahasiswa</p>
                  <p className="text-[10px] text-navy-400 mt-0.5">Daftarkan mahasiswa baru di panel kiri.</p>
                </div>
              ) : (
                <div className="directory-table-container">
                  <table className="directory-table">
                    <thead>
                      <tr>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th className="text-right">Aksi Cepat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredStudents
                        .filter(
                          (s) =>
                            s.nim.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                            s.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
                        )
                        .map((student) => (
                          <tr key={student.nim} className="directory-row">
                            <td className="font-mono text-xs font-bold text-navy-700">{student.nim}</td>
                            <td className="text-xs font-semibold text-navy-800 truncate max-w-[120px]" title={student.name}>
                              {student.name}
                            </td>
                            <td className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => selectStudentForSearch(student.nim)}
                                  title="Cari & Lihat Status"
                                  className="directory-action-btn btn-action-search"
                                >
                                  <Search className="w-2.5 h-2.5" />
                                  <span>Cari</span>
                                </button>
                                <button
                                  onClick={() => selectStudentForViolation(student.nim)}
                                  title="Catat Pelanggaran"
                                  className="directory-action-btn btn-action-vio"
                                >
                                  <Scale className="w-2.5 h-2.5" />
                                  <span>Pelanggaran</span>
                                </button>
                                <button
                                  onClick={() => selectStudentForReward(student.nim)}
                                  title="Apresiasi Prestasi"
                                  className="directory-action-btn btn-action-rew"
                                >
                                  <Award className="w-2.5 h-2.5" />
                                  <span>Apresiasi</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {registeredStudents.filter(
                        (s) =>
                          s.nim.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                          s.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-4 text-xs text-navy-400">
                            Tidak ada hasil pencocokan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        {/* How It Works */}
        <div className="how-it-works-card">
              <h4 className="how-it-works-title">
                <BookOpen className="w-4 h-4 text-gold-600" />
                Cara Kerja Sistem
              </h4>
              <div className="how-it-works-steps">
                {[
                  {
                    step: "01",
                    title: "Registrasi Mahasiswa",
                    desc: "Admin mendaftarkan NIM & nama ke smart contract.",
                    color: "step-blue",
                    icon: <UserPlus className="w-3.5 h-3.5" />,
                  },
                  {
                    step: "02",
                    title: "Catat Pelanggaran",
                    desc: "Poin pelanggaran ditambahkan dan dicatat immutable.",
                    color: "step-red",
                    icon: <Scale className="w-3.5 h-3.5" />,
                  },
                  {
                    step: "03",
                    title: "Apresiasi Prestasi",
                    desc: "Poin apresiasi mengurangi akumulasi poin bersih.",
                    color: "step-green",
                    icon: <Award className="w-3.5 h-3.5" />,
                  },
                  {
                    step: "04",
                    title: "Penangguhan Otomatis",
                    desc: "Jika net ≥ 100, KRS ditangguhkan oleh smart contract.",
                    color: "step-crimson",
                    icon: <Lock className="w-3.5 h-3.5" />,
                  },
                ].map((item) => (
                  <div key={item.step} className="step-item">
                    <div className={`step-badge ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="step-title">{item.title}</p>
                      <p className="step-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-card">
              <AlertTriangle className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <p className="disclaimer-title">Catatan Penting</p>
                <p className="disclaimer-desc">
                  Seluruh data yang telah dicatat bersifat <strong>permanen dan tidak dapat dihapus</strong>.
                  Pastikan setiap entri telah diverifikasi secara resmi sebelum dikonfirmasi ke blockchain.
                  Sistem ini merupakan bagian dari tata kelola akademik berbasis teknologi terdesentralisasi.
                </p>
              </div>
        </div>
      </main>

      {/* =====================================================================
          FOOTER
      ===================================================================== */}
      <footer className="uni-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <GraduationCap className="w-4 h-4 text-navy-500" />
            <span>
              <span className="font-semibold text-navy-700">EthicsKomdis DApp</span>
              {" · "}Portal Disiplin &amp; Prestasi Mahasiswa
            </span>
          </div>
          <div className="footer-meta">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Smart Contract: EthicsKomdis.sol
            </span>
            <span>·</span>
            <span>Threshold: 100 poin</span>
            <span>·</span>
            <span>Powered by Ethereum</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
