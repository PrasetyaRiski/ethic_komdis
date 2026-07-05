import "@nomicfoundation/hardhat-toolbox";

export default {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      // Hardhat default chainId (31337) matches MetaMask's built‑in Hardhat network.
      // Using the default avoids conflicts when adding the network to MetaMask.
      chainId: 31337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};