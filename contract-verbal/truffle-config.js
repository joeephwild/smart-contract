require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { MNEMONIC, INFURA_RPC, ETHERSCAN_API_KEY } = process.env;
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
      verify: {
        apiUrl: "https://api-testnet.lineascan.build/api",
        apiKey: ETHERSCAN_API_KEY,
        explorerUrl: "https://goerli.lineascan.build/address",
      },
      network_id: "59140",
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
    },
  },
  plugins: ["truffle-plugin-verify"],
};
