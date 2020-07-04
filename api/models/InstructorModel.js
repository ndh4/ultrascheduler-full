import { composeWithMongoose } from "graphql-compose-mongoose";

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

require("../db");

var InstructorSchema = new Schema({
  WEBID: String,
  firstName: String,
  lastName: String,
});

export const Instructor = mongoose.model("instructors", InstructorSchema);
export const InstructorTC = composeWithMongoose(Instructor);
