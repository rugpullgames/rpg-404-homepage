/// @copyright Rug Pull Games, Project: RPG 404
/// @see Rug Pull Games: https://rug-pull.games/
/// @see RPG 404: http://rpg404.com/
/// @author endaye

import React from 'react';
import './Status.css';

export default function Status(props) {
  return <div className='status'>{props.statusMsg}</div>;
}
