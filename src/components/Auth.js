import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';

import { authenticateRequest } from "../actions/AuthActions";

const Auth = ({ authenticateRequest }) => {
    console.log("Inside auth component");
    
    authenticateRequest();

    return (
        <p>Wait...</p>
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