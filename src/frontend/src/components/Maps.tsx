import React from 'react';
import { useQuery, gql } from '@apollo/client';

const QUERY_ALL_MAPS = gql`
    query queryAllMaps {
        maps {
            id
            name
            players
            playable
            imageUrl
        }
    }
`;

type Map = {
    id: string;
    name: string;
    players: string;
    playable: boolean;
    imageUrl: string;
};

const Maps = () => {
    const { data: mapData, loading: mapLoading, error: mapError } = useQuery(QUERY_ALL_MAPS);
    return (
        <div>
            <h1>Maps</h1>
            {mapData &&
                mapData.maps.map((m: Map, index: number) => {
                    return (
                        <div key={m.id}>
                            <h2>{index+1}. {m.name} ({m.players}) {m.playable ? '✅' : '🚫'}</h2>
                            <img src={m.imageUrl} alt={m.name} width={450} />
                        </div>
                    );
                })}
        </div>
    );
};

export default Maps;
