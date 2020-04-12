import './index.css'

import React, { Component } from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './components/Routes'

import { ConnectedRouter } from 'connected-react-router'

// Import store
import configureStore, { history } from './configureStore';

const store = configureStore({});

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <Routes />
            </div>
        </ConnectedRouter>
    </Provider>, 
    document.querySelector('#app')
)
