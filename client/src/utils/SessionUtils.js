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

const sessionToDraftCourse = (session, detail, term, visible=true) => {
        let draft = {
                crn: session.crn,
                courseName:  detail.subject + " " + detail.courseNum,
                longTitle: detail.longTitle,
                creditsMin: detail.creditsMin,
                creditsMax: detail.creditsMax,
                distribution: detail.distribution,
                instructors: [],
                sessionID: session._id,
                courseID: detail._id,
                term: term, 
                visible: visible,
        };
        draft.class = (session.class.days.length > 0) 
                ? createClassObj(session.class) 
                : { hasClass: false };
        draft.lab = (session.lab.days.length > 0) 
                ? createLabObj(session.lab) 
				: { hasLab: false };
        session.instructors.forEach(instructor => {
            let name = instructor.firstName + " " + instructor.lastName;
            draft.instructors.push(name);
        })
        return draft;
}

export {
        sessionToDraftCourse,
}