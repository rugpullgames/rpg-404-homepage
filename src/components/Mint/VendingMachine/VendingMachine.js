import React from 'react';
import './VendingMachine.css';

export default function VendingMachine() {
  return (
    <div className='vending-machine'>
      <img
        className='vending-bg'
        src={process.env.PUBLIC_URL + '/img/bg_vending_machine.png'}
        alt='Vending Machine Background'
      />
      <img
        className='vending-btn-to-game'
        src={process.env.PUBLIC_URL + '/img/btn_mint_to_game.png'}
        alt='Button of Vending Machine to Game'
      />
      <div className='vending-mint'>
        <img
          className='vending-btn-add'
          src={process.env.PUBLIC_URL + '/img/btn_mint_add.png'}
          alt='Button of Increasing Mint Quantity'
        />
        <img
          className='vending-btn-sub'
          src={process.env.PUBLIC_URL + '/img/btn_mint_sub.png'}
          alt='Button of Decreasing Mint Quantity'
        />
        <img
          className='vending-bg-input-frame'
          src={process.env.PUBLIC_URL + '/img/bg_mint_input_frame.png'}
          alt='Mint Quantity Input Frame'
        />
        <img
          className='vending-btn-mint'
          src={process.env.PUBLIC_URL + '/img/btn_mint.png'}
          alt='Mint Quantity Input Frame'
        />
      </div>
      {/* <img
        className='vending-btn-opensea'
        src={process.env.PUBLIC_URL + '/img/btn_mint_opensea.png'}
        alt='Buy NFTs on Opensea'
      /> */}
    </div>
  );
}
