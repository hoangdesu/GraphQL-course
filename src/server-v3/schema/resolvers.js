const { favoriteChamps } = require('./favoriteChamps');
const fs = require('fs');
const _ = require('lodash');

const resolvers = {
    Query: {
        hi(parent, args, context, info) {
            console.log('Context req headers:', context.req.headers);
            console.log('Info:', info)
            return `sup ${context.player}`; // sup Doroke
        },

        champions: (parent) => {
            console.log('parent of champions query (should be undefined):', parent);
            return favoriteChamps;
        },

        champion: (parent, args) => {
            const usingLodash = true;
            if (usingLodash) {
                // console.log('using lodash');
                const { id } = args;
                return _.find(favoriteChamps, { id: Number(id) }); // find in the list with the following id, make it a Number type
            } else {
                const id = parseInt(args.id); // args always get passed in as string
                return favoriteChamps.find(champ => champ.id === id);
            }
        },

        maps: () => {
            const mapsFile = fs.readFileSync(`${__dirname}/maps.json`); // must get current working directory first
            return JSON.parse(mapsFile);
        },
        
        champIdOrName: (_parent, args) => {
            const { id, name } = args.filters;
            
            if (id) {
                // same as above
                return favoriteChamps.find(champ => champ.id === parseInt(id)); 
            } else if (name) {
                // ignore cases
                return favoriteChamps.find(champ => champ.name.toLowerCase() === name.toLowerCase());
            }
            
            return null;
        },

        hello: (_parent, args) => {
            return `Hello ${args.name}`;
        },

        // using Union
        championsWithUnion: () => {
            const isError = true;

            if (isError) {
                return { message: 'ERRORRRRRRR' };
            }

            if (favoriteChamps) return { champions: favoriteChamps };
        }
    },

    // using Union
    ChampionsResult: {
        __resolveType(obj) {
            if (obj.champions) {
                return 'ChampionsResultSuccess';
            }

            if (obj.message) {
                return 'ChampionsResultError';
            }

            return null;
        }
    },

    Champion: {
        game: (parent) => {
            // console.log('parent of game query:', parent);
            return "League of Legends";
        },
        abilities: () => {
            return ['Passive', 'Q', 'W', 'E', 'R'];
        },
        midChamps: () => {
            return _.filter(favoriteChamps, (champ) => {
                for (const role of champ.roles) {
                    if (role === 'MID') {
                        return champ;
                    }
                }
            });
        }
    },

    Mutation: {
        addChampion: (_parent, args) => {
            const lastIndex = favoriteChamps.length - 1;
            const newId = favoriteChamps[lastIndex].id + 1;
            const champ = {
                ...args.input,
                id: newId
            } 
            console.log(champ);
            favoriteChamps.push(champ);
            return champ;
        },

        renameChampion(_parent, args) {
            console.log('arg inputs:');
            console.log(args.id);
            console.log(args.name);
            console.log(args.newName);
            for (const champ of favoriteChamps) {
                if (champ.id === parseInt(args.id) && champ.name === args.name) {
                    champ.name = args.newName;
                    return champ;
                }
            }
        },

        removeChampion: (_parent, args) => {
            for (const [i, champ] of favoriteChamps.entries()) {
                if (champ.id === parseInt(args.id)) {
                    const removedChamp = favoriteChamps.splice(i, 1)[0]; // splice(start, deleteCount), returns an array, get the first element
                    console.log('removed:', removedChamp);
                    return removedChamp;
                }
            }
            console.log('no champ removed');
            return null;
        },

        updateChampion: (parent, args) => {
            console.log('args.input:', args.input);
            for (const [i, champ] of favoriteChamps.entries()) {
                if (champ.id === parseInt(args.input.id)) {
                    // if (args.input.name) {
                    //     favoriteChamps[i].name = args.input.name;
                    // }

                    // if (args.roles) {
                    //     favoriteChamps[i].roles = args.input.roles;
                    // }

                    // if (args.isMeta) {
                    //     favoriteChamps[i].isMeta = args.input.isMeta;
                    // }

                    favoriteChamps[i] = {
                        ...favoriteChamps[i],
                        name: args.input.name,
                        roles: args.input.roles,
                        isMeta: args.input.isMeta
                    }

                    console.log('UPDATE CHAMP:', favoriteChamps[i]);
                    return favoriteChamps[i];
                }
            }
            return null;
        }
    }
};

module.exports = { resolvers };