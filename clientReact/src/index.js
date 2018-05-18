import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './redux/reducer';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
    .then(registration => {
        console.log(`Service Worker registered! Scope: ${registration.scope}`);
    })
    .catch(err => {
        console.log(`Service Worker registration failed: ${err}`);
    });
}


const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk, logger())));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
