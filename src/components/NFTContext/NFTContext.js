import { createContext } from 'react';
import contract from '../../contracts/RPG404.json';

export const NFTContext = createContext({
  contractAddress: '0x5887e5C10f0dd72aA592713e7112aab5D47C5e4C',
  contractAbi: contract.abi,
  isRinkeby: true,
  currentAccount: null,
  statusMsg: '',
  updateStatus: () => {},
});
