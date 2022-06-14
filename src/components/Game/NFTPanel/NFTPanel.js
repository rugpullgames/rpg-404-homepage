import React from 'react';
import './NFTPanel.css';

export const NFT = () => {
  return <div className='nft-item'>NFT</div>;
};

export default function NFTPanel(props) {
  console.log(props.metadata);

  const onScroll = (e) => {
    if (e.deltaY > 0) {
      e.currentTarget.scrollLeft += 30;
    }
    if (e.deltaY < 0) {
      e.currentTarget.scrollLeft -= 30;
    }
  };

  return (
    <div className='nft-panel'>
      <div className='nft-container' onWheel={onScroll}>
        <NFT />
        <NFT />
        <NFT />
        <NFT />
        <NFT />
        <NFT />
      </div>
    </div>
  );
}

// .container {

// }
// .item {
//   padding: 10px;
//   border: 1px solid red;
//   display: inline-block;
//   vertical-align:top;
//   margin-right:20px;
//   white-space:normal;
// }
