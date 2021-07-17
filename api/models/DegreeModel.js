import { composeWithMongoose } from "graphql-compose-mongoose";
import { Instructor } from "./InstructorModel";
import { Schedule } from "./ScheduleModel";
import { Session } from "./SessionModel";
import { User } from "./UserModel";

require("../db");

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var DegreeSchema = new Schema({
    user: { type: Schema.Types.ObjectID, ref: User },              // User Information
    session: { type: Schema.Types.ObjectID, ref: Session },        // Course Session
    instructor: { type: Schema.Types.ObjectID, ref: Instructor },  // Instructor Information
    termFromScheduleModel: { type: Schema.Types.ObjectID, ref: Schedule },
    
    // Credits can be calculated from the coursemodel

    customCourse: String,          // TextArea for custom course
    userNotes: String              // Where does this go?
});

export const Degree = mongoose.model("degreePlanner", DegreeSchema);
export const DegreeTC = composeWithMongoose(Degree);
