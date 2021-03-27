import React from "react";
import { Button } from "@material-ui/core";
import { useQuery, gql, useApolloClient } from "@apollo/client";

// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import { useHistory } from "react-router";

// Load CSS
import "./Login.global.css";

const Login = () => {
    // Get history object for redirection to auth page
    const history = useHistory();

    // This is the function that redirects the user to the SAML login
    const signInSAML = async () => {
        await firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const provider = new firebase.auth.SAMLAuthProvider(
            "saml.rice-shibboleth"
        );
        const loginResult = await firebase.auth().signInWithPopup(provider);
        const userToken = await firebase.auth().currentUser.getIdToken(true);
        history.push("/auth", {
            profile: loginResult.additionalUserInfo.profile,
            token: userToken,
        });
    };

    return (
        <div className="loginContainer">
            <div className="loginText">
                <h2>the app formerly known as schedule planner</h2>
                <h4>brought to you by riceapps</h4>
            </div>
            <Button
                className="loginButton"
                variant="outlined"
                onClick={signInSAML}
            >
                enter
            </Button>
        </div>
    );
};

export default Login;
