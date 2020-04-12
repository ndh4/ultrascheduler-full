import moment from "moment";

const createTimeObj = (schedule)  => ({
        days: schedule.days.join(""), 
        startTime: moment(schedule.startTime, "HHmm").toDate(),
        endTime: moment(schedule.endTime, "HHmm").toDate(),
});

const sessionToDraftCourse = (session, detail) => {
        let draft = {
                crn: session.crn,
                courseName:  detail.subject + " " + detail.courseNum,
                longTitle: detail.longTitle,
                instructors: session.instructors,
                sessionId: session._id,
                detailId: detail._id,
                visible: true,
        };
        draft.class = (session.class.days.length > 0) 
                ? createTimeObj(session.class) 
                : null;
        draft.lab = (session.lab.days.length > 0) 
                ? createTimeObj(session.lab) 
                : null;
        // TODO: Remove this line once instructors is working again
        draft.instructors = ["Fessor, Pro"];
        return draft;
}

export {
        sessionToDraftCourse,
}