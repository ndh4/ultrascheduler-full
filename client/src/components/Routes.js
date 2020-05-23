import React, { Component, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router'
import Auth from './auth/Auth';
import Login from './login/Login';
import Main from './main/Main';
import { backendURL } from '../config';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import LoadingScreen from './LoadingScreen';

/**
 * Requests to verify the user's token on the backend
 */
const VERIFY_USER = gql`
    query VerifyQuery($token: String!) {
        verifyUser(token:$token) {
            _id
            netid
            token
            recentUpdate
        }
    }
`;

/**
 * Defines a private route - if the user is NOT logged in or has an invalid token, 
 * then we redirect them to the login page.
 */
const PrivateRoute = ({ children, ...rest }) => {
    // Check if token is stored
    if (localStorage.getItem('token') === null) {
        return <Redirect to="login" />
    } else {
        // Get token from local storage
        let token = localStorage.getItem('token');

        // Verify that the token is valid on the backend
        let { data, loading, error } = useQuery(
            VERIFY_USER,
            { variables: { token: token } }
        );
        
        if (error) {
            // Clear the token because something is wrong with it
            localStorage.removeItem('token');
            // Redirect the user to the login page
            return (<Redirect to="login" />);
        }
        if (loading) return <LoadingScreen />;
        if (!data) {
            // Clear the token
            localStorage.removeItem('token');
            // Redirect the user
            return (<Redirect to="login" />);
        }

        // Everything looks good! Now let's send the user on their way
        return (
            <Route {...rest} render={(props) => {
                return (children);
            }} />
        );
    }
}

/**
 * Defines all the routes for our system.
 * @param {*} param0 
 */
const Routes = ({ }) => {
    const client = useApolloClient();
    
    // Initially, we need to get the "serviceURL" (used for IDP authentication) from the backend
    useEffect(
        () => {
            fetch(backendURL + "/deploy/service")
            .then(response => {
                response.text().then(service => {
                    // Directly writes the service url to the cache
                    client.writeQuery({
                        query: gql`query GetService { service }`,
                        data: { service: service }
                    });
                });
            });
        }, []
    );


    return (
        <Switch>
            <Route path="/auth">
                <Auth />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <PrivateRoute path="/schedule">
                <Main />
            </PrivateRoute>
            <PrivateRoute path="/">
                <Redirect to="/schedule" />
            </PrivateRoute>
        </Switch>
    )
}

export default Routes;