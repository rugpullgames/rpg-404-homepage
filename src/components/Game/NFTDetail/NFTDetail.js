/// @copyright Rug Pull Games, Project: RPG 404
/// @see Rug Pull Games: https://rug-pull.games/
/// @see RPG 404: http://rpg404.com/
/// @author endaye

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
