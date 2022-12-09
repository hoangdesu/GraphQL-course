import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Champions from './components/Champions';
import Maps from './components/Maps';

const App = () => {
  const client = new ApolloClient({
    uri: 'http://localhost:4000',
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
