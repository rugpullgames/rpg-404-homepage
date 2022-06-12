import React from 'react';
import './SocialLinks.css';

export default function SocialLinks(props) {
  return (
    <div className='social-links'>
      <img
        className='social-icon'
        src={process.env.PUBLIC_URL + '/img/icon_twitter.png'}
        alt='Twitter'
        onClick={() => window.open('https://twitter.com/rug_pull_games', '_blank')}
      />
      <img
        className='social-icon'
        src={process.env.PUBLIC_URL + '/img/icon_discord.png'}
        alt='Discord'
        onClick={() => window.open('https://discord.com/', '_blank')}
      />
      <img
        className='social-icon'
        src={process.env.PUBLIC_URL + '/img/icon_opensea.png'}
        alt='Opensea'
        onClick={() => {
          window.open('https://opensea.io/');
        }}
      />
       <img
        className='social-icon'
        src={process.env.PUBLIC_URL + '/img/icon_etherscan.png'}
        alt='Etherscan'
        onClick={() => {
          window.open('https://etherscan.io/');
        }}
      />
      <img
        className='social-icon'
        src={process.env.PUBLIC_URL + '/img/icon_metamask.png'}
        alt='MetaMask'
        onClick={props.connectWalletHandler}
      />
    </div>
  );
}
