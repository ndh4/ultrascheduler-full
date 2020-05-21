import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import coursetimes from "../../utils/coursetimes";
import moment from 'moment'
import CourseWeek from "./CourseWeek"
import { Calendar, Views, momentLocalizer }  from "react-big-calendar"
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { WEEKSTART } from "../../constants/Defaults";

const localizer = momentLocalizer(moment)
let id = 1;

const dayCode2dayString = {
    "M": "Monday",
    "T": "Tuesday",
    "W": "Wednesday",
    "R": "Thursday",
    "F": "Friday",
    "S": "Saturday",
    "U": "Sunday"
}

const courseToCourseCode = (course) => {
    return course.subject + " " + course.courseNum;
}

const convertSectionToEvents = (section, session) => {
    let events = [];
    if (!section.startTime || !section.endTime) {
        return events;
    }

    // Necessary for event title
    let courseCode = courseToCourseCode(session.course);

    // Create moment objects for the time
    let momentStart = moment(section.startTime, 'HH:mm');
    let momentEnd = moment(section.endTime, 'HH:mm');

    // Create event for each day
    for (let dayCode of section.days) {
        // Convert the shorthand to a full weekday string
        let dayString = dayCode2dayString[dayCode];

        // Convert to a moment object
        let baseDay = moment(dayString, 'dddd');

        let eventStart = baseDay.clone().add(momentStart.hour(), 'hours').add(momentStart.minute(), 'minutes');
        let eventEnd = baseDay.clone().add(momentEnd.hour(), 'hours').add(momentEnd.minute(), 'minutes');

        events.push({
            id: id++,
            title: courseCode,
            desc: session.course.longTitle,
            source: section,
            start: eventStart.toDate(),
            end: eventEnd.toDate()
        });
    }
    return events;
}

/**
 * Goal is to transform each session into weekly events, in the following format:
 * {
 *  id: Int! (Unique)
 *  title: String!
 *  start: Date & Time
 *  end: Date & Time
 * }
 */
const draftSessionsToEvents = (draftSessions) => {
    // All our events will go in here
    let events = [];

    for (let draftSession of draftSessions) {
        // Check that session is visible. If not, don't show on calendar
        if (draftSession.visible) {
            let session = draftSession.session;
            // First convert classes
            events = events.concat(convertSectionToEvents(session.class, session));
            // Convert lab
            events = events.concat(convertSectionToEvents(session.lab, session));
        }
    }
    return events;
}

const CourseCalendar = ({ draftSessions, courses }) => {
    // draftSessionsToEvents(draftSessions);
    return (
        <div>
            <Calendar
            events = {draftSessionsToEvents(draftSessions)}
            step={10}
            timeslots={3}
            localizer={localizer}
            defaultView={Views.WEEK}
            formats={{ dayFormat: 'dddd' }} // Calendar columns show "Monday", "Tuesday", ...
            views={{month: false, week: CourseWeek, day: false}}
            defaultDate={moment("Sunday", "dddd")} // Always start on Sunday of the week
            onSelectEvent={event => alert(event.title + "\n" + event.desc + "\n")}
            toolbar={false}
            style={style}
            />
        </div>
    )
}

const style = {
    height: '100%'
}

export default connect(
    (state) => ({
            courses: state.courses.draftCourses,
    }),
    (dispatch) => ({
        
    }),
)(CourseCalendar);
