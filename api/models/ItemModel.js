import { composeWithMongoose } from "graphql-compose-mongoose";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
require("../db");

/**
 * @todo: What other models do we need to import?
 */
import { Course } from "./CourseModel";

const SUBJECTS = ["LSAT","MCAT","GRE","VCAT", "AP", "SAT/ACT","GMAT","MAT","DAT", "OAT"]

var ItemSchema = new Schema({
    /**
     * @todo: What fields do we need here?
     */
    title: { type: String, required: true },
    version: { type: String, required: false },
    year: { type: Number, required: false },
    courses: [{ type: Schema.Types.ObjectId, ref: Course, required: false }],
    subject: {type: String, enum: SUBJECTS, required: false},
    author: String,
    //temporary
    type: { type: String, enum: ["Digital", "Hardcopy", "Hardware", "Other"] },
    isbn: { type: Number, required: false },
});

export const Item = mongoose.model("items", ItemSchema);
export const ItemTC = composeWithMongoose(Item);
