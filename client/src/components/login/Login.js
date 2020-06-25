import React from "react";
import { Button } from "@material-ui/core";
import { useQuery, gql, useApolloClient } from "@apollo/client";

const config = {
    loginURL: "https://idp.rice.edu/idp/profile/cas/login",
};

const GET_SERVICE_URL = gql`
	query GetServiceUrl {
		service
	}
`;

const Login = () => {
    const { data, loading, error } = useQuery(GET_SERVICE_URL, { fetchPolicy: "cache-and-network" });
    const client = useApolloClient();

    if (loading) return <p>Loading...</p>;

    // Directly writes the service url to the cache
    client.writeQuery({
        query: gql`
            query GetService {
                service
            }
        `,
        data: { service: data.service },
    });

    // Handles click of login button
    const handleClick = () => {
        // Redirects user to the CAS login page
        let redirectURL = config.loginURL + "?service=" + data.service;
        window.open(redirectURL, "_self");
    }

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative', textAlign: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: "#FBFBFB" }}>
            <div style={{ display: "inline-block", color: "#272D2D" }}>
                <h2>the app formerly known as schedule planner</h2>
                <h4>brought to you by riceapps</h4>
            </div>
            <div style={{ position: 'absolute', marginTop: '75px' }}>
                <Button variant="outlined" style={{ color: "#272D2D", textTransform: "none" }} onClick={handleClick}>enter</Button>
            </div>
        </div>
    )
}

export default Login;