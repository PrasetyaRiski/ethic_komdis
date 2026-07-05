/**
 * @file deploy.cjs
 * @description Script deployment untuk kontrak EthicsKomdis menggunakan Hardhat.
 *              Kompatibel dengan Ethers.js v5 dan v6.
 *
 * Cara menjalankan:
 *   npx hardhat run scripts/deploy.cjs --network localhost
 *
 * Pastikan node Hardhat sudah berjalan terlebih dahulu:
 *   npx hardhat node
 */

const { ethers } = require("hardhat");

async function main() {
  console.log("=".repeat(60));
  console.log("  DEPLOYING: EthicsKomdis Smart Contract");
  console.log("  Sistem Pencatatan Etika Mahasiswa — Komdis DApp");
  console.log("=".repeat(60));

  // Mendapatkan daftar akun yang tersedia dari provider
  const signers = await ethers.getSigners();
  const deployer = signers[0];

  // Kompatibilitas Ethers v5 (deployer.address) dan v6 (await deployer.getAddress())
  const deployerAddress =
    typeof deployer.getAddress === "function"
      ? await deployer.getAddress()
      : deployer.address;

  console.log("\n[1/3] Deployer Address (Admin Komdis):");
  console.log(`      ${deployerAddress}`);

  // Mendapatkan balance deployer
  let balanceFormatted;
  try {
    const balance = await ethers.provider.getBalance(deployerAddress);
    balanceFormatted = ethers.formatEther
      ? ethers.formatEther(balance)
      : ethers.utils.formatEther(balance);
  } catch (e) {
    balanceFormatted = "N/A";
  }
  console.log(`      Balance: ${balanceFormatted} ETH`);

  console.log("\n[2/3] Compiling & Deploying EthicsKomdis...");

  const EthicsKomdis = await ethers.getContractFactory("EthicsKomdis");
  const ethicsKomdis = await EthicsKomdis.deploy();

  if (typeof ethicsKomdis.waitForDeployment === "function") {
    await ethicsKomdis.waitForDeployment();
  } else {
    await ethicsKomdis.deployed();
  }

  const contractAddress =
    typeof ethicsKomdis.getAddress === "function"
      ? await ethicsKomdis.getAddress()
      : ethicsKomdis.address;

  console.log("\n[3/3] Deployment Successful!");
  console.log("=".repeat(60));
  console.log(`  CONTRACT ADDRESS  : ${contractAddress}`);
  console.log(`  ADMIN KOMDIS      : ${deployerAddress}`);
  console.log(`  THRESHOLD_LOCK    : 100 poin`);
  console.log(`  NETWORK           : ${(await ethers.provider.getNetwork()).name || "localhost"}`);
  console.log("=".repeat(60));
  console.log("\n[NEXT STEP] Salin Contract Address di atas ke:");
  console.log("  → konektor/ethicConnector.js (konstanta CONTRACT_ADDRESS)");
  console.log("  → antarmuka/src/App.jsx (konstanta CONTRACT_ADDRESS)");
  console.log("\n[INFO] Contract telah di-deploy ke jaringan lokal Hardhat.");
  console.log("       Pastikan MetaMask terhubung ke RPC: http://127.0.0.1:8545\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n[ERROR] Deployment gagal:");
    console.error(error);
    process.exit(1);
  });
