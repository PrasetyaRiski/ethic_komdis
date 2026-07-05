// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EthicsKomdis
 * @author Sistem Etika Kampus
 * @notice Smart contract untuk pencatatan poin pelanggaran dan prestasi etika mahasiswa.
 *         Dikelola oleh Komisi Disiplin (Komdis). Jika Net Points >= 100, KRS mahasiswa
 *         akan dibekukan secara otomatis oleh smart enforcement logic.
 * @dev Menggunakan Solidity 0.8.20 dengan checked arithmetic built-in (no overflow).
 *      Underflow pada uint256 ditangani secara eksplisit di getStudentStatus().
 */
contract EthicsKomdis {
    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /// @notice Address Komisi Disiplin yang memiliki hak eksklusif untuk memodifikasi data.
    address public adminKomdis;

    /// @notice Batas poin bersih (net points) yang memicu pembekuan KRS.
    uint256 public constant THRESHOLD_LOCK = 100;

    // =========================================================================
    // STRUCTS
    // =========================================================================

    /**
     * @notice Representasi data seorang mahasiswa dalam sistem.
     * @param name          Nama lengkap mahasiswa.
     * @param violationPoints Total akumulasi poin pelanggaran.
     * @param rewardPoints    Total akumulasi poin prestasi/apresiasi.
     * @param isFrozen        Status pembekuan KRS dan beasiswa.
     * @param isRegistered    Guard untuk mencegah duplikasi registrasi.
     */
    struct Student {
        string name;
        uint256 violationPoints;
        uint256 rewardPoints;
        bool isFrozen;
        bool isRegistered;
    }

    // =========================================================================
    // MAPPINGS
    // =========================================================================

    /// @dev Mapping dari NIM (string) ke data Student.
    mapping(string => Student) private students;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /**
     * @notice Dipanggil ketika mahasiswa baru berhasil didaftarkan.
     * @param nim  Nomor Induk Mahasiswa.
     * @param name Nama lengkap mahasiswa.
     * @param timestamp Waktu registrasi (block timestamp).
     */
    event LogStudentRegistered(
        string indexed nim,
        string name,
        uint256 timestamp
    );

    /**
     * @notice Dipanggil ketika poin pelanggaran ditambahkan ke seorang mahasiswa.
     * @param nim         Nomor Induk Mahasiswa.
     * @param points      Jumlah poin pelanggaran yang ditambahkan.
     * @param description Deskripsi kasus pelanggaran.
     * @param totalViolationPoints Total poin pelanggaran setelah penambahan.
     * @param timestamp   Waktu transaksi.
     */
    event LogViolationAdded(
        string indexed nim,
        uint256 points,
        string description,
        uint256 totalViolationPoints,
        uint256 timestamp
    );

    /**
     * @notice Dipanggil ketika poin apresiasi/prestasi ditambahkan ke seorang mahasiswa.
     * @param nim         Nomor Induk Mahasiswa.
     * @param points      Jumlah poin prestasi yang ditambahkan.
     * @param description Deskripsi prestasi yang diraih.
     * @param totalRewardPoints Total poin apresiasi setelah penambahan.
     * @param timestamp   Waktu transaksi.
     */
    event LogRewardAdded(
        string indexed nim,
        uint256 points,
        string description,
        uint256 totalRewardPoints,
        uint256 timestamp
    );

    /**
     * @notice Dipanggil ketika KRS mahasiswa dibekukan secara otomatis.
     * @param nim       Nomor Induk Mahasiswa yang dibekukan.
     * @param netPoints Net points pada saat pembekuan terjadi.
     * @param timestamp Waktu pembekuan.
     */
    event LogStudentFrozen(
        string indexed nim,
        uint256 netPoints,
        uint256 timestamp
    );

    /**
     * @notice Dipanggil ketika pembekuan KRS mahasiswa dicabut secara otomatis.
     * @param nim       Nomor Induk Mahasiswa yang dipulihkan.
     * @param netPoints Net points pada saat pencabutan terjadi.
     * @param timestamp Waktu pencabutan pembekuan.
     */
    event LogStudentUnfrozen(
        string indexed nim,
        uint256 netPoints,
        uint256 timestamp
    );

    // =========================================================================
    // MODIFIERS
    // =========================================================================

    /**
     * @notice Membatasi akses fungsi hanya untuk adminKomdis.
     * @dev Reverts dengan pesan error jika pemanggil bukan adminKomdis.
     */
    modifier onlyKomdis() {
        require(
            msg.sender == adminKomdis,
            "EthicsKomdis: Akses ditolak. Hanya Admin Komdis yang berwenang."
        );
        _;
    }

    /**
     * @notice Memastikan mahasiswa dengan NIM yang diberikan sudah terdaftar.
     * @param nim Nomor Induk Mahasiswa yang akan divalidasi.
     */
    modifier studentExists(string memory nim) {
        require(
            students[nim].isRegistered,
            "EthicsKomdis: Mahasiswa dengan NIM ini belum terdaftar."
        );
        _;
    }

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /**
     * @notice Inisialisasi kontrak. Deployer secara otomatis menjadi adminKomdis.
     */
    constructor() {
        adminKomdis = msg.sender;
    }

    // =========================================================================
    // EXTERNAL / PUBLIC FUNCTIONS (STATE-CHANGING) — onlyKomdis
    // =========================================================================

    /**
     * @notice Mendaftarkan mahasiswa baru ke dalam sistem.
     * @dev Hanya adminKomdis yang dapat memanggil fungsi ini.
     *      Reverts jika NIM sudah pernah didaftarkan sebelumnya.
     * @param nim  Nomor Induk Mahasiswa (bersifat unik, digunakan sebagai primary key).
     * @param name Nama lengkap mahasiswa.
     */
    function registerStudent(
        string memory nim,
        string memory name
    ) external onlyKomdis {
        require(
            !students[nim].isRegistered,
            "EthicsKomdis: NIM ini sudah terdaftar dalam sistem."
        );
        require(bytes(nim).length > 0, "EthicsKomdis: NIM tidak boleh kosong.");
        require(
            bytes(name).length > 0,
            "EthicsKomdis: Nama mahasiswa tidak boleh kosong."
        );

        students[nim] = Student({
            name: name,
            violationPoints: 0,
            rewardPoints: 0,
            isFrozen: false,
            isRegistered: true
        });

        emit LogStudentRegistered(nim, name, block.timestamp);
    }

    /**
     * @notice Menambahkan poin pelanggaran kepada seorang mahasiswa.
     * @dev Setelah penambahan, kontrak secara otomatis mengevaluasi apakah
     *      net points >= THRESHOLD_LOCK. Jika ya, status isFrozen diset true
     *      dan event LogStudentFrozen dipancarkan.
     * @param nim         Nomor Induk Mahasiswa.
     * @param points      Jumlah poin pelanggaran yang akan ditambahkan (harus > 0).
     * @param description Deskripsi singkat kasus pelanggaran.
     */
    function addViolation(
        string memory nim,
        uint256 points,
        string memory description
    ) external onlyKomdis studentExists(nim) {
        require(points > 0, "EthicsKomdis: Poin pelanggaran harus lebih dari 0.");
        require(
            bytes(description).length > 0,
            "EthicsKomdis: Deskripsi pelanggaran tidak boleh kosong."
        );

        Student storage s = students[nim];
        s.violationPoints += points;

        emit LogViolationAdded(nim, points, description, s.violationPoints, block.timestamp);

        // --- KRS Freeze Algorithm ---
        uint256 netPoints = _calculateNetPoints(s.violationPoints, s.rewardPoints);
        if (netPoints >= THRESHOLD_LOCK && !s.isFrozen) {
            s.isFrozen = true;
            emit LogStudentFrozen(nim, netPoints, block.timestamp);
        }
    }

    /**
     * @notice Menambahkan poin apresiasi/prestasi kepada seorang mahasiswa.
     * @dev Setelah penambahan, kontrak secara otomatis mengevaluasi apakah
     *      net points turun di bawah THRESHOLD_LOCK. Jika ya dan mahasiswa
     *      sebelumnya dibekukan, pembekuan akan otomatis dicabut.
     * @param nim         Nomor Induk Mahasiswa.
     * @param points      Jumlah poin apresiasi yang akan ditambahkan (harus > 0).
     * @param description Deskripsi singkat prestasi yang diraih.
     */
    function addReward(
        string memory nim,
        uint256 points,
        string memory description
    ) external onlyKomdis studentExists(nim) {
        require(points > 0, "EthicsKomdis: Poin apresiasi harus lebih dari 0.");
        require(
            bytes(description).length > 0,
            "EthicsKomdis: Deskripsi prestasi tidak boleh kosong."
        );

        Student storage s = students[nim];
        s.rewardPoints += points;

        emit LogRewardAdded(nim, points, description, s.rewardPoints, block.timestamp);

        // --- KRS Unfreeze Re-evaluation ---
        uint256 netPoints = _calculateNetPoints(s.violationPoints, s.rewardPoints);
        if (netPoints < THRESHOLD_LOCK && s.isFrozen) {
            s.isFrozen = false;
            emit LogStudentUnfrozen(nim, netPoints, block.timestamp);
        }
    }

    // =========================================================================
    // PUBLIC VIEW FUNCTIONS (READ-ONLY) — accessible by anyone
    // =========================================================================

    /**
     * @notice Mengambil status lengkap seorang mahasiswa berdasarkan NIM.
     * @dev Menghitung netPoints secara safe (underflow-protected).
     *      Dapat dipanggil oleh siapapun (public view).
     * @param nim Nomor Induk Mahasiswa yang akan dicari.
     * @return name             Nama lengkap mahasiswa.
     * @return violationPoints  Total poin pelanggaran yang telah diakumulasi.
     * @return rewardPoints     Total poin apresiasi yang telah diakumulasi.
     * @return isFrozen         Status pembekuan KRS saat ini.
     * @return netPoints        Poin bersih (violationPoints - rewardPoints), min 0.
     */
    function getStudentStatus(
        string memory nim
    )
        external
        view
        studentExists(nim)
        returns (
            string memory name,
            uint256 violationPoints,
            uint256 rewardPoints,
            bool isFrozen,
            uint256 netPoints
        )
    {
        Student storage s = students[nim];
        netPoints = _calculateNetPoints(s.violationPoints, s.rewardPoints);

        return (
            s.name,
            s.violationPoints,
            s.rewardPoints,
            s.isFrozen,
            netPoints
        );
    }

    /**
     * @notice Memeriksa apakah suatu NIM sudah terdaftar dalam sistem.
     * @param nim Nomor Induk Mahasiswa yang akan dicek.
     * @return bool True jika terdaftar, false jika belum.
     */
    function isStudentRegistered(string memory nim) external view returns (bool) {
        return students[nim].isRegistered;
    }

    // =========================================================================
    // INTERNAL HELPER FUNCTIONS
    // =========================================================================

    /**
     * @notice Menghitung net points secara aman, mencegah integer underflow.
     * @dev Karena violationPoints dan rewardPoints adalah uint256, pengurangan
     *      langsung akan revert jika rewardPoints > violationPoints di Solidity 0.8+.
     *      Fungsi ini mengembalikan 0 jika rewardPoints >= violationPoints.
     * @param violationPts Total poin pelanggaran.
     * @param rewardPts    Total poin apresiasi.
     * @return uint256 Net points yang aman (minimum 0).
     */
    function _calculateNetPoints(
        uint256 violationPts,
        uint256 rewardPts
    ) internal pure returns (uint256) {
        if (violationPts >= rewardPts) {
            return violationPts - rewardPts;
        } else {
            return 0;
        }
    }
}
