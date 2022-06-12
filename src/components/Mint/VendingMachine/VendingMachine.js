import React from 'react';
import VendingItem from '../VendingItem';
import './VendingMachine.css';

const nfts = [
  '/img/nft/nft_01.png',
  '/img/nft/nft_02.png',
  '/img/nft/nft_03.png',
  '/img/nft/nft_04.png',
  '/img/nft/nft_05.png',
  '/img/nft/nft_06.png',
  '/img/nft/nft_07.png',
  '/img/nft/nft_08.png',
  '/img/nft/nft_09.png',
  '/img/nft/nft_10.png',
  '/img/nft/nft_11.png',
  '/img/nft/nft_12.png',
  '/img/nft/nft_13.png',
  '/img/nft/nft_14.png',
  '/img/nft/nft_15.png',
];

export default function VendingMachine() {
  const rows = [];
  let col = 0;
  for (let i = 0; i < nfts.length; i++) {
    col = Math.floor(i / 5);
    if (!rows[col]) {
      rows[col] = [];
    }
    rows.push(<VendingItem key={`vending-item-${i}`} image={nfts[i]} />);
  }
  return (
    <div className='vending-machine'>
      <ol className='vending-row'>
        <li>
          <VendingItem key={`vending-item-${0}`} image={nfts[0]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${1}`} image={nfts[1]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${2}`} image={nfts[2]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${3}`} image={nfts[3]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${4}`} image={nfts[4]} />
        </li>
      </ol>
      <ol className='vending-row'>
        <li>
          <VendingItem key={`vending-item-${0}`} image={nfts[0]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${1}`} image={nfts[1]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${2}`} image={nfts[2]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${3}`} image={nfts[3]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${4}`} image={nfts[4]} />
        </li>
      </ol>
      <ol className='vending-row'>
        <li>
          <VendingItem key={`vending-item-${0}`} image={nfts[0]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${1}`} image={nfts[1]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${2}`} image={nfts[2]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${3}`} image={nfts[3]} />
        </li>
        <li>
          <VendingItem key={`vending-item-${4}`} image={nfts[4]} />
        </li>
      </ol>
    </div>
  );
}
