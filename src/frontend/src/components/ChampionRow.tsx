import React, { FunctionComponent, useState } from 'react';

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
  const [showEditor, setShowEditor] = useState<boolean>(false);

  let roleStr = '';
  
  champ.roles.forEach((role, index) => {
      roleStr += role.charAt(0).toLocaleUpperCase() + role.slice(1).toLowerCase(); // JS capitalize first letter 🥴
      if (index < champ.roles.length - 1) roleStr += ' / ';
  });

  const toggleShowEditor = () => {
    setShowEditor(!showEditor);
  }

  return (
    <tr>
        <td>{showEditor ? <input value={champ.id}></input> : champ.id}</td>
        <td>{champ.name}</td>
        <td>{roleStr}</td>
        <td>{champ.isMeta ? '🔥' : '💩'}</td>
        <td><button onClick={toggleShowEditor}>✏️</button></td>
    </tr>
  )
}

export default ChampionRow