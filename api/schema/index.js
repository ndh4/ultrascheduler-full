import { SchemaComposer } from 'graphql-compose';

require('../db'); 

const schemaComposer = new SchemaComposer();

import { UserQuery, UserMutation } from './UserSchema';
import { SessionQuery, SessionMutation } from './SessionSchema';
import { CourseQuery, CourseMutation } from './CourseSchema';
import { InstructorQuery, InstructorMutation } from './InstructorSchema';
import { ScheduleQuery, ScheduleMutation } from './ScheduleSchema';

schemaComposer.Query.addFields({
    ...UserQuery,
    ...SessionQuery,
    ...CourseQuery,
    ...InstructorQuery,
    ...ScheduleQuery
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...SessionMutation,
    ...CourseMutation,
    ...InstructorMutation,
    ...ScheduleMutation
});

schemaComposer.Subscription.addFields({
    
})

export default schemaComposer.buildSchema();