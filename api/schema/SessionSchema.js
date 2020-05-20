import { Session, SessionTC, CourseTC } from '../models';

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
SessionTC.addRelation("course", {
    "resolver": () => CourseTC.getResolver('findById'),
    prepareArgs: {
        _id: (source) => source.course,
    },
    projection: { course: 1 }
});

const SessionQuery = {
    sessionOne: SessionTC.getResolver('findOne')
};

const SessionMutation = {
    sessionCreateOne: SessionTC.getResolver('createOne')
};

export { SessionQuery, SessionMutation };