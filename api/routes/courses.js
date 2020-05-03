const Course = require("../models/coursesModel").course;
const Instructor = require("../models/instructorsModel").instructor;
const Session = require("../models/coursesModel").session;

var express = require("express");
var router = express.Router();

router.get("/getSingleCourse", (req, res, next) => {
	let querySubject = req.query.subject;
	let queryCourseCode = req.query.code;
	Course.find({ subject: querySubject.toUpperCase(), courseNum: queryCourseCode })
		.populate({ path: "terms.sessions", populate: { path: "instructors" } })
		.exec((err, course) => {
			if (err) {
				res.json("ERROR!");
			} else {
				res.json(course);
			}
		});
});

router.get("/getCoursesBySubject", (req, res, next) => {
	let querySubject = req.query.subject;
	Course.find({ subject: querySubject.toUpperCase() })
		.populate({ path: "terms.sessions", populate: { path: "instructors" } })
		.exec((err, course) => {
			if (err) {
				res.json("ERROR!");
			} else {
				res.json(course);
			}
		});
});

/**
 * Return unique list of all subjects (COMP, APPL, etc)
 */
router.get("/getAllSubjects", (req, res, next) => {
	// Gets all unique values of the subject field
	Course.collection.distinct("subject")
	.then((uniqueSubjects) => {
		// Return the array
		res.json(uniqueSubjects);
	})
});

router.get("/getCoursesByTerm", (req, res, next) => {
	let queryTerm = req.query.term;
	let courses = Course.collection.aggregate([
		{ $match: {"terms.term": queryTerm}},
		{ $project: {
			subject: '$subject',
			courseNum: '$courseNum',
			longTitle: '$longTitle',
			terms: {$filter: {
				input: '$terms',
				as: 'termObject',
				cond: {$eq: ['$$termObject.term', queryTerm]}
			}}
		}},
		{
			$lookup: {
				from: "sessions",
				localField: "terms.sessions",
            	foreignField: "_id",
           		as: "terms.sessions"
			}
		},
		{
			$unwind: "$terms.sessions",
		},
		{
			$lookup: {
				from: "instructors",
				localField: "terms.sessions.instructors",
				foreignField: "_id",
				as: "terms.sessions.instructors"
			}
		},
		{
			$unwind: {
				path: "$terms.sessions",
				preserveNullAndEmptyArrays: true
			}
		}
	]);
	courses.toArray().then(courses => {
		res.json(courses);
	});
});

router.get("/getCoursesByInstructor", async (req, res, next) => {
	let queryInstructorFName = req.query.firstname;
	let queryInstructorLName = req.query.lastname;
	// Find the corresponding instructor 
	let queryInstructor = await Instructor.findOne({ "firstName": queryInstructorFName, "lastName": queryInstructorLName });
	console.log(queryInstructor);
	let courses = Course.collection.aggregate([
		{ $match: {"terms.sessions.instructors": queryInstructor._id } },
		{ $project: {
			subject: '$subject',
			courseNum: '$courseNum',
			longTitle: '$longTitle',
			terms: {$map: {
				input: '$terms',
				as: 'terms',
				in: {
					term: '$$terms.term',
					sessions: {
						$filter: {
							input: {$map: {
								input: '$$terms.sessions',
								as: 'sessions',
								in: {$cond: [
									{$in: [queryInstructor._id, '$$sessions.instructors']},
									{
										_id: "$$sessions._id",
										crn: "$$sessions.crn",
										class: "$$sessions.class",
										lab: "$$sessions.lab",
										instructors: "$$sessions.instructors"
									},
									false
								]}
							}},
							as: 'ssn',
							cond: '$$ssn'
						}
					}
				}
			}
		}}},
		{
			$lookup: {
				from: "sessions",
				localField: "terms.sessions",
            	foreignField: "_id",
           		as: "terms.sessions"
			}
		},
		{
			$unwind: "$terms.sessions",
		},
		{
			$lookup: {
				from: "instructors",
				localField: "terms.sessions.instructors",
				foreignField: "_id",
				as: "terms.sessions.instructors"
			}
		},
		{
			$unwind: {
				path: "$terms.sessions",
			}
		},
	]);

	courses.toArray().then(courses => {
		res.json(courses);
	});
	return;
});

router.get("/searchCourses", (req, res, next) => {
	let queryTerm = req.query.term;
	let querySubject = req.query.subject ? req.query.subject : "";
	let courses = Course.collection.aggregate([
		{ $match: {"terms.term": queryTerm, "subject":querySubject.toUpperCase()}},
		{ $project: {
			subject: '$subject',
			courseNum: '$courseNum',
			longTitle: '$longTitle',
			terms: {$filter: {
				input: '$terms',
				as: 'termObject',
				cond: {$eq: ['$$termObject.term', queryTerm]},
			}},
		}},
		{
			$lookup: {
				from: "sessions",
				localField: "terms.sessions",
            	foreignField: "_id",
           		as: "terms.sessions"
			}
		},
		{
			$unwind: "$terms.sessions",
		},
		{
			$lookup: {
				from: "instructors",
				localField: "terms.sessions.instructors",
				foreignField: "_id",
				as: "terms.sessions.instructors"
			}
		},
		// Sort before sending
		{
			$sort: {
				courseNum: 1
			}
		}
	]);
	courses.toArray().then(courses => {
		res.json(courses);
	});
});

router.get("/newSearchCourses", (req, res, next) => {
	let queryTerm = req.query.term;
	let querySubject = req.query.subject;

	let sessions = Session.collection.aggregate([
		{ $match: { term: parseInt(queryTerm) } },
		{ $lookup: 
			{
				from: "courses",
				localField: "course",
				foreignField: "_id",
				as: "course"
			}
		},
		{ $unwind: "$course" },
		{ $match: { "course.subject": querySubject } },
		{
			$lookup: {
				from: "instructors",
				localField: "instructors",
				foreignField: "_id",
				as: "instructors"
			}
		},
		// Sort before sending
		{
			$sort: {
				"course.courseNum": 1
			}
		}
	])

	sessions.toArray().then(sessions => {
		res.json(sessions);
	})
})

module.exports = router;
