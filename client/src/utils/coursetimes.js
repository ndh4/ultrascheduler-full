import { WEEKSTART } from '../constants/DefaultDateInfo'
import {merge} from 'react-big-calendar/lib/utils/dates'
import * as dates from 'date-arithmetic'
import { timesToMoment } from '../utils/transformCourseTime';
import moment from 'moment';

const coursetimes = (courseData) => {
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
        let description = "Instructors: " + course.instructors.join(", ");
        description += "\nCRN: " + course.crn;
        if (course.class.hasClass) {
            for (let day of course.class.days) {
                let baseDay = moment(WEEKSTART).add(daysOfWeek.indexOf(day), "days");
                let convertedTimes = timesToMoment(course.class.startTime, course.class.endTime);
                let courseStart = moment(baseDay).add(convertedTimes[0].hour(), 'hours').add(convertedTimes[0].minute(), 'minutes');
                let courseEnd = moment(baseDay).add(convertedTimes[1].hour(), 'hours').add(convertedTimes[1].minute(), 'minutes');
                courseTimes.push(
                    {
                        id: coursetimes.id++,
                        title: course.courseName,
                        desc: description,
                        source: course,
                        allDay: false,
                        start: courseStart.toDate(),
                        end: courseEnd.toDate()
                    }
                );
            }
        }
        if (course.lab.hasLab) {
            for (let day of course.lab.days) {
                let baseDay = moment(WEEKSTART).add(daysOfWeek.indexOf(day), "days");
                let convertedTimes = timesToMoment(course.lab.startTime, course.lab.endTime);
                let labStart = moment(baseDay).add(convertedTimes[0].hour(), 'hours').add(convertedTimes[0].minute(), 'minutes');
                let labEnd = moment(baseDay).add(convertedTimes[1].hour(), 'hours').add(convertedTimes[1].minute(), 'minutes');
                // Convert lab times into start/end time
                courseTimes.push(
                    {
                        id: coursetimes.id++,
                        title: course.courseName,
                        desc: description,
                        source: course,
                        allDay: false,
                        start: labStart.toDate(),
                        end: labEnd.toDate()
                    }
                );
            }
        }
    }
    console.log(courseTimes);
    return courseTimes;
}

// function coursetimes(courseData) {
//     /*
//     Example:
//     courseData = [{
//         "days": "MWF",
//         "startTime": [9, 25],
//         "endTime": [10, 30],
//         "courseName": "Calculus III",
//         "instructors": ["Teacher A"],
//         "crn": 123456
//     }]
//     */
//     if( typeof coursetimes.id == 'undefined' ) {
//         coursetimes.id = 0;
//     }
//     const daysOfWeek = "UMTWRFS";
//     let courseTimes = [];

//     for (let course of courseData) {
//         if (!course.visible)
//             continue;
//         for (let day of course.days) {
//             // Build the start and end times as dates.
//             let baseDay = dates.add(WEEKSTART, daysOfWeek.indexOf(day, 'day'), 'day')
//             let courseStart = merge(baseDay, new Date(0, 0, 0, course.startTime[0], course.startTime[1]))
//             let courseEnd = merge(baseDay, new Date(0, 0, 0, course.endTime[0], course.endTime[1]))
//             // Generate the description from the course object
//             let description = "Instructors: " + course.instructors.join(", ");
//             description += "\nCRN: " + course.crn;
//             // Add this new course event object to the result array.
//             courseTimes.push(
//                 {
//                     id: coursetimes.id++,
//                     title: course.courseName,
//                     desc: description,
//                     source: course,
//                     allDay: false,
//                     start: courseStart,
//                     end: courseEnd
//                 }
//             );
//         }
//     }
//     return courseTimes;
// }

export default coursetimes;