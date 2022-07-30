import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Web3Modal from "web3modal";

const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "RPG 404", // Required
      infuraId: process.env.REACT_APP_WALLETCONNECTION_PROJECT_ID, // Required unless you provide a JSON RPC url; see `rpc` below
    },
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: process.env.REACT_APP_WALLETCONNECTION_PROJECT_ID, // required
    },
  },
};

export const web3Modal = new Web3Modal({
  // cacheProvider: true, // optional
  theme: "dark",
  providerOptions,
});
