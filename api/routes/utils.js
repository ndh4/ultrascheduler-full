const Course = require("../models/coursesModel").course;
const Instructor = require("../models/instructorsModel").instructor;
const Session = require("../models/coursesModel").session;

var BIGJSON = require("../python_scripts/output8.json");

var jsonToSchema = async (jsonObj) => {
    // https://stackoverflow.com/questions/40102372/find-one-or-create-with-mongoose 
    
    console.time("json");
    process.send("Started task!");
    // Iterate through each course code in the json
    let sessionBulkUpdates = [];
    let courseBulkUpdates = [];
    for (let courseCode in jsonObj) {
            // create course object for this key
            // inside each course code, we want to extract each term
            // Split course code
            let courseArr = courseCode.split(" ");
            let subject = courseArr[0];
            let courseNum = courseArr[1];
            let courseObject = await Course.findOne({ "subject": subject, "courseNum": courseNum });
            let includedSessions = [];
            
            let newObject = false;

            // If none found, create it
            if (!courseObject) {
                process.send("new object!");
                courseObject = await Course.create({
                    subject: subject,
                    courseNum: courseNum
                });
                newObject = true;
            } else {
                // Can retrieve sessions
                try {
                    includedSessions = courseObject.terms.sessions;
                } catch {
                    includedSessions = [];
                }
            }

            // Sync course object using first session object
            let firstSession = jsonObj[courseCode]["Fall 2020"][0];

            // // Find corresponding coreqs
            // let coreqRefs = [];
            // for (let coreqCode of firstSession["coreqs"]) {
            //     // Split into subject, coursenum
            //     let { coreqSubj, coreqNum } = coreqCode.split(" ");
            //     let coreqCourse = await Course.findOne({ subject: coreqSubj, courseNum: coreqNum });
            //     coreqRefs.push(coreqCourse._id);
            // }

            let filter = { subject: subject, courseNum: courseNum };

            let courseSingleUpdate = {
                // Honestly add the name here too
                "creditsMin": firstSession["credits_low"],
                "creditsMax": firstSession["credits_high"],
                "restrictions": firstSession["restrictions"],
                "prereqs": firstSession["prereqs"],
                "coreqs": firstSession["coreqs"],
                "mutualExclusions": firstSession["mutual_exclusives"],
                "distribution": firstSession["distribution"]
            }

            // Create updator document
            let courseUpdator = {
                updateOne: {
                    filter: filter,
                    update: { $set: courseSingleUpdate },
                    upsert: false
                }
            }

            courseBulkUpdates.push(courseUpdator);

            if (courseBulkUpdates.length > 100) {
                let copy = courseBulkUpdates.slice();
                Course.bulkWrite(copy, (err, res) => {
                    if (err) {
                        console.log(err);
                        process.exit();
                    }
                    process.send("Num courses attempted: " + copy.length);
                    process.send("Num courses finished: " + res.matchedCount);
                });

                courseBulkUpdates = [];
            }

            // Retrieve ID from course object
            let courseID = courseObject._id;

            for (let termStr in jsonObj[courseCode]) {
                // Separately, we create individual session objects and point them to the larger Course objects
                for (let session of jsonObj[courseCode][termStr]) {
                    // 1: we want to find the instructors associated with this session - so we will check our Mongo collection for them and if they are not there, we will create them
                    let instructorRefs = [];
                    for (let instructor of session.instructors) {
                        let nameArr = instructor.split(", ");
                        let lastName = nameArr[0];
                        let firstName = nameArr[1];
                        let foundInstructor = await Instructor.findOne({"firstName": firstName, "lastName": lastName});
                        let ref;
                        if (foundInstructor) {
                            // Instructor exists! Get their ref
                            ref = foundInstructor._id;
                        } else {
                            // Create instructor & get their ID
                            foundInstructor = await Instructor.create({"firstName": firstName, "lastName": lastName});
                            ref = foundInstructor._id;
                        }
                        instructorRefs.push(ref);
                    }
                    // 2: Create session object to be added to this particular course object
                    let classObject = {};
                    let labObject = {};

                    // Create class object
                    if (session["class_days"] && session["class_days"].length > 0) {
                        classObject = {
                            "startTime": session["class_start_time"],
                            "endTime": session["class_end_time"],
                            "days": session["class_days"]
                        };
                    }

                    // Create lab object
                    if (session["lab_days"] && session["lab_days"].length > 0) {
                        labObject = {
                            "startTime": session["lab_start_time"],
                            "endTime": session["lab_end_time"],
                            "days": session["lab_days"]
                        };
                    }

                    // Create update document
                    let sessionSingleUpdate = {
                        "crn": session.crn,
                        "term": termStr,
                        "course": courseID,
                        "class": classObject,
                        "lab": labObject,
                        "instructors": instructorRefs,
                        "enrollment": session["cur_enroll"],
                        "maxEnrollment": session["max_enroll"],
                        "waitlisted": session["cur_wait"],
                        "maxWaitlisted": session["max_wait"]
                    }

                    // TODO: Remove this later, only necessary for now
                    let filter = {};
                    filter["crn"] = session.crn;
                    if (includedSessions.length > 0) {
                        // Has sessions
                        filter["_id"] = { $in: includedSessions };
                    } else {
                        // No tied sessions; filter by instructor
                        filter["instructors"] = instructorRefs;
                    }

                    // Create updator document
                    let sessionUpdator = {
                        updateOne: {
                            filter: filter,
                            update: sessionSingleUpdate,
                            upsert: true // create new session if crn doesn't exist
                        }
                    }

                    // Add update to bulk update
                    sessionBulkUpdates.push(sessionUpdator);

                    if (sessionBulkUpdates.length > 250) {
                        let copy = sessionBulkUpdates.slice();
                        Session.bulkWrite(copy, (err, res) => {
                            process.send("Num attempted: " + copy.length);
                            process.send("Num finished: " + res.matchedCount);
                        });
    
                        // Reset
                        sessionBulkUpdates = [];
                    }

                    // TODO: Check if update needed
                    // await sessionObject.updateOne({
                    //     "class": classObject,
                    //     "lab": labObject,
                    //     "instructors": instructorRefs,
                    //     "enrollment": session["cur_enroll"],
                    //     "maxEnrollment": session["max_enroll"],
                    //     "waitlisted": session["cur_wait"],
                    //     "maxWaitlisted": session["max_wait"]
                    // });

                    // await sessionObject.save();

                    // Check if longTitle has been created so far; or if title changed
                    if (newObject || courseObject["longTitle"] != session.longTitle) {
                        courseObject["longTitle"] = session.long_title;
                        await courseObject.save();
                        newObject = false;
                    }
                }
            }
    }

    // Finish saving prior to completion
    let sessionCopy = sessionBulkUpdates.slice();
    Session.bulkWrite(sessionCopy, (err, res) => {
        process.send("Num attempted: " + sessionCopy.length);
        process.send("Num finished: " + res.matchedCount);
    });

    let courseCopy = courseBulkUpdates.slice();
    Course.bulkWrite(courseCopy, (err, res) => {
        process.send("Num courses attempted: " + courseCopy.length);
        process.send("Num courses finished: " + res.modifiedCount);
    });

    // Stop
    console.timeEnd("json");
    process.exit();
}

jsonToSchema(BIGJSON[0]);