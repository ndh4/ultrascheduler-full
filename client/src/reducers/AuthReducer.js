import * as ACTIONS from "../actions/AuthActions"

const defaultAuthReducerState = {
    loginRequesting: false,
    loggedIn: false,
    service: 'https://hatch.riceapps.org/auth',
    recentUpdate: false
}

const AuthReducer = (state=defaultAuthReducerState, action) => {
        switch (action.type) {
            case ACTIONS.LOGIN_REQUESTED:
                return {...state, loginRequesting: true};
            case ACTIONS.LOGIN_SUCCESS:
                return {...state, loginRequesting: false, loggedIn: true};
            case ACTIONS.LOGIN_FAILURE:
                return {...state, loginRequesting: false, loggedIn: false};
            case ACTIONS.LOGIN_REQUEST_FAILED:
                return {...state, loginRequesting: false};
            case ACTIONS.SAVE_SERVICE:
                return {...state, service: action.service};
            case ACTIONS.SET_RECENT_UPDATE:
                // Set recent update based on received state
                return {...state, recentUpdate: action.recentUpdate }
            case ACTIONS.SEEN_RECENT_UPDATE:
                // After a user has acknowledged the update, we don't want to continue showing it to them
                return {...state, recentUpdate: false }
            default:
                return {...state};
        }
}

export default AuthReducer;
