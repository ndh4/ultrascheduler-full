import React, { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Redirect, useHistory, useLocation } from "react-router";

const VERIFY_TOKEN = gql`
    query VerifyToken {
        verifyToken {
            _id
            firstName
            lastName
            netid
            majors
            college
            affiliation
            token
        }
    }
`;

const NewAuth = () => {
    // Get history & location from router; get samlProfile (profile object returned from saml) via state
    const history = useHistory();
    const location = useLocation();

    if (!location.state) {
        history.push("/login");
        return null;
    }

    const { data, loading, error } = useQuery(VERIFY_TOKEN);

    if (error) return <h2>Error.</h2>;
    if (loading) return <h2>Loading...</h2>;
    if (!data) return <h2>No data returned...</h2>;

    // Redirect to schedule
    return <Redirect to="/schedule" />;

    // // Run query against backend to authenticate user
    // const { data, loading, error } = useQuery(AUTHENTICATE_USER, {
    //     variables: { ticket: ticket },
    // });

    // if (error) return <Redirect to="login" />;
    // if (loading) return <LoadingScreen />;
    // if (!data) return <Redirect to="login" />;

    // let { netid, token, recentUpdate } = data.authenticateUser;

    // // Set token in local storage
    // localStorage.setItem("token", token);

    // // Set recent update in client state
    // return <Redirect to="schedule" />;
};

export default NewAuth;
