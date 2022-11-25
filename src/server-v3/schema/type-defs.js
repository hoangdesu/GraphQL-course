const { gql } = require("apollo-server");

const typeDefs = gql`
    type Champions {
        id: ID!
        name: String!
        role: [Role!]!
        isMeta: Boolean!
    }

    type Query {
        hi: String
        champions: [Champions!]!
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
