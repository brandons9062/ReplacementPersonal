import _ from 'lodash';
import {GET_USERS, GET_USER, LOGIN_USER, LOGOUT_USER, AUTH_USER} from '../actions';

export default function(state = {}, action){
    switch (action.type){
        case GET_USERS:
            return _.mapKeys(action.payload.data, 'id')
        case GET_USER:
            console.log(action.payload.data)
            return _.mapKeys(action.payload.data, 'id')
//        case LOGIN_USER:
//            return _.mapKeys(action.payload.data, 'id')
//        case LOGOUT_USER:
//            return action.payload
        case AUTH_USER:
            if(action.payload.data){
                return action.payload.data
            } else{
                return state
            }
            
        default:
            return state;
    }
}