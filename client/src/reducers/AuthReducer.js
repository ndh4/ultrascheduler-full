import * as ACTIONS from "../actions/AuthActions"

const defaultAuthReducerState = {
    loginRequesting: false,
    loggedIn: false,
    service: ''
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
            case ACTIONS.SAVE_SERVICE:
                return {...state, service: action.service};
            default:
                return {...state};
        }
}

export default AuthReducer;
