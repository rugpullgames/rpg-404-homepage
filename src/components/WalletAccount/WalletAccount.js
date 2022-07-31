import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTContext from "../NFTContext";
import "./WalletAccount.css";

const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.REACT_APP_WALLETCONNECTION_PROJECT_ID}`
);

const truncate = (input, len) =>
  input.length >= len * 2 + 2 ? `${input.substring(0, len + 2)}...${input.substr(input.length - len)}` : input;

// https://codesandbox.io/s/react-ens-resolver-r76qox?file=/src/App.js
const useENS = () => {
  const [names, setNames] = useState({});

  const getName = async (addr) => {
    if (names[addr]) return names[addr];

    console.log("fetching address.. ");
    let resolvedName = provider.lookupAddress(addr);
    setNames((prev) => ({ ...prev, [addr]: resolvedName ?? addr }));
    return resolvedName ?? addr;
  };

  return {
    names,
    getName,
  };
};

export default function WalletAccount() {
  const { account } = useContext(NFTContext);
  const { getName } = useENS();

  const [name, setName] = useState("");

  useEffect(() => {
    const showAccount = async () => {
      if (account) {
        setName(truncate(account, 4));
        const nameOrAddress = await getName(account);
        console.log(nameOrAddress);
        if (nameOrAddress && nameOrAddress.length === 42 && nameOrAddress.startsWith("0x")) {
          setName(truncate(account, 4));
        } else {
          setName(nameOrAddress);
        }
      } else {
        setName("");
      }
    };

    showAccount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return <div className='wallet-acc'>{name}</div>;
}
