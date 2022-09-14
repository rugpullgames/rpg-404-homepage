import React, { useRef } from "react";
import NFTItem from "./NFTItem";
import "./NFTPanel.css";

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
    <div className="nft-panel">
      <div className="nft-container" ref={container} onWheel={onScrollHandler}>
        {props.metadata.map((mt) => {
          const attr = {
            metadata: mt,
            selectNft: props.selectNft,
            hideNftPanel: props.hideNftPanel,
            setNftDetail: props.setNftDetail,
            scrollPanel,
          };
          return <NFTItem {...attr} key={`nft-metadata-${mt.dna + Math.floor(Math.random() * 9999999)}`} />;
        })}
      </div>
    </div>
  );
}
