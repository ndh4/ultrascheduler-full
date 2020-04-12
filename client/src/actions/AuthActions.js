export const LOGIN_REQUESTED = "LOGIN_REQUESTED";
export const VERIFY_REQUESTED = "VERIFY_REQUESTED";
export const AUTHENTICATE_REQUESTED = "AUTHENTICATE_REQUESTED";
export const VERIFY_TICKET = "VERIFY_TICKET";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export const LOGIN_REQUEST_FAILED = "LOGIN_REQUEST_FAILED";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const VERIFY_REQUEST_FAILED = "VERIFY_REQUEST_FAILED";

export const loginRequest = () => {
    console.log("Login requested.");
    return ({
        type: LOGIN_REQUESTED
    });
}

export const authenticateRequest = () => {
    console.log("Authenticate requested.");
    return ({
        type: AUTHENTICATE_REQUESTED
    });
}

export const verifyRequest = () => {
    console.log("Verify requested.");
    return ({
        type: VERIFY_REQUESTED
    });
}
