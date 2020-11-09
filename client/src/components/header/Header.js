import React from "react";
import Title from "./Title";
import { Button } from "@material-ui/core";
import ReactGA from "react-ga";
import { useMediaQuery } from "react-responsive";

import RiceAppsLogo from "../../riceappslogo.png";
import { initGA, OutboundLink } from "../../utils/analytics";
import { useHistory, useLocation } from "react-router";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import Select from "react-select";

import "./Header.global.css";

const GET_LOCAL_DATA = gql`
    query GetLocalData {
        term @client
    }
`;

const termOptions = [
    { label: "Summer 2020", value: 202030 },
    { label: "Fall 2020", value: 202110 },
    { label: "Spring 2021", value: 202120 },
];

const formatTerm = (term) => termOptions.filter(termOption => termOption.value == term)[0];

// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";

function Header() {
    const history = useHistory();
    const client = useApolloClient();
    const location = useLocation();

    // Get the term
    let { data: storeData } = useQuery(GET_LOCAL_DATA);
    let { term } = storeData;

    // Where we collect feedback

    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-device-width: 608px)",
    });

    let feedbackURL = "https://forms.gle/6uyRuTxKgP3n53vB6";
    let logoutURL = "https://idp.rice.edu/idp/profile/cas/logout";

    // This initializes Google Analytics
    initGA();

    // Redirects people to our Medium page on a new page if they click our logo to learn more about us
    const handleLogoClick = () => {
        OutboundLink(
            "Clicked Logo.",
            window.open("https://medium.com/riceapps", "_blank")
        );
    };
    const handleLogoutClick = async () => {
        // Sign out of firebase first
        await firebase.auth().signOut();
        // Sign out of IDP too
        window.open(logoutURL, "_self");
    };
    const handleTermChange = (newTermObject) =>
        client.writeQuery({
            query: GET_LOCAL_DATA,
            data: { term: newTermObject.value },
        });

    return (
        <div className="headerContainer">
            <div className="logoContainer">
                <img
                    src={RiceAppsLogo}
                    // style={styles.logo}
                    onClick={() => handleLogoClick()}
                />
            </div>
            <div className="titleContainer">
                <Title />
            </div>
            <div className="buttonsContainer">
                <Button
                    variant="outlined"
                    style={
                        isDesktopOrLaptop
                            ? styles.logoutButton
                            : styles.logoutMobile
                    }
                    onClick={() => location.pathname == "/about" ? history.push("/schedule") : history.push("/about") }
                >
                    {location.pathname == "/about" ? "Schedule" : "About" }
                </Button>
                <Button
                    variant="outlined"
                    style={
                        isDesktopOrLaptop
                            ? styles.logoutButton
                            : styles.logoutMobile
                    }
                    onClick={() => handleLogoutClick()}
                >
                    Log Out
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => window.open(feedbackURL, "_blank")}
                >
                    Feedback?
                </Button>
                <div className="select">
                    <Select
                        value={formatTerm(term)}
                        onChange={handleTermChange}
                        options={termOptions}
                    />
                </div>
            </div>
        </div>
    );
}

const styles = {
    logo: {
        float: "left",
        marginTop: "-70px",
        marginLeft: "2vw",
        width: "5%",
        height: "5%",
    },
    logoutButton: {
        marginRight: ".5vw",
    },
    wrapper: {
        textAlign: "right",
        width: "95%",
        marginTop: "-50px",
    },
    logoutMobile: {
        float: "left",
        marginLeft: "12vw",
        marginTop: "-50px",
    },
};

export default Header;
