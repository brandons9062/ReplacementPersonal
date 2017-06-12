import axios from 'axios';

export const AUTH_USER = 'auth_user';
export const AUTH_LOGOUT = 'auth_logout';

const ROOT_URL = "http://localhost:8080/";

export function authUser(){
    const request = axios.get(`${ROOT_URL}auth`)
}