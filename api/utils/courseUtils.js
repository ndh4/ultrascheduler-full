import { Session } from '../models/index';

const _sortSubjects = (subjects) => {
	return subjects.sort((a, b) => {
		if (a > b) {
			return 1;
		} else {
			return -1;
		}
	})
}

/**
 * Return unique list of all subjects (COMP, APPL, etc)
 */
export const getSubjects = async (term) => {
	if (term == "") {
		throw Error("No term specified.");
	}

	let subjects = Session.collection.aggregate([
		{ $match: { "term": parseInt(term) } },
		{
			$lookup: {
				from: "courses",
				localField: "course",
            	foreignField: "_id",
           		as: "course"
			}
		},
		{ $unwind: "$course" },
		{
			$group: {
				_id: "$course.subject"
			}
		}
    ]);
    
	return subjects.toArray().then(result => {
		// Concat together
		result = result.map(obj => obj._id);
		result = _sortSubjects(result);
		return result;
	})
}
