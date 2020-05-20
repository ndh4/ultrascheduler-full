import { User, UserTC, ScheduleTC } from '../models';

// Create a field NOT on the mongoose model; easy way to fetch schedule for a user in one trip
UserTC.addRelation("schedules", {
    "resolver": () => ScheduleTC.getResolver("findManyByUser"),
    prepareArgs: {
        _id: (source) => source._id,
    },
    projection: { schedules: 1 }
});

const UserQuery = {
    userOne: UserTC.getResolver('findOne')
};

const UserMutation = {
    userCreateOne: UserTC.getResolver('createOne')
};

export { UserQuery, UserMutation };