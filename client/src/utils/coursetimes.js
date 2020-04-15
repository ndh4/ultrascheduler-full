import { WEEKSTART } from '../constants/Defaults';
import moment from 'moment';

const coursetimes = (courseData) => {
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
                // let convertedTimes = timesToMoment(course.class.startTime, course.class.endTime);
                
                let courseStart = moment(baseDay).add(course.class.startTime.hour(), 'hours').add(course.class.startTime.minute(), 'minutes');
                let courseEnd = moment(baseDay).add(course.class.endTime.hour(), 'hours').add(course.class.endTime.minute(), 'minutes');
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
                // let convertedTimes = timesToMoment(course.lab.startTime, course.lab.endTime);

                let labStart = moment(baseDay).add(course.lab.startTime.hour(), 'hours').add(course.lab.startTime.minute(), 'minutes');
                let labEnd = moment(baseDay).add(course.lab.endTime.hour(), 'hours').add(course.lab.endTime.minute(), 'minutes');
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
    return courseTimes;
}

export default coursetimes;