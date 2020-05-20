import { Schedule, ScheduleTC, UserTC, SessionTC } from '../models';

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
ScheduleTC.addRelation("user", {
    "resolver": () => UserTC.getResolver('findById'),
    prepareArgs: {
        _id: (source) => source.user,
    },
    projection: { user: 1 }
});

/**
 * Add relation for a nested field: https://github.com/graphql-compose/graphql-compose/issues/2
 * But the .getByPath(path) method doesn't exist anymore, so to get the TypeComposer of the nested field (in this case, "items")
 * We need to use .getFieldTC(path)
 */
const DraftSessionTC = ScheduleTC.getFieldTC("draftSessions");
DraftSessionTC.addRelation("session", {
    "resolver": () => SessionTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.session
    },
    projection: { session: 1 }
});

const ScheduleQuery = {
    scheduleOne: ScheduleTC.getResolver('findOne')
};

const ScheduleMutation = {
    scheduleCreateOne: ScheduleTC.getResolver('createOne')
};

export { ScheduleQuery, ScheduleMutation };