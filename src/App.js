import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import WalletAccount from "./components/WalletAccount";
import Status from "./components/Status";
import Mint from "./components/Mint";
import Game from "./components/Game";
import NFTContext from "./components/NFTContext";
import { toHex, parseEtherError, checkAndSwitchNetwork } from "./utils/utils";
import { web3Modal } from "./web3/web3provider";
import { networkConfig } from "./web3/networks";
import "./App.css";

//! as Enum
export const PageName = {
  GAME: "game",
  MINT: "mint",
};

function App() {
  //! read only
  const { contractAddress, contractAbi, openseaColletionName, isRinkeby } = useContext(NFTContext);
  //! load from contract
  const [price, setPrice] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxFreeSupply, setMaxFreeSupply] = useState(0);
  const [maxPerTxDuringMint, setMaxPerTxDuringMint] = useState(0);
  const [maxPerAddressDuringFreeMint, setMaxPerAddressDuringFreeMint] = useState(0);

  //! page
  const [currPage, setCurrPage] = useState(PageName.GAME);
  //! wallet
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();
  const [account, setAccount] = useState();
  //! status
  const [statusMsg, setStatusMsg] = useState("");

  const updateStatus = (msg) => {
    console.log(msg);
    setStatusMsg(`Status: ${msg}`);
  };

  const ctxValue = useMemo(
    () => ({
      //! read only
      contractAddress,
      contractAbi,
      openseaColletionName,
      isRinkeby,
      //! utils
      parseEtherError,
      checkAndSwitchNetwork,
      //! load from contract
      price,
      setPrice,
      maxSupply,
      setMaxSupply,
      maxFreeSupply,
      setMaxFreeSupply,
      totalSupply,
      setTotalSupply,
      maxPerTxDuringMint,
      setMaxPerTxDuringMint,
      maxPerAddressDuringFreeMint,
      setMaxPerAddressDuringFreeMint,
      //! current page
      currPage,
      setCurrPage,
      //! wallet
      account,
      //! status
      statusMsg,
      updateStatus,
    }),
    [
      contractAbi,
      contractAddress,
      currPage,
      account,
      isRinkeby,
      maxFreeSupply,
      maxPerAddressDuringFreeMint,
      maxPerTxDuringMint,
      maxSupply,
      openseaColletionName,
      price,
      statusMsg,
      totalSupply,
    ]
  );

  const connectWallet = useCallback(async () => {
    try {
      const provider = await web3Modal.connect();
      console.log(provider);
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
      await web3Modal.toggleModal();
    } catch (err) {
      updateStatus(err);
    }
  }, []);

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkConfig[toHex(network)]],
          });
        } catch (err) {
          updateStatus(err);
        }
      }
    }
  };

  const refreshState = () => {
    setAccount();
    setChainId();
    setNetwork("");
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) {
      return;
    }
    const handleAccountChange = (...args) => {
      const accounts = args[0];
      if (accounts.length === 0) {
        updateStatus("No authorized account found");
      } else if (accounts[0] !== account) {
        const account = accounts[0];
        setAccount(account);
        updateStatus(`Connected (address: ${account})`);
      }
    };
    ethereum.on("accountsChanged", handleAccountChange);
    return () => {
      ethereum?.removeListener("accountsChanged", handleAccountChange);
    };
  });

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId) => {
        setChainId(_hexChainId);
      };

      const handleDisconnect = (err) => {
        console.log("disconnect", err);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  useEffect(() => {
    const connectWallet = () => {
      // connectWallet();
    };
    connectWallet();
  }, [connectWallet]);

  //! reture
  return (
    <NFTContext.Provider value={ctxValue}>
      <div className='App'>
        <Navbar {...{ connectWallet }} />
        {currPage === PageName.GAME && <Game {...{ connectWallet }} />}
        {currPage === PageName.MINT && <Mint {...{ connectWallet }} />}
        <WalletAccount />
        <Status statusMsg={statusMsg} />
      </div>
    </NFTContext.Provider>
  );
}

export default App;
