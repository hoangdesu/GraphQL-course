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
...