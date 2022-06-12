import { useState, createContext, useMemo } from 'react';
import Navbar from './components/Navbar';
import WalletAccount from './components/WalletAccount';
import Status from './components/Status';
import Mint from './components/Mint';
import Game from './components/Game';
import './App.css';

export const StatusContext = createContext({
  currentAccount: null,
  statusMsg: '',
  updateStatus: () => {},
});

export const PageName = {
  GAME: 'game',
  MINT: 'mint',
};

function App() {
  //! web3 APIs
  const [currentAccount, setCurrentAccount] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [currPage, setCurrPage] = useState(PageName.GAME);

  const updateStatus = (msg) => {
    console.log(msg);
    setStatusMsg(`Status: ${msg}`);
  };

  const value = useMemo(() => ({ currentAccount, statusMsg, updateStatus }), [currentAccount, statusMsg]);

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
    <StatusContext.Provider value={value}>
      <div className='App'>
        <Navbar {...{connectWalletHandler}} />
        {currPage === PageName.GAME && <Game {...{changePage}} />}
        {currPage === PageName.MINT && <Mint {...{changePage}} />}
        <WalletAccount />
        <Status statusMsg={statusMsg} />
      </div>
    </StatusContext.Provider>
  );
}

export default App;
