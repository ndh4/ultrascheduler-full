import { Schedule, ScheduleTC, UserTC, SessionTC, User } from "../models";
import { checkScheduleUserMatch } from "../utils/authorizationUtils";

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
ScheduleTC.addRelation("user", {
    resolver: () => UserTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.user,
    },
    projection: { user: 1 },
});

/**
 * Add relation for a nested field: https://github.com/graphql-compose/graphql-compose/issues/2
 * But the .getByPath(path) method doesn't exist anymore, so to get the TypeComposer of the nested field (in this case, "items")
 * We need to use .getFieldTC(path)
 */
const DraftSessionTC = ScheduleTC.getFieldTC("draftSessions");
DraftSessionTC.addRelation("session", {
    resolver: () => SessionTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.session,
    },
    projection: { session: 1 },
});

/**
 * Custom Resolvers
 */

/**
 * When a user requests their schedule for a term, this will find it or create it if it does not
 * already exist
 */
ScheduleTC.addResolver({
    name: "findOrCreate",
    type: ScheduleTC,
    args: ScheduleTC.getResolver("findOne").getArgs(),
    resolve: async ({ source, args, context, info }) => {
        let { term, user } = args.filter;

        // Find schedule for the term for the user
        let schedule = await Schedule.findOne({
            term: term,
            user: user,
        }).exec();

        // Return it if it exists
        if (schedule) return schedule;

        // Create if it doesn't exist
        return await Schedule.create({ term: term, user: user });
    },
});

/**
 * Used to find all schedules for a particular user
 */
ScheduleTC.addResolver({
    name: "findManyByUser",
    type: [ScheduleTC],
    args: { _id: "ID!", filter: ScheduleTC.getInputTypeComposer() },
    resolve: async ({ source, args, context, info }) => {
        let filter = { user: args._id };
        if (args.filter) {
            // For all fields in the filter, add them to our filter
            for (let key of Object.keys(args.filter)) {
                filter[key] = args.filter[key];
            }
        }
        return Schedule.find(filter);
    },
});

/**
 * Used to update the draft sessions for a schedule
 * Can either add or remove a session from their draft sessions
 */
ScheduleTC.addResolver({
    name: "scheduleUpdateDraftSessions",
    type: ScheduleTC,
    // day is an enum, so we want to get its enum from the model directly
    args: { scheduleID: "ID!", push: "Boolean", sessionID: "ID!" },
    resolve: async ({ source, args, context, info }) => {
        // Check that requested schedule and requesting user match
        let match = checkScheduleUserMatch(args.scheduleID, context.decodedJWT);
        if (!match) {
            throw Error("Decoded user and Schedule do not match!");
        }

        // This determines whether we add or remove from the array
        let operation = args.push ? "$addToSet" : "$pull";

        // Setup update based on operation
        let update = {};
        update[operation] = { draftSessions: { session: args.sessionID } };

        // Execute update
        const schedule = await Schedule.updateOne(
            { _id: args.scheduleID }, // find Vendor by id
            update
        );

        if (!schedule) return null;
        return Schedule.findById(args.scheduleID); // Finally return the new schedule object
    },
});

/**
 * Toggles the session visibility, given a schedule and a session ID
 */
ScheduleTC.addResolver({
    name: "scheduleToggleSession",
    type: ScheduleTC,
    args: { scheduleID: "ID!", sessionID: "ID!" },
    resolve: async ({ source, args, context, info }) => {
        // Check that requested schedule and requesting user match
        let match = checkScheduleUserMatch(args.scheduleID, context.decodedJWT);
        if (!match) {
            throw Error("Decoded user and Schedule do not match!");
        }

        let options = {
            upsert: false,
            new: true,
            arrayFilters: [{ "elem.session": args.sessionID }],
        };
        // Perform update
        await Schedule.updateOne(
            { _id: args.scheduleID },
            {
                $bit: {
                    "draftSessions.$[elem].visible": { xor: parseInt("1") },
                },
            },
            options
        );
        // Return schedule
        return await Schedule.findById(args.scheduleID);
    },
});

/**
 * Toggles the session visibility, given a schedule and a session ID
 */
 ScheduleTC.addResolver({
    name: "scheduleToggleTerm",
    type: ScheduleTC,
    args: { scheduleID: "ID!", sessionID: "ID!" },
    resolve: async ({ source, args, context, info }) => {
        // Check that requested schedule and requesting user match
        let match = checkScheduleUserMatch(args.scheduleID, context.decodedJWT);
        if (!match) {
            throw Error("Decoded user and Schedule do not match!");
        }

        let options = {
            upsert: false,
            new: true,
            arrayFilters: [{ "elem.session": args.sessionID }],
        };
        // Perform update
        await Schedule.updateOne(
            { _id: args.scheduleID },
            {
                $bit: {
                    "draftSessions.$[elem].visible": { xor: parseInt("1") },
                },
            },
            options
        );
        // Return schedule
        return await Schedule.findById(args.scheduleID);
    },
});

const ScheduleQuery = {
    scheduleOne: ScheduleTC.getResolver("findOrCreate", [authMiddleware]),
    scheduleMany: ScheduleTC.getResolver("findManyByUser")
};

const ScheduleMutation = {
    scheduleToggleSession: ScheduleTC.getResolver("scheduleToggleSession"),
    scheduleAddSession: ScheduleTC.getResolver(
        "scheduleUpdateDraftSessions"
    ).wrapResolve((next) => (rp) => {
        rp.args.push = true;
        return next(rp);
    }),
    scheduleRemoveSession: ScheduleTC.getResolver(
        "scheduleUpdateDraftSessions"
    ).wrapResolve((next) => (rp) => {
        rp.args.push = false;
        return next(rp);
    }),

    degreePlanAddTerm: ScheduleTC.getResolver("createOne"),
    degreePlanRemoveTerm: ScheduleTC.getResolver("removeOne"),

    degreePlanAddCourse: ScheduleTC.getResolver("createOne"),
    degreePlanRemoveCourse: ScheduleTC.getResolver("removeOne")
};

async function authMiddleware(resolve, source, args, context, info) {
    // Without header, throw error
    if (!context.decodedJWT) {
        throw new Error("You need to be logged in.");
    }

    let { uid } = context.decodedJWT;

    // Use the uid from the JWT to extract the user's _id
    const { _id } = await User.findOne({ uid });

    // Allows a user to only access THEIR schedules, while still maintaining any other filters from the request
    return resolve(
        source,
        { ...args, filter: { ...args.filter, user: _id } },
        context,
        info
    );
}

export { ScheduleQuery, ScheduleMutation };
