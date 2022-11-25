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
    }
};

module.exports = { resolvers };