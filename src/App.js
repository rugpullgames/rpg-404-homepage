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

function App() {
  //! web3 APIs
  const [currentAccount, setCurrentAccount] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

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

  //! reture
  return (
    <StatusContext.Provider value={value}>
      <div className='App'>
        <Mint />
        <Game />
        <Navbar connectWalletHandler={connectWalletHandler} />
        <WalletAccount />
        <Status statusMsg={statusMsg} />
      </div>
    </StatusContext.Provider>
  );
}

export default App;
