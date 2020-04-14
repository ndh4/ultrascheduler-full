import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';

import { authenticateRequest } from "../actions/AuthActions";
import LoadingScreen from "./LoadingScreen";

const Auth = ({ authenticateRequest }) => {
    authenticateRequest();

    return (
        <LoadingScreen />
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