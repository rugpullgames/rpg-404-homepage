import React, { useRef, useContext } from 'react';
import NFTContext from '../../NFTContext';
import './SocialLinks.css';

function SocialLink(props) {
  const image = useRef();
  console.log();
  return (
    <div
      className='social-icon'
      onMouseEnter={(e) => {
        image.current.src = process.env.PUBLIC_URL + props.iconHover;
      }}
      onMouseLeave={(e) => {
        image.current.src = process.env.PUBLIC_URL + props.iconNormal;
      }}
      onClick={props.onClick}>
      <img ref={image} className='social-icon-img' src={process.env.PUBLIC_URL + props.iconNormal} alt={props.alt} />
    </div>
  );
}

export default function SocialLinks(props) {
  const { openseaColletionName, isRinkeby } = useContext(NFTContext);

  const links = [
    {
      ref: null,
      iconNormal: '/img/social/icon_twitter.png',
      iconHover: '/img/social/icon_twitter_hover.png',
      alt: 'Twitter',
      onClick: () => {
        window.open('https://twitter.com/rug_pull_games');
      },
    },
    {
      ref: null,
      iconNormal: '/img/social/icon_discord.png',
      iconHover: '/img/social/icon_discord_hover.png',
      alt: 'Discord',
      onClick: () => {
        window.open('https://discord.com/');
      },
    },
    {
      ref: null,
      iconNormal: '/img/social/icon_opensea.png',
      iconHover: '/img/social/icon_opensea_hover.png',
      alt: 'Opensea',
      onClick: () => {
        window.open(`https://${isRinkeby ? 'testnets.' : ''}opensea.io/collection/${openseaColletionName}`);
      },
    },
    {
      ref: null,
      iconNormal: '/img/social/icon_etherscan.png',
      iconHover: '/img/social/icon_etherscan_hover.png',
      alt: 'Etherscan',
      onClick: () => {
        window.open('https://etherscan.io/');
      },
    },
    {
      ref: null,
      iconNormal: '/img/social/icon_metamask.png',
      iconHover: '/img/social/icon_metamask_hover.png',
      alt: 'MetaMask',
      onClick: () => {
        props.connectWalletHandler();
      },
    },
  ];

  return (
    <div className='social-links' onClick={() => {}}>
      {links.map((sl) => {
        return <SocialLink {...sl} key={`social-icon-${sl.alt}`} />;
      })}
    </div>
  );
}
