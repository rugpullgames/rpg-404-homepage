import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import Navbar from "./components/Navbar";
import WalletAccount from "./components/WalletAccount";
import Status from "./components/Status";
import Mint from "./components/Mint";
import Game from "./components/Game";
import NFTContext from "./components/NFTContext";
import "./App.css";

//! as Enum
export const PageName = {
  GAME: "game",
  MINT: "mint",
};

//! utils

// Get Browser Version
const browserVersion = () => {
  var ua = navigator.userAgent;
  var tem;
  var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return "IE " + (tem[1] || "");
  }
  if (M[1] === "Chrome") {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) return tem.slice(1).join(" ").replace("OPR", "Opera");
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(" ");
};

const checkRegexLookbehind = () => {
  const browserInfo = browserVersion().split("");
  if (browserInfo.length >= 2) {
    console.log(browserVersion());
    const name = browserInfo[0].toLowerCase();
    const version = parseFloat(browserInfo[1] || "0");
    // ref: https://caniuse.com/js-regexp-lookbehind
    if (
      (name === "chrome" && version >= 103) ||
      (name === "edge" && version >= 79) ||
      (name === "firefox" && version >= 64) ||
      (name === "opera" && version >= 49)
    ) {
      return true;
    }
  }

  return false;
};

// parse error from MetaMask
const parseEtherError = (err) => {
  let msg = "error";
  if (err && err.message) {
    // console.error(err.message);
    if (checkRegexLookbehind()) {
      const errs = err.message.match(/(?<="message":)".*?"/g);
      if (errs && errs.length > 0 && errs[0] !== "") {
        msg = errs[0];
      } else {
        msg = err.message;
      }
    } else {
      msg = err.message;
    }
  }
  return msg;
};

// check network
const checkAndSwitchNetwork = async (rinkeby, funcLog) => {
  const { ethereum } = window;
  if (!ethereum) {
    throw new Error("Please install MetaMask.");
  }
  const network = await ethereum.networkVersion;
  if (rinkeby && network !== "4") {
    //* testnet rinkeby
    funcLog(`Please change network to Rinkeby`);
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${Number(4).toString(16)}` }],
    });
  }
  if (!rinkeby && network !== "1") {
    //* main network
    funcLog(`Please change network to ethereum Mainnet`);
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${Number(1).toString(16)}` }],
    });
  }
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
  const [currentAccount, setCurrentAccount] = useState(null);
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
      currentAccount,
      //! status
      statusMsg,
      updateStatus,
    }),
    [
      contractAbi,
      contractAddress,
      currPage,
      currentAccount,
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

  const connectWalletHandler = useCallback(async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    try {
      //* check network
      await checkAndSwitchNetwork(isRinkeby, updateStatus);

      //* accouts
      if (currentAccount) {
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        updateStatus(`Connected (address: ${account})`);
      } else {
        updateStatus("No authorized account found");
      }
    } catch (err) {
      const errMsg = parseEtherError(err);
      updateStatus(errMsg);
    }
  }, [currentAccount, isRinkeby]);

  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) {
      return;
    }
    const handleAccountChange = (...args) => {
      const accounts = args[0];
      if (accounts.length === 0) {
        updateStatus("No authorized account found");
      } else if (accounts[0] !== currentAccount) {
        const account = accounts[0];
        setCurrentAccount(account);
        updateStatus(`Connected (address: ${account})`);
      }
    };
    ethereum.on("accountsChanged", handleAccountChange);
    return () => {
      ethereum?.removeListener("accountsChanged", handleAccountChange);
    };
  });

  useEffect(() => {
    const connectWallet = () => {
      connectWalletHandler();
    };
    connectWallet();
  }, [connectWalletHandler]);

  //! reture
  return (
    <NFTContext.Provider value={ctxValue}>
      <div className='App'>
        <Navbar {...{ connectWalletHandler }} />
        {currPage === PageName.GAME && <Game {...{ connectWalletHandler }} />}
        {currPage === PageName.MINT && <Mint {...{ connectWalletHandler }} />}
        <WalletAccount />
        <Status statusMsg={statusMsg} />
      </div>
    </NFTContext.Provider>
  );
}

export default App;
