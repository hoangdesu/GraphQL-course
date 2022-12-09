import React, { FunctionComponent } from 'react';

export interface Champion {
    id: number;
    name: string;
    roles: string[];
    isMeta: boolean;
}

interface ChampionRowProps {
    champion: Champion;
}

const ChampionRow: FunctionComponent<ChampionRowProps> = ({ champion: champ }) => {
  let roleStr = '';
  
  champ.roles.forEach((role, index) => {
      roleStr += role.charAt(0).toLocaleUpperCase() + role.slice(1).toLowerCase(); // JS capitalize first letter 🥴
      if (index < champ.roles.length - 1) roleStr += ' / ';
  })

  return (
    <tr>
        <td>{champ.id}</td>
        <td>{champ.name}</td>
        <td>{roleStr}</td>
        <td>{champ.isMeta ? '🔥' : '💩'}</td>
    </tr>
  )
}

export default ChampionRow