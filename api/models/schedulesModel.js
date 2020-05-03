var mongoose = require('mongoose')
    , Schema = mongoose.Schema

require('../db')

const Session = require("./coursesModel").session;
const User = require("./usersModel").user;

var DraftSessionSchema = new Schema({
    visible: { type: Number, enum: [0, 1] },
    session: { type: Schema.Types.ObjectID, ref: Session },
})

var ScheduleSchema = new Schema({
    term: { type: String },
    draftSessions: [ DraftSessionSchema ],
    user: { type: Schema.Types.ObjectID, ref: User }
})

var Schedule = mongoose.model("schedules", ScheduleSchema);

exports.schedule = Schedule;