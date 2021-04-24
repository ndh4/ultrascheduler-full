import { composeWithMongoose } from "graphql-compose-mongoose";
import { Course } from "./CourseModel";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
require("../db");

/**
 * @todo: What other models do we need to import?
 */
import { Session } from "./SessionModel";
import {User} from "./UserModel";

const GRADE_TYPES = ['Letter', 'P/F', 'U/S']
const GRADES = ['AP','A','AM','BP','B','BM','CP','C','CM','DP','D','DM','F','Pass','Fail','U','S']
const WORK_TYPES = ['Exam', 'Essay', 'Problem Set', 'Presentation', 'Reading', 'Projects']
const MOTIVES = ['Major', 'Distribution','Elective']
const QUALITIES = ['Excellent', 'Good', 'Average', 'Fair', 'Poor']
const COURSE_TAGS = ['Organized', 'Interesting', 'Challenging', 'Blow off', 'Time consuming',
                    'GPA Destroyer', 'Fairly Graded', 'Unfairly Graded', 'Theory based', 'Application based']

var CourseReviewSchema = new Schema({
    /**
     * @todo: What fields do we need here?
     */
    course: { type: Schema.Types.ObjectId, ref: Course, required: true},
    // session: { type: Schema.Types.ObjectId, ref: Session, required: true },
    //add term + instructor
    user: { type: Schema.Types.ObjectId, ref: User, required: true },
    major: {type: [String], required: true},
    year: { type: Number, required: true },  
    gradeType: {type: String, enum: GRADE_TYPES, required: false},
    grade: {type: String, enum: GRADES, required: false},
    priorKnowledge: Number,
    workloadType: {type: [String], enum: WORK_TYPES, required: false},
    workload: Number,
    quality: {type: String, enum: QUALITIES, required: false},
    motive: {type: String, enum: MOTIVES, required: true},
    tags: {type: [String], enum: COURSE_TAGS, required: false},
    comment: String,
});

export const CourseReview = mongoose.model("courseReviews", CourseReviewSchema);
export const CourseReviewTC = composeWithMongoose(CourseReview);