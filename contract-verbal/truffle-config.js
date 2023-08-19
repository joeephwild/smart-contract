require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { MNEMONIC, INFURA_RPC } = process.env;
const privateKeys = [MNEMONIC];

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
    },
    linea: {
      provider: () => new HDWalletProvider(privateKeys, INFURA_RPC),
      network_id: "59140",
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
    },
  },
};
