import { createContext } from "react";
import contractRpg404 from "../../contracts/RPG404.json";

export const NFTContext = createContext({
  //! read only
  contractAddressRpg404: "0xc21dCcA393Fe26D585db6598533b655816A87543",
  contractAbiRpg404: contractRpg404.abi,
  openseaColletionName: "rpg-404",
  isTestnet: false,
  //! utils, read only
  parseEtherError: () => {},
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
  provider: null,
  library: null,
  chainId: null,
  account: null,
  checkAndSwitchNetwork: () => {},
  //! status
  statusMsg: "",
  updateStatus: () => {},
});
