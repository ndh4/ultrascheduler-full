import { combineReducers } from 'redux'
import CoursesReducer from './CoursesReducer'

import { connectRouter } from 'connected-react-router'
import AuthReducer from './AuthReducer';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    courses: CoursesReducer,
    auth: AuthReducer
});

export default createRootReducer;