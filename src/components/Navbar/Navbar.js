/// @copyright Rug Pull Games, Project: RPG 404
/// @see Rug Pull Games: https://rug-pull.games/
/// @see RPG 404: http://rpg404.com/
/// @author endaye

import React from "react";
import SocialLinks from "./SocialLinks";
import Logo from "./Logo";
import "./Navbar.css";

export default function Navbar(props) {
  return (
    <div className='navbar'>
      <Logo />
      <SocialLinks connectWallet={props.connectWallet} />
    </div>
  );
}
