import React, { useState } from "react";
import "./NFTPanel.css";

export default function NFTItem(props) {
  const [posX, setPosX] = useState(null);
  const selectNft = () => {
    props.selectNft(props.metadata);
    props.hideNftPanel();
  };

  const dragStartHandler = (e) => {
    setPosX(e.clientX);
    e.dataTransfer.setDragImage(e.target, 100000, 0);
  };

  const dragHandler = (e) => {
    if (e.clientX > 0) {
      props.scrollPanel(posX - e.clientX);
      setPosX(e.clientX);
    }
    e.dataTransfer.setDragImage(e.target, 100000, 0);
  };

  return (
    <div className="nft-item" onClick={selectNft} draggable="true" onDragStart={dragStartHandler} onDrag={dragHandler}>
      <img
        className="nft-item-loading"
        src={process.env.PUBLIC_URL + "/img/placehold_nft_loading.png"}
        alt="NFT Loading"
      />
      <img
        className="nft-image"
        src={`https://rpg.mypinata.cloud/ipfs/${props.metadata.image.split("ipfs://")[1]}`}
        alt={props.metadata.name}
      />
    </div>
  );
}
