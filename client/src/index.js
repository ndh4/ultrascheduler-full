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

// Import apollo client for graphql
import { client } from './apollo';
import { ApolloProvider } from '@apollo/client'

const store = configureStore({});

render(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <ToastProvider>
                    <Routes />
                </ToastProvider>
            </ConnectedRouter>
        </Provider>
    </ApolloProvider>, 
    document.querySelector('#app')
)
