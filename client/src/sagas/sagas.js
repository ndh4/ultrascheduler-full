import { all, call, put, takeEvery, takeLatest, take, select, fork } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_REQUESTED, GET_SERVICE, SAVE_SERVICE } from '../actions/AuthActions';
import { ADD_COURSE_REQUEST, REMOVE_COURSE_REQUEST, TOGGLE_COURSE_REQUEST, SET_SCHEDULE } from '../actions/CoursesActions';
import { history } from '../configureStore';
import { sessionToDraftCourse } from '../utils/searchResultUtils';

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
            return body.token;
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
            return body.success;
        })
    })
}

const addCourseToSchedule = ({ courseID, sessionID, term }) => {
    let body = {
        term: term,
        sessionID: sessionID,
        courseID: courseID
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
        let token;
        try {
            token = yield call(sendTicket, ticket);
            // Save token to config
            config.token = token;
        } catch (e) {
            yield call(history.push, "/error");
            yield put({ type: LOGIN_FAILURE, message: e.message });
        }

        yield put({ type: LOGIN_SUCCESS });

        // Set token in local storage
        localStorage.setItem('token', token);

        // Get current term
        // For now we just have one so we'll hardcode this
        let term = "Fall 2020";

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
        // Get token
        let token = yield localStorage.getItem('token');

        // Send token to backend for verification
        let verificationStatus = yield call(verifyToken, token);

        if (verificationStatus) {
            // Store token in config
            config.token = token;

            // Set to logged in
            yield put({ type: LOGIN_SUCCESS });

            // Get current term
            // For now we just have one so we'll hardcode this
            let term = "Fall 2020";

            // Load schedule
            let schedule = yield call(fetchSchedule, term);

            // Transform schedule into draftCourses
            let draftCourses = [];
            for (let course of schedule) {
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
        let courseID = action.course.courseID;
        let sessionID = action.course.sessionID;
        let term = action.course.term;

        // Send course to backend; don't wait 
        yield fork(addCourseToSchedule, { courseID, sessionID, term } );

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

export default function* rootSaga() {
    yield all([
        serviceWatcher(),
        loginWatcher(),
        authenticateWatcher(),
        verifyWatcher(),
        addCourseWatcher(),
        removeCourseWatcher(),
        toggleCourseWatcher()
    ])
};