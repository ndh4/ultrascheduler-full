import { all, call, put, takeEvery, takeLatest, take, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUESTED } from '../actions/AuthActions';
import { history } from '../configureStore';

// import Api from '...'

const config = {
    loginURL: "https://idp.rice.edu/idp/profile/cas/login",
    serviceURL: "http://localhost:3001/auth",
    backendURL: "http://localhost:3000"
}

const sendTicket = (ticket) => {
    return fetch(config.backendURL + "/auth/login", {
        method: "GET",
        headers: {
            'X-Ticket': ticket
        }
    }).then(response => {
        return response.json().then(body => {
            return body.token;
        })
    })
}

const verifyToken = (token) => {
    return fetch(config.backendURL + "/auth/verify", {
        method: "GET",
        headers: {
            'X-Token': token
        }
    }).then(response => {
        return response.json().then(body => {
            return body.success;
        })
    })
}

function* loginRequest(action) {
    try {
        // Redirect to Rice IDP
        let redirectURL = config.loginURL + "?service=" + config.serviceURL;
        window.open(redirectURL, "_self");
        // yield put(push('/meme'));
    } catch (e) {
        yield put({ type: "LOGIN_REQUEST_FAILED", message: e.message });
    }
}

function* authenticateRequest(action) {
    try {
        const state = yield select();

        // We've redirected back from Rice's IDP

        // Get current URL
        let ticket = state.router.location.query.ticket;
        
        if (!ticket) {
            console.log("Missing ticket!");
            // Redirect to login page
            yield call(history.push, "/login");
        }

        // Send ticket to backend
        let token;
        try {
            token = yield call(sendTicket, ticket);
            console.log("Received token");
        } catch (e) {
            yield call(history.push, "/error");
            yield put({ type: LOGIN_FAILURE, message: e.message });
        }

        console.log("About to set token");

        yield put({ type: LOGIN_SUCCESS });

        // Set token in local storage
        localStorage.setItem('token', token);

        // Finally redirect them to schedule
        yield call(history.push, "/schedule");

    } catch (e) {
        yield put({ type: "LOGIN_REQUEST_FAILED", message: e.message });
    }
}

function* verifyRequest(action) {
    console.log("In verify req.");
    try {
        // Get token
        let token = yield localStorage.getItem('token');

        // Send token to backend for verification
        let verificationStatus = yield call(verifyToken, token);

        if (verificationStatus) {
            // Set to logged in
            yield put({ type: LOGIN_SUCCESS });

            // Redirect to desired protected page
            yield call(history.push, history.location.pathname);
        } else {
            // Remove token bc it's not verified
            localStorage.removeItem('token');
            // Redirect to login
            yield call(history.push, "/login");
        }

    } catch (e) {
        yield put({ type: "VERIFY_REQUEST_FAILED", message: e.message });
    }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* loginWatcher() {
    yield takeLatest(LOGIN_REQUESTED, loginRequest);
}

function* verifyWatcher() {
    yield takeLatest("VERIFY_REQUESTED", verifyRequest);
}

function* authenticateWatcher() {
    yield takeLatest("AUTHENTICATE_REQUESTED", authenticateRequest);
}

export default function* rootSaga() {
    yield all([
        loginWatcher(),
        authenticateWatcher(),
        verifyWatcher(),
    ])
};