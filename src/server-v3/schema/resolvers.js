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
        },
        whatever: () => {
            return 'whatever from query';
        },
        remove: (_parent, args) => {
            console.log(args.id);
            console.log('before:', favoriteChamps.length);
            console.log('after:', favoriteChamps.length);
            return favoriteChamps.pop();

        }
    },

    Champion: {
        game: () => {
            return "League of Legends";
        },
        abilities: () => {
            return ['Passive', 'Q', 'W', 'E', 'R'];
        },
        whatever: () => {
            return 'whatever from champion'; // different from same method in query type
        },
        midChamps: () => {
            return _.filter(favoriteChamps, (champ) => {
                for (const role of champ.role) {
                    if (role === 'MID') {
                        return champ;
                    }
                }
            });
        }
    },

    Mutation: {
        addChampion: (_parent, args) => {
            const newId = favoriteChamps.length + 1;
            const champ = {
                ...args.input,
                id: newId
            } 
            console.log(champ);
            favoriteChamps.push(champ);
            return champ;
        },
        updateChampion(_parent, args) {
            console.log('ok');
            for (const champ in favoriteChamps) {
                if (champ.id === parseInt(args.id) && champ.name === args.name) {
                    champ.name = args.newName;
                    champ.id = favoriteChamps.length + 1;
                    
                    return champ;
                }
            }
            return null;
        }
    }
};

module.exports = { resolvers };