import React from 'react';
import './Mint.css';
import VendingMachine from './VendingMachine';

export default function Mint() {
  return (
    <div className='mint'>
      <img
        className='mint-market-bg'
        src={process.env.PUBLIC_URL + '/img/bg_mint_market.png'}
        alt='Mint Market Background'
      />
      <VendingMachine />
    </div>
  );
}
