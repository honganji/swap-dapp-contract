import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    testnet_aurora: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/47ixb3qAlO3ResG5xdPnxFWWVjDrx2Zh",
      accounts: [process.env.AURORA_PRIVATE_KEY!],
      gasPrice: 1000,
    },
  },
};

export default config;
