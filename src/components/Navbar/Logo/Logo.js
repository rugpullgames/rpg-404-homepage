/// @copyright Rug Pull Games, Project: RPG 404
/// @see Rug Pull Games: https://rug-pull.games/
/// @see RPG 404: http://rpg404.com/
/// @author endaye

import React from 'react';
import './Logo.css';

export default function Logo() {
  return (
    <div className='logo'>
      <img
        className='logo-rpg-icon'
        src={process.env.PUBLIC_URL + '/img/icon_rug_pull_games_logo_lg.png'}
        alt='Twitter'
        onClick={() => window.open('https://rug-pull.games', '_blank')}
      />
      <img className='logo-rpg-404-icon' src={process.env.PUBLIC_URL + '/img/icon_rpg_404.png'} alt='Discord' />
    </div>
  );
}
