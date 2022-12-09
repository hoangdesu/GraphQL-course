import React from 'react';
import { useQuery, gql } from '@apollo/client';
import ChampionRow, { Champion } from './ChampionRow';

const GET_ALL_CHAMPS = gql`
    query getAllChamps {
        champions {
            id
            name
            isMeta
            roles
        }
    }
`;

const Champions = () => {
    const { data: champData, loading: champLoading, error: champError } = useQuery(GET_ALL_CHAMPS);

    if (champLoading) {
        return <p>Loading...</p>;
    }

    if (champError) {
        return <p style={{ color: 'red' }}>Error querying champions</p>;
    }

    {
        champData && console.log(champData);
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
        </div>
    );
};

export default Champions;
