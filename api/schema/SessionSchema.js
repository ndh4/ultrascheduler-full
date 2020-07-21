import { Session, SessionTC, CourseTC, InstructorTC } from "../models";

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
SessionTC.addRelation("course", {
    resolver: () => CourseTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.course,
    },
    projection: { course: 1 },
});

SessionTC.addRelation("instructors", {
    resolver: () => InstructorTC.getResolver("findByIds"),
    prepareArgs: {
        _ids: (source) => source.instructors,
    },
    projection: { instructors: 1 },
});

/**
 * Custom resolvers
 */

/**
 * @deprecated
 */
SessionTC.addResolver({
    name: "findByInstructor",
    type: [SessionTC],
    args: { _id: "ID!", filter: SessionTC.getInputTypeComposer() },
    resolve: async ({ source, args, context, info }) => {
        let filter = { instructors: { $in: [args._id] } };
        if (args.filter) {
            // For all fields in the filter, add them to our filter
            for (let key of Object.keys(args.filter)) {
                filter[key] = args.filter[key];
            }
        }
        return Session.find(filter);
    },
});

/**
 * @deprecated
 */
SessionTC.addResolver({
    name: "findByCourse",
    type: [SessionTC],
    args: { _id: "ID!", filter: SessionTC.getInputTypeComposer() },
    resolve: async ({ source, args, context, info }) => {
        let filter = { course: { $in: [args._id] } };
        if (args.filter) {
            // For all fields in the filter, add them to our filter
            for (let key of Object.keys(args.filter)) {
                filter[key] = args.filter[key];
            }
        }
        return Session.find(filter);
    },
});

/**
 * @deprecated
 */
SessionTC.addResolver({
    name: "findBySubject",
    type: [CourseTC],
    args: { subject: "String!", term: "String" },
    resolve: async ({ source, args, context, info }) => {
        let filter = { course: { $in: [args._id] } };
        if (args.term) {
            filter["term"] = args.term;
        }
        return Session.find(filter);
    },
});

// Find session through days
SessionTC.addResolver({
    name: "findByDays",
    type: [SessionTC],
    args: {
        days: SessionTC.getInputTypeComposer()
            .getFieldTC("class")
            .getFieldType("days"),
    },
    resolve: async ({ source, args, context, info }) => {
        let filter = {
            "class.days": args.days,
        };

        return await Session.find(filter);
    },
});

// Find session by start time
SessionTC.addResolver({
    name: "findByStartTime",
    type: [SessionTC],
    args: { startTime: "String!" },
    resolve: async ({ source, args, context, info }) => {
        let filter = { "class.startTime": args.startTime };
        return await Session.find(filter);
    },
});

// Find session through time interval
SessionTC.addResolver({
    name: "findByTimeInterval",
    type: [SessionTC],
    args: { startTime: "String!", endTime: "String!" },
    resolve: async ({ source, args, context, info }) => {
        let filter = {
            "class.startTime": { $gte: args.startTime },
            "class.endTime": { $lte: args.endTime },
        };
        return await Session.find(filter);
    },
});

// SessionTC.addResolver({
//     name: "findManyBySubjects",
//     type: [SessionTC],
//     args: { term: "String!", subject: "[String!]!", ascending: "Boolean" },
//     resolve: async ({ source, args, context, info }) => {
//         let sortOn = args.ascending ? "course.courseNum" : "-course.courseNum";
//         return Session.find({ term: args.term, course: { subject: { $in: args.subject } } }).sort(sortOn);
//     }
// })

const SessionQuery = {
    sessionOne: SessionTC.getResolver("findOne"),
    sessionMany: SessionTC.getResolver("findMany"),
    sessionsByCourse: SessionTC.getResolver("findByCourse"),
    sessionByDays: SessionTC.getResolver("findByDays"),
    sessionByStartTime: SessionTC.getResolver("findByStartTime"),
    sessionByTimeInterval: SessionTC.getResolver("findByTimeInterval"),
    // sessionManyBySubject: SessionTC.getResolver("findManyBySubjects"),
};

const SessionMutation = {
    sessionCreateOne: SessionTC.getResolver("createOne"),
};

export { SessionQuery, SessionMutation };
