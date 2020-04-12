import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';

import { loginRequest } from "../actions/AuthActions";
import { Button } from "@material-ui/core";

const Login = ({ loginRequest }) => (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: "inline-block" }}>
            <h3>the app formerly known as schedule planner</h3>
            <h5>brought to you by riceapps</h5>
        </div>
        <div style={{ position: 'absolute', marginTop: '75px' }}>
            <Button variant="outlined" onClick={() => loginRequest()}>Enter</Button>
        </div>
    </div>
)

export default connect(
    (state) => ({
        
    }),
    (dispatch) => {
        return ({
            loginRequest: () => dispatch(loginRequest()),
        });
    },
)(Login);