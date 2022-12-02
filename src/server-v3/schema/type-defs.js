const { gql } = require("apollo-server");

const typeDefs = gql`
    type Champion {
        id: ID!
        name: String!
        roles: [Role!]
        isMeta: Boolean!
        strongAgainst: [Champion!]
        game: String!
        abilities: [String!]!
        whatever: String
        midChamps: [Champion!]
    }

    type Query {
        hi: String
        champions: [Champion!]!
        champion(id: ID!): Champion
        whatever: String
        remove(id: ID!): Champion
    }

    enum Role {
        TOP
        JUNGLE
        MID
        ADC
        SUPPORT
    }
`

module.exports = { typeDefs };
