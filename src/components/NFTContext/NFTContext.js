import { createContext } from 'react';

export const NFTContext = createContext({
  currentAccount: null,
  statusMsg: '',
  updateStatus: () => {},
});
