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
    query GetChampByID($id: ID!) {
        champion(id: $id) {
            id
            name
            roles
            isMeta
            # strongAgainst # this field ALONE will cause error, cuz it needs to know the fields inside needed for query!!!
            strongAgainst {
                id
                name
                roles
                isMeta
            }
            game
            abilities
        }
    }
`

const Champions = () => {
    const initialValue: any = '';
    const searchedChampRef = useRef(initialValue);

    const { data: champData, loading: champLoading, error: champError } = useQuery(GET_ALL_CHAMPS);
    
    const [fetchChampion, { data: searchedChampData, error: searchedError }] =
        useLazyQuery(QUERY_A_CHAMPION, {
            variables: { id: searchedChampRef.current.value }
        });


    const performSearch = async () => {
        
        // method 1: passing the options object into the returned fetch function, with id as variable
        // await fetchChampion({
        //     variables: { 
        //         id: searchedChampRef.current.value
        //     }
        // });

        // method 2: passing the options object as the 2nd param into the useLazyQueryHook
        await fetchChampion(); // have to await to finish fetching before clearing input

        // >> method 1 variable (in function) will overwrite method 2 (in query)

        console.log('search for:', searchedChampRef.current.value);
        searchedChampRef.current.value = ''; // fetch is async, so input will be clear first before feeding into param => causing null
    };

    const searchInputEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    };

    const searchButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
        performSearch();
    };

    if (champLoading) {
        return <p>Loading...</p>;
    }

    if (champError) {
        return <p style={{ color: 'red' }}>Error querying champions</p>;
    }

    if (searchedError) {
        console.log('Search error:', searchedError.message);
    }

    console.log('searched champ data:', searchedChampData);

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

            {searchedChampData?.champion ? (
                <div>
                    <p>ID: {searchedChampData?.champion.id}</p>
                    <p>Name: {searchedChampData?.champion.name}</p>
                    <p>Roles: {searchedChampData?.champion.roles.join(', ')}</p>
                    <p>Is meta: {searchedChampData?.champion.isMeta ? '🔥' : '💩'}</p>
                    <p>
                        Strong against:{' '}
                        {searchedChampData?.champion?.strongAgainst?.map((c) => c.name)}
                    </p>
                    <p>Game: {searchedChampData?.champion.game}</p>
                    <p>Abilities: {searchedChampData?.champion.abilities.join(' - ')}</p>
                </div>
            ) : (
                <p>No champion found</p>
            )}
        </div>
    );
};

export default Champions;
