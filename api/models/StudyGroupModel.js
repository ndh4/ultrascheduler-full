import { composeWithMongoose } from 'graphql-compose-mongoose';
import { User } from './UserModel';
import { Session } from './SessionModel';

var mongoose = require('mongoose')
    , Schema = mongoose.Schema

require('../db')

var StudyGroupSchema = new Schema({
    groupId: String,
    session: { type: Schema.Types.ObjectId, ref: Session },
    members: [{ type: Schema.Types.ObjectId, ref: User }]
})

export const StudyGroup = mongoose.model("studygroups", StudyGroupSchema);
export const StudyGroupTC = composeWithMongoose(StudyGroup);