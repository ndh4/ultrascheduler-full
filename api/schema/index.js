import { SchemaComposer } from "graphql-compose";

require("../db");

const schemaComposer = new SchemaComposer();

import { UserQuery, UserMutation } from "./UserSchema";
import { SessionQuery, SessionMutation } from "./SessionSchema";
import { CourseQuery, CourseMutation } from "./CourseSchema";
import { InstructorQuery, InstructorMutation } from "./InstructorSchema";
import { ScheduleQuery, ScheduleMutation } from "./ScheduleSchema";
import { AuthQuery, AuthMutation } from "./AuthSchema";
import {StudyGroupQuery, StudyGroupMutation} from "./StudyGroupSchema";

schemaComposer.Query.addFields({
    ...UserQuery,
    ...SessionQuery,
    ...CourseQuery,
    ...InstructorQuery,
    ...ScheduleQuery,
    ...AuthQuery,
    ...StudyGroupQuery,
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...SessionMutation,
    ...CourseMutation,
    ...InstructorMutation,
    ...ScheduleMutation,
    ...AuthMutation,
    ...StudyGroupMutation,
});

schemaComposer.Subscription.addFields({});

export default schemaComposer.buildSchema();
