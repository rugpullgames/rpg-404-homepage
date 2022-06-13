import { createContext } from 'react';
export const StatusContext = createContext({
  currentAccount: null,
  statusMsg: '',
  updateStatus: () => {},
});
