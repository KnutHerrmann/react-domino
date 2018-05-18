import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './redux/reducer';


const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk, logger())));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
