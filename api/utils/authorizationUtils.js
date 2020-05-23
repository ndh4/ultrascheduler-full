import { Schedule } from "../models";

export const checkScheduleUserMatch = (scheduleID, decodedJWT) => {
    // If no JWT exists for this request, then throw error
    if (!decodedJWT) {
        throw Error("Bearer token needed for this operation.");
    }
    
    // Extract user id and netid from the decoded JWT
    let { id: userID, netid } = decodedJWT;

    // Check that this schedule belongs to this user
    let exists = Schedule.exists({ scheduleID: scheduleID, user: userID });
    if (!exists) {
        // Schedule and user do not match, return false
        return false;
    }
    return true;
}