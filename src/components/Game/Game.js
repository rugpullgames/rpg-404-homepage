import React, { useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import NFTContext from '../NFTContext';
import NFTPanel from './NFTPanel';
import { PageName } from '../../App';
import './Game.css';

export default function Game() {
  //! web3 APIs
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
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, contractAbi, signer);

        updateStatus('Loading NFTs from blockchain...');

        let nfts = await nftContract.walletOfOwner(currentAccount);

        if (nfts.length > 0) {
          // TODO: show selected switch nft
          updateStatus(`You have ${nfts.length} NFTs`);
          for (const bg of nfts) {
            const nftIdx = bg.toNumber();
            let tokenMetadataURI = await nftContract.tokenURI(nftIdx);

            if (tokenMetadataURI.startsWith('ipfs://')) {
              tokenMetadataURI = `https://ipfs.io/ipfs/${tokenMetadataURI.split('ipfs://')[1]}`;
            }

            console.log(tokenMetadataURI);
            const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json());
            console.log(tokenMetadata);
          }
        } else {
          // TODO: you don't have any RPG404 nfts, please mint or buy on opensea.io
          updateStatus(`You don't have any RPG404 NFTs. Please mint or buy on opensea.io`);
        }
        // for (let i = 0; i < nfts.length; i++) {
        //   const nftIdx = nfts[i].toNumber();
        //   console.log(nftIdx);
        //   const options = { method: 'GET' };

        //   fetch(
        //     `https://${isRinkeby ? 'testnets-api' : 'api'}.opensea.io/api/v1/asset/${contractAddress}/${nftIdx}/`,
        //     options
        //   )
        //     .then((response) => response.json())
        //     .then((response) => console.log(response))
        //     .catch((err) => console.error(err));
        // }
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

  return (
    <div className='game'>
      <img className='game-bg' src={process.env.PUBLIC_URL + '/img/game_bg.png'} alt='Game Background' />
      <img className='game-cover' src={process.env.PUBLIC_URL + '/img/game_cover.png'} alt='Game Cover' />
      <iframe
        className='game-iframe'
        title='RPG 404'
        src={process.env.PUBLIC_URL + '/game/game.html'}
        frameBorder='0'
        scrolling='no'
        crossorigin='anonymous'
      />
      ;
      <img
        className='btn-game-to-mint'
        src={process.env.PUBLIC_URL + '/img/btn_game_to_mint.png'}
        alt='Mint Button'
        onClick={() => setCurrPage(PageName.MINT)}
      />
      <NFTPanel />
    </div>
  );
}
