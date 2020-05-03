export const LOGIN_REQUESTED = "LOGIN_REQUESTED";
export const VERIFY_REQUESTED = "VERIFY_REQUESTED";
export const AUTHENTICATE_REQUESTED = "AUTHENTICATE_REQUESTED";
export const VERIFY_TICKET = "VERIFY_TICKET";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export const LOGIN_REQUEST_FAILED = "LOGIN_REQUEST_FAILED";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const VERIFY_REQUEST_FAILED = "VERIFY_REQUEST_FAILED";

export const GET_SERVICE = "GET_SERVICE";
export const SAVE_SERVICE = "SAVE_SERVICE";

export const SET_RECENT_UPDATE = "SET_RECENT_UPDATE";
export const SEEN_RECENT_UPDATE = "SEEN_RECENT_UPDATE";

export const getService = () => {
    return {
        type: GET_SERVICE
    };
}

export const loginRequest = () => {
    return ({
        type: LOGIN_REQUESTED
    });
}

export const authenticateRequest = () => {
    return ({
        type: AUTHENTICATE_REQUESTED
    });
}

export const verifyRequest = () => {
    return ({
        type: VERIFY_REQUESTED
    });
}

export const seenRecentUpdate = () => {
    return ({
        type: SEEN_RECENT_UPDATE
    });
}
