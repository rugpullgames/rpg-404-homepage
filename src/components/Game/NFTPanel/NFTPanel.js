import React, { useState, useRef } from 'react';
import './NFTPanel.css';

export const NFT = (props) => {
  const [posX, setPosX] = useState(null);
  const selectNft = () => {
    props.selectNft(props.metadata);
    props.hideNftPanel();
  };

  const dragStartHandler = (e) => {
    setPosX(e.clientX);
    e.dataTransfer.setDragImage(e.target, window.outerWidth, window.outerHeight);
  };

  const dragHandler = (e) => {
    if (e.clientX > 0) {
      props.scrollPanel(posX - e.clientX);
      setPosX(e.clientX);
    }
    e.dataTransfer.setDragImage(e.target, window.outerWidth, window.outerHeight);
  };

  return (
    <div className='nft-item' onClick={selectNft} draggable='true' onDragStart={dragStartHandler} onDrag={dragHandler}>
      <img
        className='nft-item-loading'
        src={process.env.PUBLIC_URL + '/img/placehold_nft_loading.png'}
        alt='NFT Loading'
      />
      <img
        className='nft-image'
        src={`https://rpg.mypinata.cloud/ipfs/${props.metadata.image.split('ipfs://')[1]}`}
        alt={props.metadata.name}
      />
    </div>
  );
};

export default function NFTPanel(props) {
  const container = useRef();
  const onScrollHandler = (e) => {
    if (e.deltaY > 0) {
      scrollPanel(30);
    }
    if (e.deltaY < 0) {
      scrollPanel(-30);
    }
  };

  const scrollPanel = (deltaX) => {
    container.current.scrollLeft += deltaX;
  };

  return (
    <div className='nft-panel'>
      <div className='nft-container' ref={container} onWheel={onScrollHandler}>
        {props.metadata.map((mt) => {
          const attr = {
            metadata: mt,
            selectNft: props.selectNft,
            hideNftPanel: props.hideNftPanel,
            scrollPanel,
          };
          return <NFT {...attr} key={`nft-metadata-${mt.dna}`} />;
        })}
      </div>
    </div>
  );
}
