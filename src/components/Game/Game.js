import React, { useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import NFTContext from '../NFTContext';
import { PageName } from '../../App';
import './Game.css';

export default function Game() {
  //! web3 APIs
  const { currentAccount, contractAddress, contractAbi, updateStatus, setCurrPage } = useContext(NFTContext);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const loadNft = async () => {
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
          updateStatus(contractAddress);
          if (!contractAddress || contractAddress === '') {
            updateStatus('Contract is not available');
            return;
          }
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, contractAbi, signer);

          updateStatus('Load NFTs');
          setIsBusy(true);

          let nfts = await nftContract.walletOfOwner(currentAccount);

          if (nfts.length > 0) {
            // TODO: show selected switch nft
            updateStatus(`You have ${nfts.length} NFTs.`);
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

          setIsBusy(false);
        } else {
          updateStatus('Ethereum object does not exist.');
          setIsBusy(false);
        }
      } catch (err) {
        console.error(err);
        updateStatus(err.message || 'error');
        setIsBusy(false);
      }
    };

    loadNft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount, contractAddress]);

  return (
    <div className='game'>
      <img className='game-bg' src={process.env.PUBLIC_URL + '/img/game_bg.png'} alt='Game Background' />
      <img className='game-cover' src={process.env.PUBLIC_URL + '/img/game_cover.png'} alt='Game Cover' />
      <img
        className='btn-game-to-mint'
        src={process.env.PUBLIC_URL + '/img/btn_game_to_mint.png'}
        alt='Mint Button'
        onClick={() => setCurrPage(PageName.MINT)}
      />
    </div>
  );
}
