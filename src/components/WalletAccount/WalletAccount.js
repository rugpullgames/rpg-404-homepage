import { useContext } from 'react';
import NFTContext from '../NFTContext';
import './WalletAccount.css';

const truncate = (input, len) =>
  input.length >= len * 2 + 2 ? `${input.substring(0, len + 2)}...${input.substr(input.length - len)}` : input;

export default function WalletAccount() {
  const { account } = useContext(NFTContext);
  return <div className='wallet-acc'>{account ? truncate(account, 4) : ''}</div>;
}
