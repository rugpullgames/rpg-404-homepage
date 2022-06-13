import { useState, useContext, useMemo } from 'react';
import Navbar from './components/Navbar';
import WalletAccount from './components/WalletAccount';
import Status from './components/Status';
import Mint from './components/Mint';
import Game from './components/Game';
import NFTContext from './components/NFTContext';
import './App.css';

//! as Enum
export const PageName = {
  GAME: 'game',
  MINT: 'mint',
};

//! utils
const parseEther = (err) => {
  let msg = 'error';
  if (err && err.message) {
    console.error(err.message);
    const errs = err.message.match(/(?<="message":)".*?"/g);
    if (errs && errs.length > 0 && errs[0] !== '') {
      msg = errs[0];
    }
  }
  return msg;
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
  const [statusMsg, setStatusMsg] = useState('');

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
      parseEther,
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

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Please install MetaMask.');
      return;
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length !== 0) {
        const account = accounts[0];
        updateStatus(`Connected (address: ${account})`);
        setCurrentAccount(account);
      } else {
        updateStatus('No authorized account found');
      }
    } catch (err) {
      const errMsg = parseEther(err);
      updateStatus(errMsg);
    }
  };

  //! reture
  return (
    <NFTContext.Provider value={ctxValue}>
      <div className='App'>
        <Navbar {...{ connectWalletHandler }} />
        {currPage === PageName.GAME && <Game />}
        {currPage === PageName.MINT && <Mint />}
        <WalletAccount />
        <Status statusMsg={statusMsg} />
      </div>
    </NFTContext.Provider>
  );
}

export default App;
