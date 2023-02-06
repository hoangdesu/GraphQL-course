import React, { useState, useRef, MouseEvent, KeyboardEvent } from 'react';
import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';
import ChampionRow, { Champion } from './ChampionRow';

// GQL STATEMENTS

const GET_ALL_CHAMPS = gql`
    fragment ChampIdNameFragment on Champion {
        id
        name
    }

    query getAllChamps { # this line is optional, if there's no param
        champions {
            ...ChampIdNameFragment
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
`;

const QUERY_CHAMP_BY_ID_NAME = gql`
    query GetChampByIdOrName($id: ID, $name: String) {
        champIdOrName(filters: { id: $id, name: $name }) {
            name
            id
            roles
            isMeta
        }
    }
`;

const CREATE_NEW_CHAMP = gql`
    mutation CreateNewChamp($input: addChampionInput!) {
        # only need to specify the input matching the one defined in type-defs. No need to redefine
        addChampion(input: $input) {
            id
            name
            roles
        }
    }
`;

const Champions = () => {
    // STATES
    const initialValue: any = '';
    const searchedChampRef = useRef(initialValue);

    const [champIdOrNameInput, setChampIdOrNameInput] = useState<string>('');

    const [showNewRow, setShowNewRow] = useState<boolean>(false);

    const [newChamp, setNewChamp] = useState<Champion>({
        id: 0,
        name: '',
        roles: [],
        isMeta: false
    });

    // QUERIES
    const {
        data: champData,
        loading: champLoading,
        error: champError,
        refetch: refetchAllChamps
    } = useQuery(GET_ALL_CHAMPS);

    const [fetchChampion, { data: searchedChampData, error: searchedError }] = useLazyQuery(QUERY_A_CHAMPION, {
        variables: { id: searchedChampRef.current.value }
    });

    const [fetchChampByIdName, { data: champIdNameData }] = useLazyQuery(QUERY_CHAMP_BY_ID_NAME);

    const [addNewChampMutation] = useMutation(CREATE_NEW_CHAMP);

    // UTIL FUNCTIONS
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

    const searchByNameHandler = async () => {
        await fetchChampByIdName({
            variables: {
                // id: typeof parseInt(champIdOrNameInput) === 'number' ? champIdOrNameInput : null,
                name: champIdOrNameInput
            }
        });
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
    console.log('searched by id or name:', champIdNameData);

    // ADD NEW CHAMP FUNCTIONS - USEMUTATION
    const addNewChamp = async () => {
        if (!newChamp.name) {
            alert('Champion name empty');
            return;
        }

        // send the mutation, matching the input definition "addChampionInput" from type-defs
        await addNewChampMutation({
            variables: {
                input: {
                    name: newChamp.name,
                    roles: newChamp.roles,
                    isMeta: newChamp.isMeta
                }
            },
            refetchQueries: [
                { query: GET_ALL_CHAMPS },   // refetch: either use this way
                // 'getAllChamps'            // refetch: or this way
            ]
        });

        //  update UI without having to reload the whole page
        // await refetchAllChamps();            // refetch: or call the returned refetch function
        await setShowNewRow(false);
        setNewChamp({ id: 0, name: '', roles: [], isMeta: false });
        alert(`Added ${newChamp.name} successfully.`);
    };

    const toggleAddNewChampBtn = () => {
        setShowNewRow((prevState) => !prevState);
        const lastIndex = champData?.champions?.length - 1;
        const newId = parseInt(champData?.champions?.[lastIndex].id) + 1;
        setNewChamp((prev) => ({
            ...prev,
            id: newId
        }));
    };

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
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {/* FETCH ALL CHAMPS DATA - USEQUERY */}
                    {champData?.champions?.map((champion: Champion) => (
                        <ChampionRow key={champion.id} champion={champion} refetch={refetchAllChamps} />
                    ))}

                    {/* ADD NEW CHAMP - USEMUTATION */}
                    {showNewRow && (
                        <tr>
                            <td>{newChamp.id}</td>
                            <td>
                                {/* name */}
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        setNewChamp((prev) => ({
                                            ...prev,
                                            name:
                                                e.target.value &&
                                                e.target.value[0].toUpperCase() + e.target.value.slice(1)
                                        }))
                                    }
                                />
                            </td>
                            <td>
                                {/* roles */}
                                <label htmlFor="primaryRole">Primary role: </label>
                                <select
                                    id="primaryRole"
                                    onChange={(e) => {
                                        setNewChamp((prev) => {
                                            const roles = [...prev.roles];
                                            roles[0] = e.target.value;
                                            return {
                                                ...prev,
                                                roles
                                            };
                                        });
                                    }}
                                >
                                    <option value="TOP" selected>Top</option>
                                    <option value="JUNGLE">Jungle</option>
                                    <option value="MID">Mid</option>
                                    <option value="ADC" >ADC</option>
                                    <option value="SUPPORT">Support</option>
                                </select>
                                <br />
                                <label htmlFor="secondaryRole">Secondary role: </label>
                                <select
                                    id="secondaryRole"
                                    onChange={(e) =>
                                        setNewChamp((prev) => {
                                            const roles = [...prev.roles];
                                            if (e.target.value !== 'none') roles[1] = e.target.value;
                                            return {
                                                ...prev,
                                                roles
                                            };
                                        })
                                    }
                                >
                                    <option value="TOP">Top</option>
                                    <option value="JUNGLE" selected>
                                        Jungle
                                    </option>
                                    <option value="MID">Mid</option>
                                    <option value="ADC">ADC</option>
                                    <option value="SUPPORT">Support</option>
                                    <option value="none">None</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        setNewChamp((prev) => ({
                                            ...prev,
                                            isMeta: e.target.checked
                                        }))
                                    }
                                />
                            </td>
                            <td>
                                <button onClick={addNewChamp}>➕ Add</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button onClick={toggleAddNewChampBtn}>{!showNewRow ? '➕ Add new champ' : 'Cancel'}</button>
            <h2>Search for a champion by ID</h2>
            <input type="text" ref={searchedChampRef} placeholder="Champion ID" onKeyDown={searchInputEnterHandler} />
            <button onClick={searchButtonClickHandler}>Search</button>
            {searchedChampData?.champion ? (
                <div>
                    <p>ID: {searchedChampData?.champion.id}</p>
                    <p>Name: {searchedChampData?.champion.name}</p>
                    <p>Roles: {searchedChampData?.champion.roles.join(', ')}</p>
                    <p>Is meta: {searchedChampData?.champion.isMeta ? '🔥' : '💩'}</p>
                    <p>Strong against: {searchedChampData?.champion?.strongAgainst?.map((c: Champion) => c.name)}</p>
                    <p>Game: {searchedChampData?.champion.game}</p>
                    <p>Abilities: {searchedChampData?.champion.abilities.join(' - ')}</p>
                </div>
            ) : (
                <p>No champion found</p>
            )}

            <h2>Search for a champion by Name</h2>
            <input
                type="text"
                onChange={(e) => setChampIdOrNameInput(e.currentTarget.value)}
                onKeyDown={searchByNameHandler}
            />
            <button onClick={searchByNameHandler}>Search by Name</button>
            <p>Id: {champIdNameData && champIdNameData.champIdOrName?.id}</p>
            <p>Name: {champIdNameData && champIdNameData.champIdOrName?.name}</p>
            <p>Roles: {champIdNameData && champIdNameData.champIdOrName?.roles.join(' - ')}</p>
            <p>Meta: {champIdNameData && champIdNameData.champIdOrName?.isMeta.toString()}</p>
        </div>
    );
};

export default Champions;
