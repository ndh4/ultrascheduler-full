import React from "react";
import Title from "./Title";
import { Button } from "@material-ui/core";
import ReactGA from "react-ga";

import RiceAppsLogo from "../riceappslogo.png";
import { initGA, OutboundLink } from "../utils/analytics";

function Header() {
    let feedbackURL = "https://forms.gle/6uyRuTxKgP3n53vB6";

    initGA();

    const handleLogoClick = () => {
        OutboundLink("Clicked Logo.", window.open("https://medium.com/riceapps", "_blank"));
    }

    return (
        <div style={{ display: "float" }}>
            <div style={{ textAlign: "center" }}>
                <Title />
                <img 
                src={RiceAppsLogo}
                style={{ float: "left", marginTop: "-70px", marginLeft: "2vw", width: "5%", height: "5%" }}
                onClick={() => handleLogoClick()} 
                />
                <Button 
                variant="outlined" 
                style={{ float: "right", marginTop: "-50px", marginRight: "2vw" }}
                onClick={() => window.open(feedbackURL, "_blank")}>
                Feedback?
                </Button>
            </div>
        </div>
    );
}

export default Header;