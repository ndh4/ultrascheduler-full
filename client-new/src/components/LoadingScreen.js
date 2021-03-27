import React from "react";

import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const loadingTextOptions = [
    "eat. sleep. plan. repeat.",
    "time to hatch a plan.",
    "built with ❤️ by Will Mundy, Jamie Tan, David Torres-Ramos, Manan Bajaj, Max Bowman, Peter Wang, and Skylar Neuendorff",
];

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
}));

/**
 * Display a spinner with a random message while the data loads
 */
const LoadingScreen = () => {
    const classes = useStyles();

    // Randomly select one of the loading text options
    let selectedQuoteIdx = Math.floor(
        Math.random() * loadingTextOptions.length
    );
    let loadingText = loadingTextOptions[selectedQuoteIdx];

    return (
        <Backdrop className={classes.backdrop} open={true}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div>
                    <CircularProgress color="inherit" />
                </div>
                <h4>{loadingText}</h4>
            </div>
        </Backdrop>
    );
};

export default LoadingScreen;
