import { Session } from "../models/index";

/**
 * Return unique list of all class time (0900, 1300, etc)
 */
export const getTime = async (term) => {
    if (term == "") {
        throw Error("No term specified.");
    }

    let startTimes = await Session.collection.distinct("class.startTime", {
        term: term,
    });

    let endTimes = await Session.collection.distinct("class.endTime", {
        term: term,
    });

    return startTimes.concat(endTimes);
};
