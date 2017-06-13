import {CONFIRM_USER, LOGOUT_USER} from '../actions';

export default function(state = {}, action){
    switch (action.type){
        case CONFIRM_USER:
            return "true"
        case LOGOUT_USER:
            return "false"
        default:
            return state;
    }
}