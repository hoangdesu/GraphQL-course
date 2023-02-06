const { gql } = require("apollo-server");

const typeDefs = gql`
    type Champion {
        id: ID!
        name: String!
        roles: [Role!]
        isMeta: Boolean!
        strongAgainst: [Champion]
        game: String!
        abilities: [String!]!
        whatever: String
        midChamps: [Champion!]
    }

    type Map {
        id: ID!
        name: String!
        players: String!
        playable: Boolean!
        imageUrl: String!
    }

    input ChampionInputFilter {
        id: ID
        name: String
    }

    type Query {
        hi: String
        champions: [Champion!]!
        champion(id: ID!): Champion
        whatever: String
        maps: MapsResult
        champIdOrName(filters: ChampionInputFilter!): Champion
        hello(name: String!): String!
        championsWithUnion: ChampionsResult
    }

    enum Role {
        TOP
        JUNGLE
        MID
        ADC
        SUPPORT
    }

    input addChampionInput {
        name: String!
        roles: [Role!]! = [MID] # ARAM time!
        isMeta: Boolean = false # default value
    }

    input updateChampionInput {
        id: ID!
        name: String
        roles: [Role]
        isMeta: Boolean
    }

    type Mutation {
        addChampion(input: addChampionInput!): Champion!
        renameChampion(id: ID!, name: String!, newName: String!): Champion
        removeChampion(id: ID!): Champion
        updateChampion(input: updateChampionInput!): Champion
    }
    
    # Error handling with Union
    type ChampionsResultSuccess {
        champions: [Champion!]!
    }

    type ChampionsResultError {
        message: String!
    }

    union ChampionsResult = ChampionsResultSuccess | ChampionsResultError

    # union for Maps
    type MapsResultSuccess {
        maps: [Map!]!
    }

    type MapsResultError {
        message: String!
    }

    union MapsResult = MapsResultSuccess | MapsResultError
`

module.exports = { typeDefs };
