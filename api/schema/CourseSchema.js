import { Course, CourseTC, Session, SessionTC } from '../models';
import { toInputObjectType } from 'graphql-compose';

// Create a field NOT on the mongoose model; easy way to fetch schedule for a user in one trip
CourseTC.addFields({
    sessions: [SessionTC],
});

CourseTC.addRelation("sessions", {
    "resolver": () => SessionTC.getResolver('findMany'),
    args: { filter: SessionTC.getInputTypeComposer() },
    prepareArgs: {
        filter: (source) => ({
            course: source._id
        }),
    },
    projection: { session: 1 }
});

CourseTC.addResolver({
    name: "findManyInSubject",
    type: [CourseTC],
    args: { subject: "String!", ascending: "Boolean!" },
    resolve: async ({ source, args, context, info }) => {
        // -(field) puts into descending order
        let sortParam = args.ascending ? "courseNum" : "-courseNum";
        return await Course.find({ subject: args.subject }).sort(sortParam);
    }
})

const CourseQuery = {
    courseOne: CourseTC.getResolver('findOne'),
    courseMany: CourseTC.getResolver('findMany'),
    courseManyInSubject: CourseTC.getResolver('findManyInSubject')
};

const CourseMutation = {
    courseCreateOne: CourseTC.getResolver('createOne')
};

export { CourseQuery, CourseMutation };