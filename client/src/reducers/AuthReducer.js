import * as ACTIONS from "../actions/AuthActions"

const defaultAuthReducerState = {
    loginRequesting: false,
    loggedIn: false,
}

const AuthReducer = (state=defaultAuthReducerState, action) => {
        switch (action.type) {
            case ACTIONS.LOGIN_REQUESTED:
                console.log("Request reached reducer.");
                return {...state, loginRequesting: true};
            case ACTIONS.LOGIN_SUCCESS:
                console.log("Successful Login recorded.");
                return {...state, loginRequesting: false, loggedIn: true};
            case ACTIONS.LOGIN_FAILURE:
                return {...state, loginRequesting: false, loggedIn: false};
            case ACTIONS.LOGIN_REQUEST_FAILED:
                return {...state, loginRequesting: false};
            default:
                return {...state};
        }
}

export default AuthReducer;
