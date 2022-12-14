import React, { FunctionComponent, useState } from 'react';
import { useMutation, gql } from '@apollo/client';

export interface Champion {
    id: number;
    name: string;
    roles: string[];
    isMeta: boolean;
}

interface ChampionRowProps {
    champion: Champion;
    refetch: () => {};
}

const REMOVE_CHAMP_MUTATION = gql`
    mutation removeChamp($id: ID!) {
        removeChampion(id: $id) {
            name
            id
        }
    }
`;

const ChampionRow: FunctionComponent<ChampionRowProps> = ({ champion, refetch }) => {
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [champ, setChamp] = useState<Champion>(champion);

    // useMutation
    const [removeChampMutation, { data } ] = useMutation(REMOVE_CHAMP_MUTATION);

    let roleStr = '';

    champ.roles.forEach((role, index) => {
        roleStr += role.charAt(0).toLocaleUpperCase() + role.slice(1).toLowerCase(); // JS capitalize first letter 🥴
        if (index < champ.roles.length - 1) roleStr += ' / ';
    });

    const toggleShowEditor = () => {
        setShowEditor(!showEditor);
    };

    const removeChampHandler = () => {
        const removeConfirmed = confirm(`Are you sure you want to remove ${champ.name}?`);
        if (removeConfirmed) {
            removeChampMutation({
                variables: {
                    id: Number(champ.id)
                }
            });

            refetch();
        }
    };

    return (
        <tr>
            {showEditor ? (
                <>
                    <td>{champ.id}</td>
                    <td>
                        <input
                            type="text"
                            value={champ.name}
                            onChange={(e) =>
                                setChamp((prev) => {
                                    return {
                                        ...prev,
                                        name: e.target.value
                                    };
                                })
                            }
                        />
                    </td>
                    <td>
                        <input type="" />
                    </td>
                    <td>
                        <input type="checkbox" />
                    </td>
                </>
            ) : (
                <>
                    <td>{champ.id}</td>
                    <td>{champ.name}</td>
                    <td>{roleStr}</td>
                    <td>{champ.isMeta ? '🔥' : '💩'}</td>
                </>
            )}
            <td>
                <button onClick={toggleShowEditor}>{showEditor ? '✅' : '✏️'}</button>
                <button onClick={removeChampHandler}>🗑</button>
            </td>
        </tr>
    );
};

export default ChampionRow;
