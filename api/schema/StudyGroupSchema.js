import {
	StudyGroup,
	StudyGroupTC,
	UserTC,
	SessionTC,
	User,
	Session,
} from "../models";
import { createGroup, addMemberToGroup } from "../utils/groupUtils";
import mongoose from "mongoose";
import { ShowGroupResponseTC } from "../models/ShowGroupModel";
import fetch from "node-fetch";
import { GROUPME_ACCESS_TOKEN } from "../config";

/**
 * Add the response from GroupMe as a virtual field
 */
StudyGroupTC.addFields({
	groupData: {
		type: ShowGroupResponseTC,
		resolve: async (source, args, context, info) => {
			// Fetch using groupme show API call
			const response = await fetch(
				`https://api.groupme.com/v3/groups/${source.groupId}?token=${GROUPME_ACCESS_TOKEN}`
			);

			// Transform to JSON
			const responseJSON = await response.json();

			// Return response field of JSON
			return responseJSON.response;
		},
	},
});

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */
StudyGroupTC.addRelation("members", {
	resolver: () => UserTC.getResolver("findByIds"),
	prepareArgs: {
		_ids: (source) => source.members,
	},
	projection: { members: 1 },
});

StudyGroupTC.addRelation("session", {
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
 * GroupMe-related resolvers
 */

/**
 * Create Group
 * @deprecated NOt sure about this one
 */

/**
 * Retrieve Group
 */

/**
 * Add member to group
 */
StudyGroupTC.addResolver({
	name: "updateMembers",
	type: StudyGroupTC,
	args: { studyGroupID: "MongoID!", userID: "MongoID", push: "Boolean" },
	resolve: async ({ source, args, context, info }) => {
		const { studyGroupID, userID, push } = args;

		// Get Study Group ID
		const { groupId, session, members } = await StudyGroup.findById(
			studyGroupID
		);

		// Check that user is not already a member of the group
		// if (members.includes(userID)) throw Error("User already in group.");

		const { netid, phone } = await User.findById(userID);

		// Send actual membership request to GroupMe API
		const success = await addMemberToGroup(groupId, netid, phone);

		if (!success) throw Error("Something went wong.");

		// Upon success, actually add user to our local database
		let operation = push ? "$addToSet" : "$pull";

		let update = {};
		update[operation] = { members: userID };

		const studyGroup = await StudyGroup.updateOne(
			{ _id: studyGroupID },
			update
		);

		if (!studyGroup) return null;

		return StudyGroup.findById(args.studyGroupID);
	},
});

StudyGroupTC.addResolver({
	name: "create",
	type: StudyGroupTC,
	args: { accessToken: "String!", sessionID: "MongoID!" },
	resolve: async ({ source, args, context, info }) => {
		let { accessToken, sessionID } = args;

		// First check if group exists
		let exists = await StudyGroup.exists({ session: sessionID });
		if (exists) throw Error("Group already exists for this section.");

		let session = await Session.findById(sessionID).populate("course");

		// Otherwise create group
		let createdGroup = await createGroup(session, accessToken);

		return createdGroup;
	},
});

// Using auth middleware for sensitive info: https://github.com/graphql-compose/graphql-compose-mongoose/issues/158
const StudyGroupQuery = {
	myGroups: StudyGroupTC.getResolver("findMany", [queryAuthMiddleware]),
	getGroup: StudyGroupTC.getResolver("findOne"),
	getGroups: StudyGroupTC.getResolver("findMany"),
	// userOne: UserTC.getResolver("findOne", [authMiddleware]),
};

const StudyGroupMutation = {
	addMemberToGroup: StudyGroupTC.getResolver("updateMembers", [
		mutationAuthMiddleware,
	]).wrapResolve((next) => (rp) => {
		rp.args.push = true;
		return next(rp);
	}),
	removeMemberFromGroup: StudyGroupTC.getResolver("updateMembers", [
		mutationAuthMiddleware,
	]).wrapResolve((next) => (rp) => {
		rp.args.push = false;
		return next(rp);
	}),
	createGroup: StudyGroupTC.getResolver("create", [mutationAuthMiddleware]),
};

async function queryAuthMiddleware(resolve, source, args, context, info) {
	// Without header, throw error
	if (!context.decodedJWT) {
		throw new Error("You need to be logged in.");
	}

	let { id } = context.decodedJWT;

	// Allows a user to only access THEIR user object
	return resolve(source, { ...args, filter: { members: id } }, context, info);
}

async function mutationAuthMiddleware(resolve, source, args, context, info) {
	// Without header, throw error
	if (!context.decodedJWT) {
		throw new Error("You need to be logged in.");
	}

	let { id } = context.decodedJWT;

	// Allows a user to only access THEIR user object
	return resolve(source, { ...args, userID: id }, context, info);
}

export { StudyGroupQuery, StudyGroupMutation };
