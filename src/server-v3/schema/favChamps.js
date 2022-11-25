const favoriteChamps = [
    {
        id: 1,
        name: 'Zed',
        role: ['MID', 'JUNGLE'],
        isMeta: true,
        strongAgainst: [
            {
                id: 3,
                name: 'Zoe',
                role: ['MID', 'SUPPORT'],
                isMeta: false
            },
            {
                id: 4,
                name: 'Ahri',
                role: ['MID', 'TOP'],
                isMeta: false
            },
            {
                id: 7,
                name: 'Jinx',
                role: ['ADC'],
                isMeta: false
            }
        ]
    },
    {
        id: 2,
        name: 'LeBlanc',
        role: ['MID'],
        isMeta: true
    },
    {
        id: 3,
        name: 'Zoe',
        role: ['MID', 'SUPPORT'],
        isMeta: false
    },
    {
        id: 4,
        name: 'Ahri',
        role: ['MID', 'TOP'],
        isMeta: false,
        strongAgainst: [
            {
                id: 2,
                name: 'LeBlanc',
                role: ['MID'],
                isMeta: true
            },
        ]
    },
    {
        id: 5,
        name: 'Lee Sin',
        role: ['JUNGLE', 'TOP', 'SUPPORT'],
        isMeta: true
    },
    {
        id: 6,
        name: 'Fizz',
        role: ['MID', 'JUNGLE', 'TOP'],
        isMeta: false,
        strongAgainst: [
            {
                id: 7,
                name: 'Jinx',
                role: ['ADC'],
                isMeta: false
            }
        ]
    },
    {
        id: 7,
        name: 'Jinx',
        role: ['ADC'],
        isMeta: false
    }
];

module.exports = { favoriteChamps };