import axios from 'axios';

export const AUTH_USER = 'auth_user';
export const AUTH_LOGOUT = 'auth_logout';
export const GET_USERS = 'get_users';
export const GET_USER = 'get_user';
export const CONFIRM_USER = 'confirm_user';
export const LOGIN_USER = 'login_user';
export const LOGOUT_USER = 'logout_user';
export const ADD_POINTS_COINS = 'ADD_POINTS_COINS';

const ROOT_URL = "http://localhost:8080/";

export function authUser(){
    const request = axios.get(`${ROOT_URL}auth/me`)
    
    console.log(`My authUser returns: ${request.data}`)
    return {
        type: AUTH_USER,
        payload: request
    }
}

export function getUsers(){
    const request = axios.get(`${ROOT_URL}api/users`)
    
    return {
        type: GET_USERS,
        payload: request
    }
}

export function getUser(id){
    const request = axios.get(`${ROOT_URL}api/users/${id}`)
    
    return {
        type: GET_USER,
        payload: request
    }
}

export function loginUser(username, password){
    const request = axios.get(`${ROOT_URL}api/users/${username}/${password}`)
    
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = null
    
    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addUserPointsAndCoins(id, highscore, totalcoins){
    let data = {
        "highscore": highscore,
        "totalcoins": totalcoins
    }
    const request = axios.put(`${ROOT_URL}api/userupdate/${id}`, data)
    
    return {
        type: ADD_POINTS_COINS,
        payload: request
    }
}

//export function confirmUser(){
//    const request = "true";
//    
//    return {
//        type: CONFIRM_USER,
//        payload: request
//    }
//}
//
//export function logoutUser(){
//    const request = "true";
//    
//    return {
//        type: LOGOUT_USER,
//        payload: request
//    }
//}