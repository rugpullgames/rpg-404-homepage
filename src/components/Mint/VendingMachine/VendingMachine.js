import React, { useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import NFTContext from '../../NFTContext';
import { PageName } from '../../../App';
import './VendingMachine.css';

export default function VendingMachine() {
  //! is busy
  const [isBusy, setIsBusy] = useState(false);

  //! quantity
  const MIN_QUALITY = 1;
  const [quantity, setQuantity] = useState(MIN_QUALITY);

  //! web3 APIs
  const {
    //! read only
    contractAddress,
    contractAbi,
    openseaColletionName,
    isRinkeby,
    //! utils
    parseEther,
    //! load from contract
    price,
    setPrice,
    maxSupply,
    setMaxSupply,
    maxFreeSupply,
    setMaxFreeSupply,
    totalSupply,
    setTotalSupply,
    maxPerTxDuringMint,
    setMaxPerTxDuringMint,
    maxPerAddressDuringFreeMint,
    setMaxPerAddressDuringFreeMint,
    //! current page
    setCurrPage,
    //! wallet
    currentAccount,
    //! status
    updateStatus,
  } = useContext(NFTContext);

  useEffect(() => {
    const loadMintInfo = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          if (currentAccount === null) {
            updateStatus('Please connect wallet first');
            return;
          }
          updateStatus(contractAddress);
          if (!contractAddress || contractAddress === '') {
            updateStatus('Contract is not available');
            return;
          }
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, contractAbi, signer);

          updateStatus('Loading mint contract info...');

          let maxSupplyNum = await nftContract.maxSupply();
          setMaxSupply(maxSupplyNum.toNumber());
          let maxFreeSupplyNum = await nftContract.maxFreeSupply();
          setMaxFreeSupply(maxFreeSupplyNum.toNumber());
          let totalSupplyNum = await nftContract.totalSupply();
          setTotalSupply(totalSupplyNum.toNumber());
          let maxPerTxDuringMintNum = await nftContract.maxPerTxDuringMint();
          setMaxPerTxDuringMint(maxPerTxDuringMintNum.toNumber());
          let maxPerAddressDuringFreeMintNum = await nftContract.maxPerAddressDuringFreeMint();
          setMaxPerAddressDuringFreeMint(maxPerAddressDuringFreeMintNum.toNumber());

          //* mint price
          if (totalSupply < maxFreeSupply) {
            //* free mint
            setPrice(0);
          } else {
            //* public sales
            let priceWei = await nftContract.cost();
            setPrice(ethers.utils.formatEther(priceWei));
          }

          updateStatus('Mint contract info loaded');
        } else {
          updateStatus('Ethereum object does not exist');
        }
      } catch (err) {
        const errMsg = parseEther(err);
        updateStatus(errMsg);
      }
    };

    loadMintInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  //! mint quantity
  const add = () => {
    updateMintQuantity(quantity + 1);
  };

  const sub = () => {
    updateMintQuantity(quantity - 1);
  };

  const updateMintQuantity = (quan) => {
    if (quan) {
      if (totalSupply < maxFreeSupply) {
        //* free mint
        quan = Math.min(maxPerAddressDuringFreeMint, Math.max(MIN_QUALITY, quan));
      } else {
        //* public sales
        quan = Math.min(maxPerTxDuringMint, Math.max(MIN_QUALITY, quan));
      }
      setQuantity(quan);
    }
  };

  //! total supply
  useEffect(() => {
    const updateTotalSupply = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          if (currentAccount === null) {
            return;
          }
          if (!contractAddress || contractAddress === '') {
            return;
          }
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, contractAbi, signer);

          let totalSupplyNum = await nftContract.totalSupply();
          setTotalSupply(totalSupplyNum.toNumber());

          //* mint price
          if (totalSupply < maxFreeSupply) {
            setPrice(0);
          } else {
            let priceWei = await nftContract.cost();
            setPrice(ethers.utils.formatEther(priceWei));
          }
        } else {
          updateStatus('Ethereum object does not exist.');
        }
      } catch (err) {
        const errMsg = parseEther(err);
        updateStatus(errMsg);
      }
    };

    const timerId = setInterval(() => {
      updateTotalSupply();
    }, 500);

    return () => clearInterval(timerId);
  });

  //! mint NFTs
  const mintNftHandler = async () => {
    if (totalSupply >= maxSupply) {
      alert(
        `Thank you for your interest. \nGohan-kun is sold out. \nPlease check https://opensea.io/collection/gohan-kun.`
      );
      window.open(`https://${isRinkeby ? 'testnets.' : ''}opensea.io/collection/${openseaColletionName}`);
      return;
    }

    try {
      const { ethereum } = window;

      if (ethereum) {
        if (currentAccount === null) {
          updateStatus('Please connect wallet first');
          return;
        }
        if (isBusy) {
          updateStatus('Busy... please wait');
          return;
        }
        if (!contractAddress || contractAddress === '') {
          updateStatus('Contract is not available');
          return;
        }
        if (price < -1) {
          updateStatus('Load contract info first');
          return;
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractAbi, signer);

        updateStatus('Initialize mint');
        setIsBusy(true);

        let nftTxn;
        if (totalSupply < maxFreeSupply) {
          //* free mint
          nftTxn = await nftContract.freeMint(quantity);
        } else {
          //* public sales
          nftTxn = await nftContract.mint(quantity, {
            value: ethers.utils.parseEther((0.0078 * quantity).toString()),
          });
        }

        updateStatus(`Mint (price: ${price}, quantity: ${quantity})... please wait`);

        await nftTxn.wait();

        updateStatus(`Mined, see transction: https://${isRinkeby ? 'rinkeby.' : ''}etherscan.io/tx/${nftTxn.hash}`);
        setIsBusy(false);
      } else {
        updateStatus('Ethereum object does not exist');
        setIsBusy(false);
      }
    } catch (err) {
      const errMsg = parseEther(err);
      updateStatus(errMsg);
      setIsBusy(false);
    }
  };

  //! mint or buy
  let mintOrBuy;
  if (totalSupply !== -1 && totalSupply < maxSupply) {
    //* mint directly
    mintOrBuy = (
      <div className='vending-mint'>
        <img
          className='vending-btn-add'
          src={process.env.PUBLIC_URL + '/img/btn_mint_add.png'}
          alt='Button of Increasing Mint Quantity'
          onClick={add}
        />
        <img
          className='vending-btn-sub'
          src={process.env.PUBLIC_URL + '/img/btn_mint_sub.png'}
          alt='Button of Decreasing Mint Quantity'
          onClick={sub}
        />
        <img
          className='vending-bg-input-frame'
          src={process.env.PUBLIC_URL + '/img/bg_mint_input_frame.png'}
          alt='Mint Quantity Input Frame'
        />
        <img
          className='vending-btn-mint'
          src={process.env.PUBLIC_URL + '/img/btn_mint.png'}
          alt='Mint Quantity Input Frame'
          onClick={mintNftHandler}
        />
        <div className='vending-price'>{price > 0 ? `Price: ${price} eth` : price === 0 ? 'Price: Free' : ''}</div>
        <div className='vending-supply'>{price > -1 ? `Mint#: ${totalSupply} / ${maxSupply}` : ''}</div>
        <div className='vending-quantity'>{quantity}</div>
      </div>
    );
  } else {
    //* buy on opensea
    mintOrBuy = (
      <img
        className='vending-btn-opensea'
        src={process.env.PUBLIC_URL + '/img/btn_mint_opensea.png'}
        alt='Buy NFTs on Opensea'
        onClick={() => {
          window.open(`https://${isRinkeby ? 'testnets.' : ''}opensea.io/collection/${openseaColletionName}`);
        }}
      />
    );
  }

  return (
    <div className='vending-machine'>
      <img
        className='vending-bg'
        src={process.env.PUBLIC_URL + '/img/bg_vending_machine.png'}
        alt='Vending Machine Background'
      />
      <img
        className='vending-btn-to-game'
        src={process.env.PUBLIC_URL + '/img/btn_mint_to_game.png'}
        alt='Button of Vending Machine to Game'
        onClick={() => setCurrPage(PageName.GAME)}
      />
      {mintOrBuy}
    </div>
  );
}
