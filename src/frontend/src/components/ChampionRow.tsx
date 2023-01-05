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
    mutation RemoveChamp($id: ID!) {
        removeChampion(id: $id) {
            name
            id
        }
    }
`;

const UPDATE_CHAMP_MUTATION = gql`
    mutation UpdateChampion($input: updateChampionInput!) {
        updateChampion(input: $input) {
            name
            roles
            isMeta
        }
    }
`;

const ChampionRow: FunctionComponent<ChampionRowProps> = ({ champion, refetch }) => {
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [champ, setChamp] = useState<Champion>(champion);

    // useMutation
    const [removeChampMutation, { data: removedChampData }] = useMutation(REMOVE_CHAMP_MUTATION);
    const [updateChampMutation, { data: updatedChampData }] = useMutation(UPDATE_CHAMP_MUTATION, {
        variables: {
            input: {
                id: champ.id,
                name: champ.name,
                roles: champ.roles,
                isMeta: champ.isMeta
            }
        }
    });

    let roleStr = '';
    champ.roles.forEach((role, index) => {
        roleStr += role.charAt(0).toLocaleUpperCase() + role.slice(1).toLowerCase(); // JS capitalize first letter 🥴
        if (index < champ.roles.length - 1) roleStr += ' / ';
    });

    const toggleShowEditor = async () => {
        if (showEditor) {
            if (confirm(`Save changes?`)) {
                await updateChampMutation();
                
                // alert('Champions updated successfully');
              console.log('updated:', updatedChampData);
              

            }
        }
        await setShowEditor(!showEditor);
        await refetch();
    };

    const removeChampHandler = async () => {
        const removeConfirmed = confirm(`Are you sure you want to remove ${champ.name}?`);
        if (removeConfirmed) {
            await removeChampMutation({
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
                        {/* too many handlings :)) */}
                        {[1,2].map((num, i) => (
                          <select key={num} onChange={e => {
                            const newRoles = [...champ.roles];
                            newRoles[i] = e.target.value;
                            setChamp(prev => {
                              return {
                                ...prev,
                                roles: newRoles
                              }
                            }) 
                          }} >
                            <option value="TOP" selected={champ.roles[i] === 'TOP'}>Top</option>
                            <option value="JUNGLE" selected={champ.roles[i] === 'JUNGLE'}>Jungle</option>
                            <option value="MID" selected={champ.roles[i] === 'MID'}>Mid</option>
                            <option value="ADC" selected={champ.roles[i] === 'ADC'}>ADC</option>
                            <option value="SUPPORT" selected={champ.roles[i] === 'SUPPORT'}>Support</option>
                          </select>
                        ))}
                        {/* <input
                            type="text"
                            value={champ.roles.join(', ')}
                            onChange={(e) => {
                                setChamp((prev) => ({
                                    ...prev,
                                    roles: [e.target.value.toUpperCase()]
                                }));
                            }}
                        /> */}
                    </td>
                    <td>
                        <input type="checkbox" defaultChecked={champ.isMeta} onChange={e => {
                          setChamp({ ...champ, isMeta: e.target.checked })
                        }} />
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
