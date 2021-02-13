import { composeWithMongoose } from "graphql-compose-mongoose";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
require("../db");

/**
 * @todo: What other models do we need to import?
 */

var StudyGroupSchema = new Schema({
    /**
     * @todo: What fields do we need here?
     */
});

export const StudyGroup = mongoose.model("studygroups", StudyGroupSchema);
export const StudyGroupTC = composeWithMongoose(StudyGroup);
