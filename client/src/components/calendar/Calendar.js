import React, { useState, useEffect } from "react";
import moment from 'moment'
import { CourseWeek } from "./CourseWeek"
import { Calendar, Views, momentLocalizer }  from "react-big-calendar"
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

let id = 1;
var hexId;

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
        console.log(events)
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
            hexId: hexId
            tooltip: tooltipLabel
        });
    }
    hexId++;
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
    hexId = 0;
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


const eventStyleGetter = (event) => {
    console.log(event);
    if(event.hexId % 7 == 0){
        var backgroundColor = '#3D9970'
    }
    else if(event.hexId % 7 == 1){
        var backgroundColor = '#7FDBFF'
    }
    else if(event.hexId % 7 == 2){
        var backgroundColor = '#F012BE'
    }
    else if(event.hexId % 7 == 3){
        var backgroundColor = '#E74C3C'
    }
    else if(event.hexId % 7 == 4){
        var backgroundColor = '#FF851B'
    }
    else if(event.hexId % 7 == 5){
        var backgroundColor = '#D4AC0D'
    }
    else if(event.hexId % 7 == 6){
        var backgroundColor = '#C39BD3'
    }
    var style = {
        backgroundColor: backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
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
            eventPropGetter={(eventStyleGetter)}
            toolbar={false}
            style={style}
            tooltipAccessor = {"tooltip"}
            />
        </div>
    )
}

const style = {
    height: '100%',
}




export default CourseCalendar;
