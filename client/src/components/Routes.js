import React, { Component, useEffect, useState } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router";
import Auth from "./auth/Auth";
import Login from "./login/Login";
import Main from "./main/Main";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import LoadingScreen from "./LoadingScreen";
import About from "./about/About";
import NewAuth from "./auth/Auth";

// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import Error from "./error/Error";
import ListingDisplay from "./listing-display/ListingDisplay";
import ListingPage from "./listing-individual/ListingPage";

/**
 * Requests to verify the user's token on the backend
 */
const VERIFY_USER = gql`
    query VerifyQuery($token: String!) {
        verifyUser(token: $token) {
            _id
            netid
            token
            recentUpdate
        }
    }
`;

/**
 * This simply fetches from our cache whether a recent update has occurred
 */
const GET_RECENT_UPDATE = gql`
    query GetRecentUpdate {
        recentUpdate @client
    }
`;

/**
 * Defines a private route - if the user is NOT logged in or has an invalid token,
 * then we redirect them to the login page.
 */
const PrivateRoute = ({ children, ...rest }) => {
    let client = useApolloClient();
    const history = useHistory();

    const [isWaiting, setIsWaiting] = useState(true);
    const [getLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("User!");
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
            setIsWaiting(false);
        });
    }, []);

    if (isWaiting) return <LoadingScreen />;
    if (getLoggedIn) return <Route {...rest} render={(props) => children} />
    if (!getLoggedIn) return <Redirect to="login" />

    return <LoadingScreen />;
};

/**
 * Defines all the routes for our system.
 * @param {*} param0
 */
const Routes = ({ }) => {
    return (
        <div>
            <Switch>
                <Route path="/auth">
                    <Auth />
                </Route>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/about">
                    <About />
                </Route>

                <PrivateRoute exact path="/listing-display">
                    <ListingDisplay />
                </PrivateRoute>

                <PrivateRoute path="/listing-display/:id">
                    <ListingPage />
                </PrivateRoute >

                <PrivateRoute path="/schedule">
                    <Main />
                </PrivateRoute>

                <PrivateRoute exact path="/">
                    <Redirect to="/schedule" />
                </PrivateRoute>

                <Route>
                    <Error />
                </Route>
            </Switch >
        </div >
    );
};

export default Routes;
