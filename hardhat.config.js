require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require("dotenv").config();

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
  abiExporter: {
    path: './my-app/src/constants',
    flat: true,
    format: "json",
  }
};
