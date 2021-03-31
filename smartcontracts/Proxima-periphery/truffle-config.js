const HDWalletProvider = require("@truffle/hdwallet-provider");
const { mnemonic, BSCSCANAPIKEY } = require("./env.json");

module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    bscscan: BSCSCANAPIKEY,
  },
  networks: {
    // testnet: {
    //   provider: () =>
    //     new HDWalletProvider(
    //       mnemonic,
    //       `https://data-seed-prebsc-1-s1.binance.org:8545`
    //     ),
    //   network_id: 97,
    //   timeoutBlocks: 200,
    //   confirmations: 5,
    //   //production: true,
    // },
    bsc: {
      provider: () =>
        new HDWalletProvider(mnemonic, `https://bsc-dataseed3.binance.org/`),
      network_id: 56,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      // gas: 20000000,
      // gasPrice: 20000000000,

      skipDryRun: true,
    },
  },
  mocha: {
    timeout: 100000,
  },
  compilers: {
    solc: {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
