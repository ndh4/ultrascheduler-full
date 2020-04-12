import { WEEKSTART } from '../constants/DefaultDateInfo'
import {merge} from 'react-big-calendar/lib/utils/dates'
import * as dates from 'date-arithmetic'

function coursetimes(courseData) {
    /*
    Example:
    courseData = [{
        "days": "MWF",
        "startTime": [9, 25],
        "endTime": [10, 30],
        "courseName": "Calculus III",
        "instructors": ["Teacher A"],
        "crn": 123456
    }]
    */
    if( typeof coursetimes.id == 'undefined' ) {
        coursetimes.id = 0;
    }
    const daysOfWeek = "UMTWRFS";
    let courseTimes = [];

    for (let course of courseData) {
        if (!course.visible)
            continue;
        for (let day of course.days) {
            // Build the start and end times as dates.
            let baseDay = dates.add(WEEKSTART, daysOfWeek.indexOf(day, 'day'), 'day')
            let courseStart = merge(baseDay, new Date(0, 0, 0, course.startTime[0], course.startTime[1]))
            let courseEnd = merge(baseDay, new Date(0, 0, 0, course.endTime[0], course.endTime[1]))
            // Generate the description from the course object
            let description = "Instructors: " + course.instructors.join(", ");
            description += "\nCRN: " + course.crn;
            // Add this new course event object to the result array.
            courseTimes.push(
                {
                    id: coursetimes.id++,
                    title: course.courseName,
                    desc: description,
                    source: course,
                    allDay: false,
                    start: courseStart,
                    end: courseEnd
                }
            );
        }
    }
    return courseTimes;
}

export default coursetimes;