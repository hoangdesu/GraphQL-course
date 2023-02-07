import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Champions from './components/Champions';
import Maps from './components/Maps';

const App = () => {
  const PORT = 4001;
  const client = new ApolloClient({
    uri: `http://localhost:${PORT}`, // apollo server endpoint
    cache: new InMemoryCache()
  })

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Champions />
        <Maps />
      </div>
    </ApolloProvider>
  )
}

export default App
