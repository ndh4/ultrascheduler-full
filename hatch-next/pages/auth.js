import LoadingScreen from "../components/LoadingScreen";
import { useRouter } from 'next/router'
import { gql, useQuery } from "@apollo/client";
import withApollo from "../lib/withApollo";

const AUTHENTICATE_USER = gql`
    query AuthenticateQuery($ticket: String!) {
        authenticateUser(ticket:$ticket) {
            _id
            netid
            token
            recentUpdate
        }
    }
`;

const parseTicket = (url) => {
    // Ex: http://example.com/auth?ticket=ST-1590205338989-7y7ojqvDfvGIFDLyjahEqIp2F
    // Get the ticket query param
    let ticketParamName = "ticket=";
    // We're searching for the part of the string AFTER ticket=
    let ticketStartIndex = url.indexOf(ticketParamName) + ticketParamName.length;
    // Only returns the ticket portion
    return url.substring(ticketStartIndex);
}

const Auth = () => {
    const router = useRouter();
    // First parse out ticket from URL href
    // let ticket = parseTicket(window.location.href);
    // let ticket = parseTicket(router.query.ticket);

    // Run query against backend to authenticate user
    const { data, loading, error } = useQuery(
        AUTHENTICATE_USER,
        { variables: { ticket: router.query.ticket } }
    );
    
    if (error) {
        router.push("/login");
    }
    if (loading) return <LoadingScreen />;
    if (!data) {
        router.push("/login");
    }

    let { netid, token, recentUpdate } = data.authenticateUser;

    // Set token in local storage
    localStorage.setItem('token', token);

    // Set recent update in client state
    router.push("/schedule");
    return <></>;
}

export default withApollo(Auth);