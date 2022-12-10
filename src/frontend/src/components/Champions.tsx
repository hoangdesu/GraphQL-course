import React, { useState, useRef, MouseEvent, KeyboardEvent } from 'react';
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import ChampionRow, { Champion } from './ChampionRow';

const GET_ALL_CHAMPS = gql`
    query getAllChamps {
        # this line is optional
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

const QUERY_TEST = gql`
    {
        champion {
            name
            id
        }
    }
`;

const QUERY_ZED = gql`
    query Champion($id: ID!) {
        champion(id: $id) {
            name
        }
    }
`;

const HELLO_NAME = gql`
    query Hello($name: String!) {
        hello(name: $name)
    }
`

const Champions = () => {
    const initialValue: any = '';
    const searchedChampRef = useRef(initialValue);

    const { data: champData, loading: champLoading, error: champError } = useQuery(GET_ALL_CHAMPS);
    const [fetchChampion, { data: searchedChampData, error: searchedError }] =
        useLazyQuery(QUERY_A_CHAMPION);

    // const [test, { data: testData }] = useLazyQuery(QUERY_A_CHAMPION, {
    //     variables: {
    //         id: 1
    //     }
    // });

    const { data: zedData } = useQuery(QUERY_ZED, {
        variables: { id: "1" }
    });

    const [fetchNameData, { data: nameData }] = useLazyQuery(HELLO_NAME, {
        variables: { name: searchedChampRef.current.value }
    });

    const performSearch = () => {
        fetchChampion({
            variables: {
                id: {
                    // name: 'Zed'
                    id: '1'
                }
            }
        });
        console.log('search for:', searchedChampRef.current.value);
        searchedChampRef.current.value = '';
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
            
            <button
                onClick={() => {
                    // test();
                    // console.log('testing:', testData);
                    fetchNameData();
                }}
            >
                Hi
            </button>

            <p>{searchedChampData ? searchedChampData.champion.name : 'champ name'}</p>

            <h3>Zed data: {zedData && zedData.champion.name}</h3>
            <h4>Name data: {nameData ? nameData.hello : ''}</h4>
        </div>
    );
};

export default Champions;
