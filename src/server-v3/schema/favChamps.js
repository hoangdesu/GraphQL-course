const favoriteChamps = [
    {
        id: 1,
        name: 'Zed',
        roles: ['MID', 'JUNGLE'],
        isMeta: true,
        strongAgainst: [
            {
                id: 3,
                name: 'Zoe',
                roles: ['MID', 'SUPPORT'],
                isMeta: false
            },
            {
                id: 4,
                name: 'Ahri',
                roles: ['MID', 'TOP'],
                isMeta: false
            },
            {
                id: 7,
                name: 'Jinx',
                roles: ['ADC'],
                isMeta: false
            }
        ]
    },
    {
        id: 2,
        name: 'LeBlanc',
        roles: ['MID'],
        isMeta: true
    },
    {
        id: 3,
        name: 'Zoe',
        roles: ['MID', 'SUPPORT'],
        isMeta: false
    },
    {
        id: 4,
        name: 'Ahri',
        roles: ['MID', 'TOP'],
        isMeta: false,
        strongAgainst: [
            {
                id: 2,
                name: 'LeBlanc',
                roles: ['MID'],
                isMeta: true
            },
        ]
    },
    {
        id: 5,
        name: 'Lee Sin',
        roles: ['JUNGLE', 'TOP', 'SUPPORT', 'MID'],
        isMeta: true
    },
    {
        id: 6,
        name: 'Fizz',
        roles: ['MID', 'JUNGLE', 'TOP'],
        isMeta: false,
        strongAgainst: [
            {
                id: 7,
                name: 'Jinx',
                roles: ['ADC'],
                isMeta: false
            }
        ]
    },
    {
        id: 7,
        name: 'Jinx',
        roles: ['ADC'],
        isMeta: false
    }
];

module.exports = { favoriteChamps };