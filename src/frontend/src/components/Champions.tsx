import React, { useState, useRef, MouseEvent, KeyboardEvent } from 'react';
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import ChampionRow, { Champion } from './ChampionRow';

const GET_ALL_CHAMPS = gql`
    query getAllChamps { # this line is optional
        champions {
            id
            name
            isMeta
            roles
        }
    }
`;

const QUERY_A_CHAMPION = gql`
    query QUERY_A_CHAMPION($id: String!) {
        champion(id: $id) {
            id
            name
            # roles
            # isMeta
            # strongAgainst
            # game
            # abilities
        }
    }
`;

const Champions = () => {
    const initialValue: any = null;
    const searchedChampRef = useRef(initialValue);

    const { data: champData, loading: champLoading, error: champError } = useQuery(GET_ALL_CHAMPS);
    const [fetchChampion, { data: searchedChampData, error: searchedError }] = useLazyQuery(QUERY_A_CHAMPION);

    const performSearch = () => {
        fetchChampion({variables: {
            id: {
                // name: 'Zed'
                id: '1'
            }
        }});
        console.log('search for:', searchedChampRef.current.value);
        searchedChampRef.current.value = '';
    }

    const searchInputEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    };

    const searchButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        performSearch();
    }

    if (champLoading) {
        return <p>Loading...</p>;
    }

    if (champError) {
        return <p style={{ color: 'red' }}>Error querying champions</p>;
    }

    // {searccha}

    if (searchedError) {
        console.log('Search error:', searchedError.message);
        
    }

    return (
        <div>
            <h1>Favorite Champs</h1>
            <table border={1}>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>Roles</th>
                        <th>Hot pick</th>
                    </tr>
                </thead>
                <tbody>
                    {champData.champions.map((champion: Champion) => (
                        <ChampionRow key={champion.id} champion={champion} />
                    ))}
                </tbody>
            </table>

            <h2>Search for a champion</h2>
            <input type="text" ref={searchedChampRef} onKeyDown={searchInputEnterHandler} />
            <button onClick={searchButtonClickHandler}>Search</button>
            <button onClick={() => fetchChampion({ variables: { id: '1' }})}>Hi</button>

            <p>{searchedChampData ? searchedChampData.champion.name : 'champ name'}</p>
        </div>
    );
};

export default Champions;
