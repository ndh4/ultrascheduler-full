import './index.css'

import React, { Component } from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './components/Routes'

import { ConnectedRouter } from 'connected-react-router'

// Import store
import configureStore, { history } from './configureStore';

// Setup Toast for Notifications
import { ToastProvider } from 'react-toast-notifications'

const store = configureStore({});

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <ToastProvider>
                <div>
                    <Routes />
                </div>
            </ToastProvider>
        </ConnectedRouter>
    </Provider>, 
    document.querySelector('#app')
)
