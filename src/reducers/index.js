import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {auth, handleAuthentication} from '../index';
import UsersReducer from './usersReducer';
//import LoggedIn from './loggedInReducer';

const rootReducer = combineReducers({
    users: UsersReducer,
    form: formReducer
})

export default rootReducer;