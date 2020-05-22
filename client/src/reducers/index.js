import { combineReducers } from 'redux'

import { connectRouter } from 'connected-react-router'
import AuthReducer from './AuthReducer';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    auth: AuthReducer
});

export default createRootReducer;