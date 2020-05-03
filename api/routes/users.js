const User = require("../models/usersModel").user;
const Course = require("../models/coursesModel").course;
const Session = require("../models/coursesModel").session;
const Schedule = require("../models/schedulesModel").schedule;

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

const populateSchedule = async (schedule) => {
	let courses = [];
	// Get all sessionIDs 
	for (let draftSession of schedule.draftSessions) {
		let { session, visible } = draftSession;

		let queriedSession = await Session.findById(session).populate({ path: "instructors" }).populate({ path: "course" });

		courses.push({ session: queriedSession, detail: queriedSession.course, visible: draftSession.visible, term: schedule.term })
	}
	return courses;
}

const createEmptySchedule = async (user, queryTerm) => {
	// If no schedule found, create empty one
	let newScheduleInfo = {
		user: user._id,
		term: queryTerm,
		draftSessions: []
	};

	// Create new schedule object
	await Schedule.create(newScheduleInfo);

	return;
}

/* GET users listing. */
router.get('/schedule', async (req, res, next) => {
	// Get user from request 
	let user = await getUser(req);

	// Get term from query param
	let queryTerm = req.query.term;

	// Send their schedule(s)
	if (queryTerm == "") {
		res.sendStatus(400); // No term specified
		return;
	} else {
		// Search in schedule db for their schedules
		let schedule = await Schedule.findOne({ user: user._id, term: queryTerm });

		if (schedule) {
			// Populate schedule
			let populatedSchedule = await populateSchedule(schedule);
			res.json(populatedSchedule);
			return;
		} else {
			createEmptySchedule(user, queryTerm);

			// Speed things up, just send back empty array since that is all the sessions array has
			res.json([]);
			return;
		}
	}
});

router.post("/addCourse", async (req, res, next) => {
	// Get user from request
	let user = await getUser(req);

	// Filter for update operation
	let filter = { user: user._id, term: req.body.term };

	// Create update payload (which is just a new course)
	let draftSessionObject = { session: req.body.sessionID, visible: true }

	let update = { $push: { draftSessions: draftSessionObject } };

	// If schedule exists, add course to its sessions; otherwise, create schedule then add course
	try {
		await Schedule.findOneAndUpdate(filter, update, { upsert: true, new: true });
		res.sendStatus(200);
	} catch {
		res.sendStatus(500);
	}
	return;
})

router.delete("/removeCourse", async (req, res, next) => {
	// Get user from request
	let user = await getUser(req);

	// Filter for update operation
	let filter = { user: user._id, term: req.body.term };

	// Create update payload (which is just a new course)
	let update = { $pull: { draftSessions: { session: req.body.sessionID } } };

	// If schedule exists, remove course from its sessions; otherwise, do nothing (no sense in creating a schedule here)
	try {
		await Schedule.findOneAndUpdate(filter, update, { upsert: false, new: true });
		res.sendStatus(200);
	} catch {
		res.sendStatus(500);
	}
})

router.put("/toggleCourse", async (req, res, next) => {
	// Get user from request
	let user = await getUser(req);

	// Filter for update operation
	let filter = { user: user._id, term: req.body.term };

	// Create update payload (which is just a new course)
	let update = { $bit: { "draftSessions.$[elem].visible": { xor: parseInt("1") } } };

	let options = {
		upsert: false,
		new: true,
		arrayFilters: [ { "elem.session": req.body.sessionID } ]
	}

	// If schedule exists, toggle course in its sessions; otherwise, do nothing (no sense in creating a schedule here)
	try {
		await Schedule.findOneAndUpdate(filter, update, options);
		res.sendStatus(200);
	} catch (exception) {
		console.error(exception);
		res.sendStatus(500);
	}
	return;
})

router.get('/info', async (req, res, next) => {
	// Get id from JWT
	let {id, netid} = req.user;

	// Get corresponding user object
	let user = await User.findById(id);

	// Send it back
	res.json(user);
});

router.put('/logout', async (req, res, next) => {
	// Get id from JWT
	let { id, netid } = req.user;

	// Get corresponding user object
	let user = await User.findById(id);

	// Reset token
	user.token = "";
	await user.save();

	res.status(200);
});

router.delete('/deleteUser', (req, res, next) => {
	// Get id from JWT
	let {id, netid} = req.user;

	// Remove corresponding user object
	User.findByIdAndDelete(id)
		.exec((err, removed) => {
			res.status(200).send(removed);
		});
});

module.exports = router;
