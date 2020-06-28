import React, { useEffect, useState } from "react";

import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

/**
 * Display a spinner with a random message while the data loads
 */
const LoadingScreen = () => {
    const [loadingText, setLoadingText] = useState("");
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
	const classes = useStyles();

	useEffect(() => {
		// Randomly select one of the loading text options
		let selectedQuoteIdx = Math.floor(
			Math.random() * loadingTextOptions.length
		);
		setLoadingText(loadingTextOptions[selectedQuoteIdx]);
	});

	return (
		<Backdrop className={classes.backdrop} open={true}>
			<div style={{ display: "block", justifyContent: "center" }}>
				<div style={{ width: "25%", margin: "0 auto" }}>
					<CircularProgress color="inherit" />
				</div>
				<h4>{loadingText}</h4>
			</div>
		</Backdrop>
	);
};

export default LoadingScreen;
