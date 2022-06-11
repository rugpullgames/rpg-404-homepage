import React from 'react';
import './Status.css';

export default function Status(props) {
  return <div className='status'>{props.statusMsg}</div>;
}
