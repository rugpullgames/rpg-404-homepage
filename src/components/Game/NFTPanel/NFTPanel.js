import React from 'react';
import './NFTPanel.css';

export const NFT = (props) => {
  return (
    <div className='nft-item'>
      <img className='nft-image' src={`https://ipfs.io/ipfs/${props.image.split('ipfs://')[1]}`} alt={props.name} />
    </div>
  );
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
        {props.metadata.map((mt) => {
          return <NFT {...mt} key={`nft-metadata-${mt.dna}`} />;
        })}
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
