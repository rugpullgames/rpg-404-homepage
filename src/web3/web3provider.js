/// @copyright Rug Pull Games, Project: RPG 404
/// @see Rug Pull Games: https://rug-pull.games/
/// @see RPG 404: http://rpg404.com/
/// @author endaye

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
  projectId: "RPG 404",
  theme: "dark",
  accentColor: "orange",
  providerOptions,
  disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
});
