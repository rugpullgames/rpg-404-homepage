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
