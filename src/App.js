import './App.css'
import React, {Component} from 'react'
import {connect} from 'react-redux';
import Login from './components/Login';
import { Redirect } from 'react-router';
import { verifyRequest } from './actions/AuthActions';

const App = () => {
	return (
		<div>
			<p>I'm a private route.</p>
		</div>
	)
}

export default App;
