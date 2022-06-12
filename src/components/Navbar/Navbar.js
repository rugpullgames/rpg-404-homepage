import React from 'react';
import SocialLinks from './SocialLinks';
import Logo from './Logo';

export default function Navbar(props) {
  return (
    <div className='navbar'>
      <Logo />
      <SocialLinks connectWalletHandler={props.connectWalletHandler} />
    </div>
  );
}
