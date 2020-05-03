import { all, call, put, takeLeading, takeLatest, take, select, fork } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUESTED, GET_SERVICE, SAVE_SERVICE, SET_RECENT_UPDATE, SEEN_RECENT_UPDATE_SUCCESS, SEEN_RECENT_UPDATE_REQUEST } from '../actions/AuthActions';
import { ADD_COURSE_REQUEST, REMOVE_COURSE_REQUEST, TOGGLE_COURSE_REQUEST, SET_SCHEDULE } from '../actions/CoursesActions';
import { history } from '../configureStore';
import { sessionToDraftCourse } from '../utils/SessionUtils';

// import Api from '...'

const config = {
    loginURL: "https://idp.rice.edu/idp/profile/cas/login",
    token: ''
    // serviceURL: "http://localhost:3001/auth",
    // backendURL: "http://localhost:3000"
}

const fetchCurrentService = () => {
    return fetch("/api/deploy/service")
    .then(response => {
        return response.text().then(text => {
            return text;
        })
    })
}

const sendTicket = (ticket) => {
    return fetch("/api/auth/login", {
        method: "GET",
        headers: {
            'X-Ticket': ticket
        }
    }).then(response => {
        return response.json().then(body => {
            return { token: body.token, user: body.user };
        })
    })
}

const verifyToken = (token) => {
    return fetch("/api/auth/verify", {
        method: "GET",
        headers: {
            'X-Token': token
        }
    }).then(response => {
        return response.json().then(body => {
            return { verificationStatus: body.success, user: body.user };
            // return body.success;
        })
    })
}

const addCourseToSchedule = ({ sessionID, term }) => {
    let body = {
        term: term,
        sessionID: sessionID,
    };
    return fetch("/api/users/addCourse", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'Bearer ' + config.token,
            'Content-Type': "application/json"
        }
    }).then(response => {
        return;
    }).catch(error => {
        console.log("Error.");
        return;
    })
}

const removeCourseFromSchedule = ({ sessionID, term }) => {
    let body = {
        term: term,
        sessionID: sessionID
    };
    return fetch("/api/users/removeCourse", {
        method: "DELETE",
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'Bearer ' + config.token,
            'Content-Type': "application/json"
        }
    }).then(response => {
        return;
    }).catch(error => {
        console.log("Error.");
        return;
    })
}

const toggleCourse = ({ sessionID, term }) => {
    let body = {
        term: term,
        sessionID: sessionID
    };
    return fetch("/api/users/toggleCourse", {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'Bearer ' + config.token,
            'Content-Type': "application/json"
        }
    }).then(response => {
        return;
    }).catch(error => {
        console.log("Error.");
    })
}

const fetchSchedule = (term) => {
    return fetch("/api/users/schedule?term=" + term, {
        headers: {
            'Authorization': 'Bearer ' + config.token,
            'Content-Type': "application/json"
        },
    }).then(response => {
        return response.json().then(body => {
            return body;
        })
    })
}

const seenRecentUpdate = ({}) => {
    let body = {
        recentUpdate: false
    };
    return fetch("/api/users/update", {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'Bearer ' + config.token,
            'Content-Type': "application/json"
        },
    }).then(response => {
        return;
    }).catch(error => {
        console.error(error);
    });
}

function* getService(action) {
    try {
        let serviceURL = yield call(fetchCurrentService);

        yield put({ type: SAVE_SERVICE, service: serviceURL });
    } catch (e) {
        yield put({ type: "GET_SERVICE_URL_FAILED", message: e.message });
    }
}

function* loginRequest(action) {
    try {
        const state = yield select();

        // Redirect to Rice IDP
        let redirectURL = config.loginURL + "?service=" + state.auth.service;
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
        let success;
        try {
            success = yield call(sendTicket, ticket);
        } catch (e) {
            yield call(history.push, "/error");
            yield put({ type: LOGIN_FAILURE, message: e.message });
        }

        // Extract from success
        let { token, user } = success;

        // Save token to config
        config.token = token;

        // Set token in local storage
        localStorage.setItem('token', token);

        yield put({ type: LOGIN_SUCCESS });
        yield put({ type: SET_RECENT_UPDATE, recentUpdate: user.recentUpdate });

        // Get current term
        // For now we just have one so we'll hardcode this
        let term = state.courses.term;

        // Load schedule
        let schedule = yield call(fetchSchedule, term);

        // Transform schedule into draftCourses
        let draftCourses = [];
        for (let course of schedule) {
            draftCourses.push(sessionToDraftCourse(course.session, course.detail, term, course.visible));
        }

        yield put({ type: SET_SCHEDULE, draftCourses });

        // Finally redirect them to schedule
        yield call(history.push, "/schedule");

    } catch (e) {
        yield put({ type: "LOGIN_REQUEST_FAILED", message: e.message });
    }
}

