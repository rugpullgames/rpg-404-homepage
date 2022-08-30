import React from "react";
import "./NFTDetail.css";

export default function NFTDetail(props) {
  const showAttr = (attr) => {
    return (
      <p key={`nft-metadata-attr-${attr.trait_type}`}>
        {attr.trait_type}: {attr.value}
      </p>
    );
  };

  return (
    <div className="nft-detail">
      {props.metadata && (
        <div>
          <p>Name: {props.metadata.name}</p>
          {props.metadata.attributes.map((attr) => {
            return showAttr(attr);
          })}
        </div>
      )}
    </div>
  );
}
