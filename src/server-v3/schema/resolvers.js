const { favoriteChamps } = require('./favChamps');
const _ = require('lodash');

const resolvers = {
    Query: {
        hi() {
            return "sup bitch";
        },
        champions: () => {
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
        }
    },

    Champion: {
        game: () => {
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

        updateChampion(_parent, args) {
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
        }
    }
};

module.exports = { resolvers };