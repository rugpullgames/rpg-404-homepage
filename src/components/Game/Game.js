import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import NFTContext from '../NFTContext';
import NFTPanel from './NFTPanel';
import { PageName } from '../../App';
import './Game.css';

export default function Game() {
  const [metadata, setMetadata] = useState([]);
  const [currMetadata, setCurrMetadata] = useState(null);
  const [showNftPanel, setShowNftPanel] = useState(false);

  //! web3 API in NFTContext
  const {
    currentAccount,
    contractAddress,
    contractAbi,
    parseEther,
    checkAndSwitchNetwork,
    isRinkeby,
    updateStatus,
    setCurrPage,
  } = useContext(NFTContext);

  //! select NFT
  const selectNft = (metadata) => {
    if (metadata) {
      setCurrMetadata(metadata);
      updateStatus(`Selected NFT: ${currMetadata.name}`);
    }
  };

  //! open NFT panel
  const openNftPanel = () => {
    if (currentAccount) {
      if (metadata.length > 0) {
        setShowNftPanel(true);
      } else {
        updateStatus('No NFT loaded');
      }
    } else {
      updateStatus('Please connect wallet first');
    }
  };

  //! load NFTs
  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) {
      return;
    }

    const loadNft = async () => {
      const { ethereum } = window;
      if (!ethereum) {
        updateStatus('Please install MetaMask.');
        return;
      }
      try {
        //* check network
        await checkAndSwitchNetwork(isRinkeby, updateStatus);

        if (currentAccount === null) {
          updateStatus('Please connect wallet first');
          return;
        }

        updateStatus(contractAddress);
        if (!contractAddress || contractAddress === '') {
          updateStatus('Contract is not available');
          return;
        }

        // clean metadata
        setCurrMetadata(null);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractAbi, signer);

        updateStatus('Loading NFTs from blockchain...');

        let nfts = await nftContract.walletOfOwner(currentAccount);

        const meta = [];
        if (nfts.length > 0) {
          //* show selected switch nft
          updateStatus(`You have ${nfts.length} NFTs`);
          for (const bg of nfts) {
            const nftIdx = bg.toNumber();
            let tokenMetadataURI = await nftContract.tokenURI(nftIdx);

            if (tokenMetadataURI.startsWith('ipfs://')) {
              tokenMetadataURI = `https://ipfs.io/ipfs/${tokenMetadataURI.split('ipfs://')[1]}`;
            }

            // console.log(tokenMetadataURI);
            const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json());
            // console.log(tokenMetadata);
            meta.push(tokenMetadata);
          }
          setMetadata([...meta]);
        } else {
          //* you don't have any RPG404 nfts, please mint or buy on opensea.io
          updateStatus(`You don't have any RPG404 NFTs. Please mint or buy on opensea.io`);
        }
      } catch (err) {
        const errMsg = parseEther(err);
        updateStatus(errMsg);
      }
    };

    loadNft();
    ethereum.on('accountsChanged', loadNft);
    return () => {
      ethereum?.removeListener('accountsChanged', loadNft);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  //! cover or iframe
  let gameFrame;
  if (currMetadata) {
    gameFrame = (
      <iframe
        className='game-iframe'
        title='RPG 404'
        src={process.env.PUBLIC_URL + '/game/game.html'}
        frameBorder='0'
        scrolling='no'
        crossOrigin='anonymous'
      />
    );
  } else {
    gameFrame = (
      <div className='game-cover'>
        <img className='game-cover-img' src={process.env.PUBLIC_URL + '/img/game_cover.png'} alt='Game Cover' />;
        {!showNftPanel && (
          <img
            className='btn-game-play'
            src={process.env.PUBLIC_URL + '/img/btn_game_play.png'}
            alt='Play Game Button'
          />
        )}
        {!showNftPanel && (
          <img
            className='btn-select-nft'
            src={process.env.PUBLIC_URL + '/img/btn_game_select_nft.png'}
            alt='Select NFT Button'
            onClick={openNftPanel}
          />
        )}
      </div>
    );
  }

  return (
    <div className='game'>
      <img className='game-bg' src={process.env.PUBLIC_URL + '/img/game_bg.png'} alt='Game Background' />
      {gameFrame}
      <img
        className='btn-game-to-mint'
        src={process.env.PUBLIC_URL + '/img/btn_game_to_mint.png'}
        alt='Mint Button'
        onClick={() => setCurrPage(PageName.MINT)}
      />
      {showNftPanel && (
        <NFTPanel metadata={metadata} selectNft={selectNft} hideNftPanel={() => setShowNftPanel(false)} />
      )}
    </div>
  );
}
