###### tags: `grapql`

Playlist: https://www.youtube.com/playlist?list=PLpPqplz6dKxXICtNgHY1tiCPau_AwWAJU

# 1. What is GraphQL
- a query language: a programming language used to get data
- not a database
- layer sits between frontend and backend
- queries and API, not a database
- 2 basic operations: `Query` vs `Mutation`
    ![](20221122164307.png)

Differences between GgraphQL vs REST
- One endpoint
- Underfetching and overfetching

# 2. Basic Types and Queries
- Graphql playground
- has 5 scalar (basic) data types: `ID`, `String`, `Int`, `Float`, `Boolean`
- defined with keyword `type`, similar to TypeScript. e.g.:
  ``` 
  type User {
    id: ID!
    name: String!
    age: Int!
    height: Float!
    isMarried: Boolean
    friends: [User!] # array of Users
  } 
  ```
- add `!` (exclamation mark/bang) to make a field `not null`, no bang for `nullable` (optional). 
  - `[User!]`: User must be non-null, array can be empty
  - `[User!]!`: both User and array must be non-null
- countries GQL API: https://github.com/trevorblades/countries || https://countries.trevorblades.com/

## Schema
- every GQL API must have **`schemas`**: defines all the data that will exist in the API. Can see all the schemas from the Schema tab
- every schema must have a **root type**, called **`Query`**
- query must be put inside a `{...}`, then put the field we want to query. The `query` keyword is optional
- can use `input` to group input arguments
    ```
    input UserInput {
        id: ID!
        name: String!
    }

    type Query {
        users: [Users!]
        user(input: UserInput): User # get a specific user
    }
    ```
- if return value is not of scalar type (returned value is an object), must specify all the fields we want to query from this object
- an example query of "VN":
    ![](20221122180347.png)  
- run the query with shortcut: `cmd + enter` or `ctrl + enter`
- only get the fields needed => avoid overfetching or underfetching
- returned value will be a JSON, inside the `"data"` field

# 3. GraphQL API With NodeJS and Apollo Server
> NOTE: Apollo server version used in this tutorial is v3.11, current version as of this note is v4.2

### Installation:
- install packages: `graphql`, `apollo-server` (v3, deprecrated)

### Setup server: 
- create a new instance of `ApolloServer` with an object with `typeDefs` and `resolvers` as param
- start Apollo server with `server.listen()`
- `index.js`:
  ```
  const { ApolloServer } = require('apollo-server');
  const { typeDefs } = require('./schema/type-defs');
  const { resolvers } = require('./schema/resolvers');

  const server = new ApolloServer({ typeDefs, resolvers });

  server.listen().then(({ url }) => {
      console.log(`APOLLO SERVER RUNNING AT ${url}`);
  });
  ```
### `typeDefs.js`:
```
const { gql } = require("apollo-server");

const typeDefs = gql`
    type Champions {
        id: ID!
        name: String!
        role: [String!]!
        isMeta: Boolean!
    }

    type Query {
        hi: String
        champions: [Champions!]!
    }
`

module.exports = { typeDefs };
```
- put this file under `schema` folder
- holds all the type definitions for graphql
- import `gql`, put all definitions under a string template literal ``
- has a special type `Query` that includes all the queries users can make, defines the return type
- each of these queries will then be connected with an associated `resolver` function
- '#' in template is treated as comment
- in Apollo server v4, no need to import `gql` for syntax highlighting -> use comment instead:
  ```
  const typeDefs = `#graphql

  # type definitions

  `
  ```

### `resolvers.js`
```
const { favoriteChamps } = require('./favChamps');

const resolvers = {
    Query: {
        hi() {
            return "sup bitch";
        },
        champions() {
            return favoriteChamps;
        }
    }
};

module.exports = { resolvers };
```
- includes a resolvers object with key `Query`
- each field in `Query` object is a function that returns a value, matching the name in typeDefs

## Querying data
- open Apollo server at http://localhost:4000/
- sample run: ![](20221125225755.png)

# 4. GraphQL resolvers

## enum
- enumerate type: a special kind of scalar that is restricted to a particular set of allowed values
- by convention, values are in capital (e.g. MID)
- results will be resolved to string (e.g "MID")
- define with keyword `enum`, used as a normal type
  ```
  enum Role {
      TOP
      JUNGLE
      MID
      ADC
      SUPPORT
  }
  ```