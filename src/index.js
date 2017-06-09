import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import promise from 'redux-promise';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import reducers from './reducers';
import NavBar from './NavBar';
import MainGame from './MainGame';
import Stats from './Stats';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div className="mainContainer">
                <NavBar />
                <Switch>
                    <Route path='/stats' component={Stats} />
                    <Route path='/' component={MainGame} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();