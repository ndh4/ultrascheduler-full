import React from "react";

import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

const LoadingScreen = () => {
    const classes = useStyles();
    return (
        <Backdrop className={classes.backdrop} open={true}>
            <div style={{ display: "block", justifyContent: 'center' }}>
                <div style={{ width: "25%", margin: '0 auto' }}>
                    <CircularProgress color="inherit" />
                </div>
                <h4>eat. sleep. plan. repeat.</h4>
            </div>
        </Backdrop>
    )
}

export default LoadingScreen;