import moment from "moment";

const createClassObj = (schedule)  => ({
        hasClass: true,
        days: schedule.days.join(""), 
        startTime: moment(schedule.startTime, "HHmm"),
        endTime: moment(schedule.endTime, "HHmm"),
});

const createLabObj = (schedule)  => ({
        hasLab: true,
        days: schedule.days.join(""), 
        startTime: moment(schedule.startTime, "HHmm"),
        endTime: moment(schedule.endTime, "HHmm"),
});

const sessionToDraftCourse = (session, detail) => {
        let draft = {
                crn: session.crn,
                courseName:  detail.subject + " " + detail.courseNum,
                longTitle: detail.longTitle,
                instructors: session.instructors,
                sessionID: session._id,
                courseID: detail._id,
                term: detail.terms[0].term, 
                visible: true,
        };
        draft.class = (session.class.days.length > 0) 
                ? createClassObj(session.class) 
                : { hasClass: false };
        draft.lab = (session.lab.days.length > 0) 
                ? createLabObj(session.lab) 
                : { hasLab: false };
        // TODO: Remove this line once instructors is working again
        draft.instructors = ["Fessor, Pro"];
        return draft;
}

export {
        sessionToDraftCourse,
}