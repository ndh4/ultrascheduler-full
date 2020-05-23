// Apollo Client Setup
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, split, gql } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

// Apollo Subscriptions Setup
import { WebSocketLink } from '@apollo/link-ws';

// HTTP Backend Link
const httpLink = new HttpLink({
    uri: 'http://localhost:3000/graphql'
});

// WebSocket Backend Link
const wsLink = new WebSocketLink({
    uri: `ws://localhost:3000/graphql`,
    options: {
        reconnect: true
    }
});

// Uses wsLink for subscriptions, httpLink for queries & mutations (everything else)
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

// Setup cache
const cache = new InMemoryCache();

// Initialize Client
export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
});

// Initial local state
const initialState = {
    service: "https://hatch.riceapps.org/auth",
}

// Initialize cache with a state
cache.writeQuery({
    query: gql`
        query InitialState {
        service
        }
  `,
    data: initialState
});