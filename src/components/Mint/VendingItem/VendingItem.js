import React from 'react';
import './VendingItem.css';

export default function VendingItem(props) {
  return <img className='vending-item' src={process.env.PUBLIC_URL + props.image} alt='Vending Item' />;
}
