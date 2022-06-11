import { useContext } from 'react';
import { StatusContext } from '../../App';
import './WalletAccount.css';

const truncate = (input, len) =>
  input.length >= len * 2 + 2 ? `${input.substring(0, len + 2)}...${input.substr(input.length - len)}` : input;

export default function WalletAccount() {
  const { currentAccount } = useContext(StatusContext);
  return <div className='wallet-acc'>{currentAccount ? truncate(currentAccount, 4) : ''}</div>;
}
