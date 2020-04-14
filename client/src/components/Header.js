import React from "react";
import Title from "./Title";
import { Button } from "@material-ui/core";

function Header() {
    let feedbackURL = "https://forms.gle/6uyRuTxKgP3n53vB6";
    return (
        <div style={{ display: "float" }}>
            <div style={{ textAlign: "center" }}>
                <Title />
                <Button 
                variant="outlined" 
                style={{ float: "right", marginTop: "-10vh", marginRight: "2vw" }}
                onClick={() => window.open(feedbackURL, "_blank")}>
                Feedback?
                </Button>
            </div>
        </div>
    );
}

export default Header;