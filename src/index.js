import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import promise from 'redux-promise';
import style from './index.css';

import reducers from './reducers';
import NavBar from './NavBar';
import MainGame from './MainGame';
import Stats from './Stats';
//import Auth from './Auth/Auth';
//import Callback from './Callback';
import SignIn from './SignIn';

//export const auth = new Auth()
//
//export const handleAuthentication = (nextState, replace) => {
//    if(/access_token\id_token\error/.test(nextState.location.hash)){
//        auth.handleAuthentication()
//    }
//}

//<Route path='/callback' render={(props) => {
//                            handleAuthentication(props);
//                            return <Callback {...props} />
//                        }} />

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div className="mainContainer">
                <NavBar />
                <Switch>
                    <Route path='/signin' component={SignIn} />
                    <Route path='/stats' component={Stats} />
                    <Route path='/' component={MainGame} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));