// lib/withApollo.js
import withApollo from "next-with-apollo";
import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	split,
	gql,
} from "@apollo/client";
import { setContext } from "@apollo/link-context";
import { ApolloProvider } from "@apollo/client";

// Wraps our requests with a token if one exists
// Copied from: https://www.apollographql.com/docs/react/v3.0-beta/networking/authentication/
const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = localStorage.getItem("token");
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const httpLink = new HttpLink({
	uri: "http://localhost:3001/graphql",
});

export default withApollo(
	({ initialState }) => {
		const cache = new InMemoryCache().restore(initialState || {});

		// Initial local state
		const clientInitialState = {
			service: process.env.REACT_APP_SERVICE_URL,
			recentUpdate: false,
			term: 202110,
		};

		// Initialize cache with a state
		cache.writeQuery({
			query: gql`
				query clientInitialState {
					service
					recentUpdate
					term
				}
			`,
			data: clientInitialState,
		});

		return new ApolloClient({
			cache: cache,
			link: authLink.concat(httpLink),
		});
	},
	{
		render: ({ Page, props }) => {
			return (
				<ApolloProvider client={props.apollo}>
					<Page {...props} />
				</ApolloProvider>
			);
		},
	}
);
