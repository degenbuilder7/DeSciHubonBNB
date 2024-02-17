require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("./tasks")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
            details: { yul: false },
          },
        },
      },
    defaultNetwork: "BNB",
    networks: {
        BNB: {
            chainId: 38,
            url: "https://binance.llamarpc.com",
            accounts: [PRIVATE_KEY],
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}
