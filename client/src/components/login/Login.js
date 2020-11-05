import React from "react";
import { Button } from "@material-ui/core";
import { useQuery, gql, useApolloClient } from "@apollo/client";

// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import { useHistory } from "react-router";

const Login = () => {
    // Get history object for redirection to auth page
    const history = useHistory();

    // This is the function that redirects the user to the SAML login
    const signInSAML = async () => {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const provider = new firebase.auth.SAMLAuthProvider("saml.rice-shibboleth");
        const loginResult = await firebase.auth().signInWithPopup(provider);
        const userToken = await firebase.auth().currentUser.getIdToken(true);
        history.push("/handleSignIn", { profile: loginResult.additionalUserInfo.profile, token: userToken });
    };

    /* By default, Firebase will redirect back to this particular URL
	after a successful login; so we handle the redirection here for now. However,
	I would recommend moving this to another endpoint (for example, '/auth'), which
	can be done by adding a redirection configuration setting back in step 2.
	*/
    // firebase
    //     .auth()
    //     .getRedirectResult()
    //     .then((result) => {
    //         // we receive the result of the SAML login from the redirection, and result.user contains the information we want on the user!
    //         if (result.user) {
    //             console.log(result.additionalUserInfo);
    //             console.log(result.user);
    //             // another way to handle redirection is automatically redirect upon receiving result.user object
    //             // navigate('/auth', { state: { user: result.user } });
    //         }
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                position: "relative",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FBFBFB",
            }}
        >
            <div style={{ display: "inline-block", color: "#272D2D" }}>
                <h2>the app formerly known as schedule planner</h2>
                <h4>brought to you by riceapps</h4>
            </div>
            <div style={{ position: "absolute", marginTop: "75px" }}>
                <Button
                    variant="outlined"
                    style={{ color: "#272D2D", textTransform: "none" }}
                    onClick={signInSAML}
                >
                    enter
                </Button>
            </div>
        </div>
    );
};

// const config = {
//     loginURL: "https://idp.rice.edu/idp/profile/cas/login",
// };

// const GET_SERVICE_URL = gql`
// 	query GetServiceUrl {
// 		service
// 	}
// `;

// const Login = () => {
//     const { data, loading, error } = useQuery(GET_SERVICE_URL, { fetchPolicy: "cache-and-network" });
//     const client = useApolloClient();

//     if (loading) return <p>Loading...</p>;

//     // Directly writes the service url to the cache
//     client.writeQuery({
//         query: gql`
//             query GetService {
//                 service
//             }
//         `,
//         data: { service: data.service },
//     });

//     // Handles click of login button
//     const handleClick = () => {
//         // Redirects user to the CAS login page
//         let redirectURL = config.loginURL + "?service=" + data.service;
//         window.open(redirectURL, "_self");
//     }

//     return (
//         <div style={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative', textAlign: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: "#FBFBFB" }}>
//             <div style={{ display: "inline-block", color: "#272D2D" }}>
//                 <h2>the app formerly known as schedule planner</h2>
//                 <h4>brought to you by riceapps</h4>
//             </div>
//             <div style={{ position: 'absolute', marginTop: '75px' }}>
//                 <Button variant="outlined" style={{ color: "#272D2D", textTransform: "none" }} onClick={handleClick}>enter</Button>
//             </div>
//         </div>
//     )
// }

export default Login;
