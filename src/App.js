import { useState, useContext, useMemo } from 'react';
import Navbar from './components/Navbar';
import WalletAccount from './components/WalletAccount';
import Status from './components/Status';
import Mint from './components/Mint';
import Game from './components/Game';
import NFTContext from './components/NFTContext';
import './App.css';

export const PageName = {
  GAME: 'game',
  MINT: 'mint',
};

function App() {
  //! web3 APIs
  const [currentAccount, setCurrentAccount] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [currPage, setCurrPage] = useState(PageName.GAME);
  const { contractAddress, contractAbi, isRinkeby } = useContext(NFTContext);

  const updateStatus = (msg) => {
    console.log(msg);
    setStatusMsg(`Status: ${msg}`);
  };

  const value = useMemo(
    () => ({ contractAddress, contractAbi, isRinkeby, currentAccount, statusMsg, updateStatus }),
    [contractAbi, contractAddress, currentAccount, isRinkeby, statusMsg]
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
        updateStatus('No authorized account found.');
      }
    } catch (err) {
      updateStatus(err);
    }
  };

  const changePage = (pname) => {
    setCurrPage(pname);
  };

  //! reture
  return (
    <NFTContext.Provider value={value}>
      <div className='App'>
        <Navbar {...{ connectWalletHandler }} />
        {currPage === PageName.GAME && <Game {...{ changePage }} />}
        {currPage === PageName.MINT && <Mint {...{ changePage }} />}
        <WalletAccount />
        <Status statusMsg={statusMsg} />
      </div>
    </NFTContext.Provider>
  );
}

export default App;
