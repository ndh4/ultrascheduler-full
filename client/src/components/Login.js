import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';

import { loginRequest } from "../actions/AuthActions";
import { Button } from "@material-ui/core";

const Login = ({ loginRequest }) => (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative', textAlign: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: "#FBFBFB" }}>
        <div style={{ display: "inline-block", color: "#272D2D" }}>
            <h2>the app formerly known as schedule planner</h2>
            <h4>brought to you by riceapps</h4>
        </div>
        <div style={{ position: 'absolute', marginTop: '75px' }}>
            <Button variant="outlined" style={{ color: "#272D2D", textTransform: "none" }} onClick={() => loginRequest()}>enter</Button>
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