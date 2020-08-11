import React from "react";
import LoadingScreen from "../LoadingScreen";
import { gql, useQuery } from "@apollo/client";
import { Redirect } from "react-router";

const AUTHENTICATE_USER = gql`
    query AuthenticateQuery($ticket: String!) {
        authenticateUser(ticket: $ticket) {
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
    let ticketStartIndex =
        url.indexOf(ticketParamName) + ticketParamName.length;
    // Only returns the ticket portion
    return url.substring(ticketStartIndex);
};

const Auth = () => {
    // First parse out ticket from URL href
    let ticket = parseTicket(window.location.href);

    // Run query against backend to authenticate user
    const { data, loading, error } = useQuery(AUTHENTICATE_USER, {
        variables: { ticket: ticket },
    });

    if (error) return <Redirect to="login" />;
    if (loading) return <LoadingScreen />;
    if (!data) return <Redirect to="login" />;

    let { netid, token, recentUpdate } = data.authenticateUser;

    // Set token in local storage
    localStorage.setItem("token", token);

    // Set recent update in client state
    return <Redirect to="schedule" />;
};

export default Auth;
