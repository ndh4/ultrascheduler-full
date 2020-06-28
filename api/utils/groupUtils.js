import { GROUPME_ACCESS_TOKEN } from "../config";
import { StudyGroup, Session, User } from "../models";
import fetch from "node-fetch";

export const addMemberToGroup = (groupID, netid, phone) => {
	return fetch(
		`https://api.groupme.com/v3/groups/${groupID}/members/add?token=${GROUPME_ACCESS_TOKEN}`,
		{
			method: "POST",
			body: JSON.stringify({
				members: [
					{
						nickname: netid,
						phone_number: "+1 " + phone,
					},
				],
			}),
		}
	)
		.then((data) => {
			if (data.status >= 400) {
				return false;
			}

			return data.json().then((response) => {
				return true;
			});
		})
		.catch((err) => {
			if (err) throw Error("Couldn't add to group.");
		});
};

export const createGroup = (session, userID) => {
	const { course, crn, _id } = session;
    const { subject, courseNum } = course;
	return fetch(
		`https://api.groupme.com/v3/groups?token=${GROUPME_ACCESS_TOKEN}`,
		{
			method: "POST",
			body: JSON.stringify({
				name: `${subject} ${courseNum} - ${crn} Section`,
				description: `A study group for ${subject} ${courseNum}, Section ${crn} - courtesy of hatch.`,
				share: true,
			}),
		}
	)
		.then((data) => {
			return data.json().then(async (r) => {
                let groupId = r.response.group_id;

                let user = await User.findById(userID);

                // Now add the user that triggered this creation
                addMemberToGroup(groupId, user.netid, user.phone);

				// Create corresponding mongoose object
				return StudyGroup.create({
					groupId: r.response.group_id,
					session: _id,
					members: [userID],
				});
			});
		})
		.catch((err) => {
            console.log(err);
			if (err) throw Error("Couldn't create group.");
		});
};