function* verifyRequest(action) {
    try {
        // Get state
        const state = yield select();

        // Get token
        let token = yield localStorage.getItem('token');

        // Send token to backend for verification
        let { verificationStatus, user } = yield call(verifyToken, token);

        if (verificationStatus) {
            // Store token in config
            config.token = token;

            // Set to logged in
            yield put({ type: LOGIN_SUCCESS });
            yield put({ type: SET_RECENT_UPDATE, recentUpdate: user.recentUpdate });

            // Get current term
            // For now we just have one so we'll hardcode this
            let term = state.courses.term;

            // Load schedule
            let schedule = yield call(fetchSchedule, term);

            console.log("Inside verify, pre schedule");
            console.log(schedule);

            // Transform schedule into draftCourses
            let draftCourses = [];
            for (let course of schedule) {
                console.log(course);
                draftCourses.push(sessionToDraftCourse(course.session, course.detail, term, course.visible));
            }

            yield put({ type: SET_SCHEDULE, draftCourses });

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

function* addCourseRequest(action) {
    try {
        // Extract sessionID from course object
        let sessionID = action.course.sessionID;
        let term = action.course.term;

        // Send course to backend; don't wait 
        yield fork(addCourseToSchedule, { sessionID, term } );

        // Add course on frontend
        yield put({ type: "ADD_COURSE", course: action.course });
    } catch (e) {
        yield put({ type: "ADD_COURSE_REQUEST_FAILED", message: e.message });
    }
}

function* removeCourseRequest(action) {
    try {
        let { sessionID, term } = action.course;

        // Send sessionID to remove to backend
        yield fork(removeCourseFromSchedule, { sessionID: sessionID, term: term });

        // Remove course on frontend
        yield put({ type: "REMOVE_COURSE", sessionID: sessionID });
    } catch(e) {
        yield put({ type: "REMOVE_COURSE_REQUEST_FAILED", message: e.message });
    }
}

function* toggleCourseRequest(action) {
    try {
        let { sessionID, term } = action.course;

        // Send sessionID to toggle to backend; don't wait
        yield fork(toggleCourse, { sessionID, term });

        // Toggle course on frontend
        yield put({ type: "TOGGLE_COURSE", sessionID: sessionID });
    } catch(e) {
        yield put({ type: "TOGGLE_COURSE_REQUEST_FAILED", message: e.message })
    }
}

function* seenRecentUpdateRequest(action) {
    try {
        yield call(seenRecentUpdate, {});

        yield put({ type: SEEN_RECENT_UPDATE_SUCCESS })
    } catch(e) {
        yield put({ type: "SEEN_RECENT_UPDATE_FAILED", message: e.message })
    }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* serviceWatcher() {
    yield takeLatest(GET_SERVICE, getService);
}

function* loginWatcher() {
    yield takeLatest(LOGIN_REQUESTED, loginRequest);
}

function* verifyWatcher() {
    yield takeLatest("VERIFY_REQUESTED", verifyRequest);
}

function* authenticateWatcher() {
    yield takeLatest("AUTHENTICATE_REQUESTED", authenticateRequest);
}

function* addCourseWatcher() {
    yield takeLatest(ADD_COURSE_REQUEST, addCourseRequest);
}

function* removeCourseWatcher() {
    yield takeLatest(REMOVE_COURSE_REQUEST, removeCourseRequest);
}

function* toggleCourseWatcher() {
    yield takeLatest(TOGGLE_COURSE_REQUEST, toggleCourseRequest);
}

function* seenRecentUpdateWatcher() {
    yield takeLeading(SEEN_RECENT_UPDATE_REQUEST, seenRecentUpdateRequest);
}

export default function* rootSaga() {
    yield all([
        serviceWatcher(),
        loginWatcher(),
        authenticateWatcher(),
        verifyWatcher(),
        addCourseWatcher(),
        removeCourseWatcher(),
        toggleCourseWatcher(),
        seenRecentUpdateWatcher()
    ])
};