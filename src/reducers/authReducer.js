import _ from 'lodash';
import {AUTH_USER, AUTH_LOGOUT} from '../actions';

export default function(state = {}, action){
    switch(action.type){
        case AUTH_USER:
            return _.mapKeys(action.payload.data);
        case AUTH_LOGOUT:
            return _.mapKeys(action.payload.data);
        default:
            return state;
    }
}