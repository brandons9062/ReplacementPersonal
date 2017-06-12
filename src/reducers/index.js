import {combineReducers} from 'redux';
import {auth, handleAuthentication} from '../index';

const rootReducer = combineReducers({
    auth: auth,
    handleAuthentication: handleAuthentication
})

export default rootReducer;