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

const QUERY_ALL_MAPS_WITH_UNION = gql`
    query queryAllMaps {
        maps {
            ... on MapsResultSuccess {
                maps {
                    id
                    name
                    players
                    playable
                    imageUrl
                }
            }

            ... on MapsResultError {
                message
            }
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
    const usingUnion = true;
    const queryType = usingUnion ? QUERY_ALL_MAPS_WITH_UNION : QUERY_ALL_MAPS;

    const { data: mapData, loading: mapLoading, error: mapError } = useQuery(queryType);
    console.log('mapData:', mapData);

    if (mapData && mapData.maps.message) {
        return <div>{mapData.maps.message}</div>;
    }

    if (mapData && mapData.maps.maps) {
        const { maps } = mapData.maps;
        return (
            <div>
                <h1>Maps</h1>
                {mapData.maps.maps &&
                    maps.map((m: Map, index: number) => {
                        return (
                            <div key={m.id}>
                                <h2>
                                    {index + 1}. {m.name} ({m.players}) {m.playable ? '✅' : '🚫'}
                                </h2>
                                <img src={m.imageUrl} alt={m.name} width={450} />
                            </div>
                        );
                    })}
            </div>
        );
    }

    return <></>;
};

export default Maps;
