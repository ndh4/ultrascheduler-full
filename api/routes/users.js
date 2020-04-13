const User = require("../models/usersModel").user;
const Course = require("../models/coursesModel").course;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const getUser = async (req) => {
	// Check user
	let { id, netid } = req.user;

	console.log(id);

	// Get corresponding user object
	let user = await User.findById(id);

	return user;
}

const populateSchedule = async (schedule) => {
	let courses = [];
	// Get all sessionIDs 
	for (let sparseCourseObj of schedule.courses) {
		let { sessionID, courseID, visible } = sparseCourseObj;
		let returnObject = {
			sessionID,
			courseID,
			visible,
			term: schedule.term,
		};

		// Query specific course
		let queriedCourse = await Course.findById(courseID);
		returnObject.courseName = queriedCourse.subject + " " + queriedCourse.courseNum;
		returnObject.longTitle = queriedCourse.longTitle;

		// Query specific session
		let queriedSession = await Course.collection.find({ "terms.sessions._id": mongoose.Types.ObjectId(sessionID)}, {"terms.sessions.$": true})
		returnObject.detail = await queriedSession.toArray();
		// Recreate:
		/*
		crn: session.crn,
		courseName:  detail.subject + " " + detail.courseNum,
		longTitle: detail.longTitle,
		instructors: session.instructors,
		sessionID: session._id,
		courseID: detail._id,
		term: detail.terms[0].term, 
		visible: true,
		*/
		console.log(returnObject);
		courses.push(returnObject);
	}
	return courses;
}

/* GET users listing. */
router.get('/schedule', async (req, res, next) => {
	// Get user from request 
	let user = await getUser(req);

	// Get term from query param
	let queryTerm = req.query.term;

	// Send their schedule(s)
	if (queryTerm == "") {
		// Return all
		res.send(400); // No term specified
		return;
	} else {
		for (let schedule of user.schedules) {
			if (schedule.term == queryTerm) {
				// Populate schedule
				let populatedSchedule = await populateSchedule(schedule);
				res.json(populatedSchedule);
				return;
			}
		}
		res.send(400);
	}
});

router.get('/', (req, res, next) => {
	User.find({}).then(users => {
		console.log(users);
		res.send(users);
	})
})

router.post("/addCourse", async (req, res, next) => {
	// Get user from request
	let user = await getUser(req);

	// Get or create user schedule corresponding to desired term
	let existingScheduleIdx = -1;
	for (let idx in user.schedules) {
		let schedule = user.schedules[idx];
		if (schedule.term == req.body.term) {
			existingScheduleIdx = idx;
		}
	}

	if (existingScheduleIdx > -1) {
		// Add to existing schedule
		user.schedules[existingScheduleIdx].courses.push({ courseID: req.body.courseID, sessionID: req.body.sessionID, visible: true });
	} else {
		// Create new schedule object
		user.schedules.push({
			term: req.body.term,
			courses: [ { courseID: req.body.courseID, sessionID: req.body.sessionID, visible: true } ]
		});
	}

	// Save the updated schedule
	user.save();

	res.send(200);
})

router.delete("/removeCourse", async (req, res, next) => {
	// Get user from request
	let user = await getUser(req);

	// Get user schedule corresponding to desired term (or return error)
	let existingScheduleIdx = -1;
	for (let idx in user.schedules) {
		let schedule = user.schedules[idx];
		if (schedule.term == req.body.term) {
			existingScheduleIdx = idx;
		}
	}

	if (existingScheduleIdx > -1) {
		// Remove from existing schedule
		let updatedSchedule = user.schedules[existingScheduleIdx].courses.filter(courseObj => courseObj.sessionID != req.body.sessionID);
		user.schedules[existingScheduleIdx].courses = updatedSchedule;
	} else {
		// No such term to remove from
		res.send(404);
	}

	// Save the updated schedule
	user.save();

	res.send(200);
})

router.put("/toggleCourse", async (req, res, next) => {
	// Get user from request
	let user = await getUser(req);

	// Get user schedule corresponding to desired term (or return error)
	let existingScheduleIdx = -1;
	for (let idx in user.schedules) {
		let schedule = user.schedules[idx];
		if (schedule.term == req.body.term) {
			existingScheduleIdx = idx;
		}
	}

	if (existingScheduleIdx > -1) {
		// Toggle from existing schedule
		let updatedSchedule = user.schedules[existingScheduleIdx].courses.map(courseObj => {
			if (courseObj.sessionID == req.body.sessionID) {
				// Toggle visibility
				courseObj.visible = !courseObj.visible;
			}
			return courseObj;
		});
		user.schedules[existingScheduleIdx].courses = updatedSchedule;
	} else {
		// No such term to toggle in
		res.send(404);
	}

	// Save the updated schedule
	user.save();

	res.send(200);
})

// /* POST users listing. */
// router.post('/schedule', async (req, res, next) => {
// 	// Check user
// 	let { id, netid } = req.user;

// 	// Get corresponding user object
// 	let user = await User.findById(id);

// 	// POST their schedule
// 	let schedule = req.body.schedule;

// 	// Send their schedule(s)
// 	if (req.params.s == "") {
// 		// Return all
// 		res.json(user.schedules);
// 	} else {
// 		if (req.params.s < user.schedules.length) {
// 			res.json(user.schedules[req.params.s]);
// 		} else {
// 			res.status(400);
// 		}
// 	}
// });

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

// router.post('/create', async (req, res, next) => {
//     let user = await User.create({
// 		netid: req.body.netid,
// 		firstName: req.body.firstName,
// 		lastName: req.body.lastName,
// 		majors: req.body.majors,
// 		token: ""
//     });

//   	res.json(user);
// })

module.exports = router;
