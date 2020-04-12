import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';

import { loginRequest } from "../actions/AuthActions";

const Login = ({ loginRequestD }) => (
        <li style = {{display:"inline"}}>
            <button onClick={() => loginRequestD()}>Meme</button>
        </li>
)

export default connect(
    (state) => ({
        
    }),
    (dispatch) => {
        return ({
            loginRequestD: () => dispatch(loginRequest()),
        });
    },
)(Login);