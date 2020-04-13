import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';

import { authenticateRequest } from "../actions/AuthActions";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

const Auth = ({ authenticateRequest }) => {
    const classes = useStyles();
    console.log("Inside auth component");
    
    authenticateRequest();

    return (
        <Backdrop className={classes.backdrop} open={true}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default connect(
    (state) => ({
        
    }),
    (dispatch) => {
        return ({
            authenticateRequest: () => dispatch(authenticateRequest()),
        });
    },
)(Auth);