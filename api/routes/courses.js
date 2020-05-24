import { Course, Instructor, Session } from '../models/index';

var express = require("express");
var router = express.Router();

const sortSubjects = (subjects) => {
	return subjects.sort((a, b) => {
		if (a > b) {
			return 1;
		} else {
			return -1;
		}
	})
}

/**
 * Return unique list of all subjects (COMP, APPL, etc)
 */
router.get("/getAllSubjects", (req, res, next) => {
	let queryTerm = req.query.term;

	if (queryTerm == "") {
		res.sendStatus(400);
		return;
	}

	let subjects = Session.collection.aggregate([
		{ $match: { "term": parseInt(queryTerm) } },
		{
			$lookup: {
				from: "courses",
				localField: "course",
            	foreignField: "_id",
           		as: "course"
			}
		},
		{ $unwind: "$course" },
		{
			$group: {
				_id: "$course.subject"
			}
		}
	]);

	subjects.toArray().then(result => {
		// Concat together
		result = result.map(obj => obj._id);
		result = sortSubjects(result);
		res.json(result);
	})
});

module.exports = router;
