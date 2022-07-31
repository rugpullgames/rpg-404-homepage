// To Hex Address
export const toHex = (num) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

// check network
export const checkAndSwitchNetwork = async (testnet, funcLog) => {
  const { ethereum } = window;
  if (!ethereum) {
    throw new Error("Please install MetaMask.");
  }
  const network = await ethereum.networkVersion;
  if (testnet && network !== "4") {
    //* testnet testnet
    funcLog(`Please change network to testnet`);
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHex(4) }],
    });
  }
  if (!testnet && network !== "1") {
    //* main network
    funcLog(`Please change network to ethereum Mainnet`);
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHex(1) }],
    });
  }
};

// parse error from MetaMask
export const parseEtherError = (err) => {
  let msg = "error";
  if (err && err.message) {
    console.error(err.message);
    const errs = err.message.match(/(?:"message":)".*?"/g);
    if (errs && errs.length > 0 && errs[0] !== "") {
      msg = errs[0].replace(`"message":`, "");
    } else {
      msg = err.message;
    }
  }
  return msg;
};

export const truncateAddress = (address) => {
  if (!address) return "No Account";
  const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
