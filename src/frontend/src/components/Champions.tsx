import React from 'react';
import { useQuery, gql } from '@apollo/client';
import ChampionRow from './ChampionRow';

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
    const { data, loading, error } = useQuery(GET_ALL_CHAMPS);

    if (loading) {
        return <p>Loading...</p>
    }
    
    if (error) {
        return <p style={{ color: 'red' }}>Error</p>
    }
    
    {data && console.log(data)};

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
                    {data.champions.map(champion => (
                        <ChampionRow key={champion.id} champion={champion} />
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Champions