import React, { useState } from "react";
import "./NFTPanel.css";

export default function NFTItem(props) {
  const [posX, setPosX] = useState(null);
  const selectNft = () => {
    props.selectNft(props.metadata);
    props.hideNftPanel();
  };

  const hoverNft = () => {
    props.setNftDetail(props.metadata);
  };

  const unhoverNft = () => {
    props.setNftDetail(null);
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
    <div
      className="nft-item"
      onClick={selectNft}
      onMouseOver={hoverNft}
      onMouseOut={unhoverNft}
      onTouchStart={hoverNft}
      onTouchEnd={unhoverNft}
      onTouchCancel={unhoverNft}
      draggable="true"
      onDragStart={dragStartHandler}
      onDrag={dragHandler}
    >
      <img
        className="nft-item-loading"
        src={process.env.PUBLIC_URL + "/img/placehold_nft_loading.png"}
        alt="NFT Loading"
      />
      <img
        className="nft-image"
        src={
          (props.metadata.nft_type === "RPG404" &&
            `https://rpg.mypinata.cloud/ipfs/${props.metadata.image.split("ipfs://")[1]}`) ||
          (props.metadata.nft_type === "Strxngers" &&
            process.env.PUBLIC_URL + "/nft/strxngers_icon/strxngers_logo_404.png")
        }
        alt={props.metadata.name}
      />
    </div>
  );
}
