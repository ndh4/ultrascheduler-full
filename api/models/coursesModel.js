var mongoose = require('mongoose')
    , Schema = mongoose.Schema

require('../db')

const Instructor = require("../models/instructorsModel").instructor;

var ClassSchema = new Schema({
    startTime: String,
    endTime: String, 
    days: [ { type: String, enum: ['M', 'T', 'W', 'R', 'F', 'S', 'U']}]
})

var LabSchema = new Schema({
    startTime: String,
    endTime: String, 
    days: [ { type: String, enum: ['M', 'T', 'W', 'R', 'F', 'S', 'U']}]
})

var RestrictionSchema = new Schema({
    type: String,
    setting: { type: String, enum: ['I', 'E'] }, // Only inclusive or exclusive
    params: [String]
})

// var TermSchema = new Schema({
//     term: String,
//     sessions: [ { type: Schema.Types.ObjectId, ref: Session } ]
// })

var CourseSchema = new Schema({
    subject: String,
    courseNum: Number,
    longTitle: String,
    creditsMin: Number,
    creditsMax: Number,
    restrictions: [ { type: RestrictionSchema } ],
    prereqs: String,
    coreqs: [ String ],
    mutualExclusions: [ String ],
    distribution: String
    // terms: [ TermSchema ],
});

var Course = mongoose.model("courses", CourseSchema);

var SessionSchema = new Schema({
    class: ClassSchema,
    lab: LabSchema,
    crosslistCourses: [{ type: Schema.Types.ObjectID, ref: Course }],
    crn: Number, 
    term: Number, // such as: "202010", "202120", etc.
    enrollment: Number,
    maxEnrollment: Number,
    crossEnrollment: Number,
    maxCrossEnrollment: Number,
    waitlisted: Number,
    maxWaitlisted: Number,
    course: {type: Schema.Types.ObjectID, ref: Course},
    instructors: [{type: Schema.Types.ObjectID, ref: Instructor}]
})

var Session = mongoose.model("sessions", SessionSchema);

exports.course = Course;
exports.session = Session;