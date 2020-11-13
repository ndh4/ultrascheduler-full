import { Session } from "../models/index";

var xml2js = require("xml2js");
var stripPrefix = require("xml2js").processors.stripPrefix;
import axios from "axios";

/**
 * Parser used for XML response by CAS
 */
const parser = new xml2js.Parser({
    tagNameProcessors: [stripPrefix],
    explicitArray: false,
});

const _sortSubjects = (subjects) => {
    return subjects.sort((a, b) => {
        if (a > b) {
            return 1;
        } else {
            return -1;
        }
    });
};

/**
 * Return unique list of all subjects (COMP, APPL, etc)
 */
export const getSubjects = async (term) => {
    if (term == "") {
        throw Error("No term specified.");
    }

    const { data } = await axios.get(
        "https://courses.rice.edu/courses/!SWKSCAT.info?action=DEPARTMENTS&term=" +
            String(term)
    );
    const parsed = await parser.parseStringPromise(data);
    let departments = parsed["DEPARTMENTS"]["DEPARTMENT"];
    departments = departments.map((department) => department["$"].code);
    return departments;
};

export const getInstructors = async (term) => {
    if (term == "") {
        throw Error("No term specified.");
    }

    const { data } = await axios.get(
        "https://courses.rice.edu/courses/!SWKSCAT.info?action=INSTRUCTORS&term=" +
            String(term)
    );

    const parsed = await parser.parseStringPromise(data);

    let instructors = parsed["INSTRUCTORS"]["INSTRUCTOR"];

    instructors = instructors.map((instructor) => {
        const firstName = instructor["$"]["first-name"];
        const lastName = instructor["$"]["last-name"];
        return {
            firstName,
            lastName,
        };
	});
	
    return instructors;
};

// export const getSubjects = async (term) => {
//     if (term == "") {
//         throw Error("No term specified.");
//     }

//     let subjects = Session.collection.aggregate([
//         { $match: { term: parseInt(term) } },
//         {
//             $lookup: {
//                 from: "courses",
//                 localField: "course",
//                 foreignField: "_id",
//                 as: "course",
//             },
//         },
//         { $unwind: "$course" },
//         {
//             $group: {
//                 _id: "$course.subject",
//             },
//         },
//     ]);

//     return subjects.toArray().then((result) => {
//         // Concat together
//         result = result.map((obj) => obj._id);
//         result = _sortSubjects(result);
//         return result;
//     });
// };

export const getPreviousTermCourses = async (term) => {
    const { data } = await axios.get(
        "https://esther.rice.edu/selfserve/!swkscmp.ajax?p_data=COURSES&p_term=" +
            String(term - 100)
    );
    const parsed = await parser.parseStringPromise(data);
    let courses = parsed["COURSES"]["COURSE"];
    courses = courses.map((course) => course["$"]);
    return courses;
};
