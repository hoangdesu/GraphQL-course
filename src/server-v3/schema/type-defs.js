const { gql } = require("apollo-server");

const typeDefs = gql`
    type Champion {
        id: ID!
        name: String!
        role: [Role!]!
        isMeta: Boolean!
        strongAgainst: [Champion!]
    }

    type Query {
        hi: String
        champions: [Champion!]!
        champion(id: ID!): Champion
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
