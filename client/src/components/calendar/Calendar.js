import React, { useState, useEffect } from "react";
import moment from 'moment'
import { CourseWeek } from "./CourseWeek"
import { Calendar, Views, momentLocalizer }  from "react-big-calendar"
import 'react-big-calendar/lib/css/react-big-calendar.css'

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

const courseToCourseLabel = (course) => {
    return course.subject + " " + course.courseNum;
}

const courseToTooltipLabel = (session) => {
    let tooltipString = courseToCourseLabel(session.course);
    
    // add course details
    tooltipString += '\n' + session.course.longTitle;
    tooltipString += '\nCRN: ' + session.crn; 
    tooltipString += '\nEnrollment: ' + session.enrollment;
    tooltipString += '\nMax enrollment: ' + session.maxEnrollment;
    
    tooltipString += '\nInstructor(s): ';
    // add all instructors
    for (let instructor of session.instructors) {
        tooltipString += instructor.firstName +' ' + instructor.lastName;
    }
    
    return tooltipString; 
}

const convertSectionToEvents = (section, session) => {
    let events = [];
    if (!section.startTime || !section.endTime) {
        return events;
    }

    // Necessary for event title
    let courseLabel = courseToCourseLabel(session.course);

    // Create moment objects for the time
    let momentStart = moment(section.startTime, 'HH:mm');
    let momentEnd = moment(section.endTime, 'HH:mm');

    // create tooltip label
    let tooltipLabel = courseToTooltipLabel(session);

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
            title: courseLabel,
            desc: session.course.longTitle,
            source: section,
            start: eventStart.toDate(),
            end: eventEnd.toDate(),
            tooltip: tooltipLabel
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

const CourseCalendar = ({ draftSessions }) => {
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
            drilldownView={null}
            defaultDate={moment("Sunday", "dddd")} // Always start on Sunday of the week
            toolbar={false}
            style={style}
            tooltipAccessor = {"tooltip"}
            />
        </div>
    )
}

const style = {
    height: '100%'
}

export default CourseCalendar;
