const resolvers = {
    Query: {
        users: () => {
            const me = {
                id: 1,
                name: 'Brian',
                age: 27,
                nationality: 'Vietnamese'
            }
            return [me];
        },

        hi() {
            return 'Hi from server v4';
        }
    }
};

export default resolvers;
