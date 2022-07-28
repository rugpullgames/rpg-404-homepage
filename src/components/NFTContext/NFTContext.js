import { createContext } from "react";
import contract from "../../contracts/RPG404.json";

export const NFTContext = createContext({
  //! read only
  contractAddress: "0xc21dCcA393Fe26D585db6598533b655816A87543",
  contractAbi: contract.abi,
  openseaColletionName: "rpg-404",
  isRinkeby: false,
  //! utils, read only
  parseEtherError: () => {},
  checkAndSwitchNetwork: () => {},
  //! load from contract
  price: -1,
  setPrice: () => {},
  maxSupply: -1,
  setMaxSupply: () => {},
  maxFreeSupply: -1,
  setMaxFreeSupply: () => {},
  totalSupply: -1,
  setTotalSupply: () => {},
  maxPerTxDuringMint: -1,
  setMaxPerTxDuringMint: () => {},
  maxPerAddressDuringFreeMint: -1,
  setMaxPerAddressDuringFreeMint: () => {},
  //! current page
  currPage: null,
  setCurrPage: () => {},
  //! wallet
  currentAccount: null,
  //! status
  statusMsg: "",
  updateStatus: () => {},
});
