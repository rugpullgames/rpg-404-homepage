import React, { useState, useRef } from 'react';
import './NFTPanel.css';

export const NFT = (props) => {
  const [posX, setPosX] = useState(null);
  const selectNft = () => {
    props.selectNft(props.metadata);
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
    <div className='nft-item'>
      <img
        className='nft-image'
        src={`https://ipfs.io/ipfs/${props.metadata.image.split('ipfs://')[1]}`}
        alt={props.metadata.name}
        onClick={selectNft}
        draggable='true'
        onDragStart={dragStartHandler}
        onDrag={dragHandler}
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
            scrollPanel,
          };
          return <NFT {...attr} key={`nft-metadata-${mt.dna}`} />;
        })}
      </div>
    </div>
  );
}
