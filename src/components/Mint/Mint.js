/// @copyright Rug Pull Games, Project: RPG 404
/// @see Rug Pull Games: https://rug-pull.games/
/// @see RPG 404: http://rpg404.com/
/// @author endaye

import { useRef } from "react";
import "./Mint.css";
import VendingMachine from "./VendingMachine";

export default function Mint(props) {
  const ref = useRef(null);

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mint">
      <img
        className="mint-market-bg"
        src={process.env.PUBLIC_URL + "/img/bg_mint_market.png"}
        alt="Mint Market Background"
        onClick={handleClick}
      />
      <div ref={ref}>
        <VendingMachine connectWallet={props.connectWallet} />
      </div>
    </div>
  );
}
