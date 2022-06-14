import React from 'react';
import './NFTPanel.css';

export const NFT = () => {
  return <div className='nft-item'>NFT</div>;
};

export default function NFTPanel() {
  return (
    <div className='nft-panel'>
      NFTPanel
      <NFT />
      <NFT />
      <NFT />
    </div>
  );
}
