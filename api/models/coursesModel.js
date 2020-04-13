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

var SessionSchema = new Schema({
    class: ClassSchema,
    lab: LabSchema,
    crn: Number, 
    instructors: [{type: Schema.Types.ObjectID, ref: Instructor}]
})

var Session = mongoose.model("sessions", SessionSchema);

var TermSchema = new Schema({
    term: String,
    sessions: [ { type: Schema.Types.ObjectId, ref: Session } ]
})

var CourseSchema = new Schema({
    subject: String,
    courseNum: Number,
    longTitle: String,
    terms: [ TermSchema ],
});

var Course = mongoose.model("new_courses", CourseSchema);

exports.course = Course;
exports.session = Session;