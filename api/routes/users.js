import { User } from '../models/UserModel';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const getUser = async (req) => {
	// Check user
	let { id, netid } = req.user;

	// Get corresponding user object
	let user = await User.findById(id);

	return user;
}

router.put('/update', async (req, res, next) => {
	let user = await getUser(req);

	await User.updateOne({ _id: user._id }, req.body, (err, updated) => {
		res.sendStatus(200);
	})
})

module.exports = router;