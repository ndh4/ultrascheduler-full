import React, { useState, useEffect } from "react";
import moment from "moment";
import { CourseWeek } from "./CourseWeek";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

const localizer = momentLocalizer(moment);

let id = 1;
var hexId;

const dayCode2dayString = {
    M: "Monday",
    T: "Tuesday",
    W: "Wednesday",
    R: "Thursday",
    F: "Friday",
    S: "Saturday",
    U: "Sunday",
};

// color combos order: [background, border]
const colorCombos = [
    ["#F2F9FF", "#1E85E880"], // light blue
    ["#FFFFF2", "#F5D581B3"], // light yellow
    ["#FFFCFB", "#E35F4980"], // light orange
    ["#FDFFFE", "#76C5AFBF"], // light green
];

const courseToCourseLabel = (course) => {
    return course.subject + " " + course.courseNum;
};

const courseToTooltipLabel = (session) => {
    let tooltipString = courseToCourseLabel(session.course);

    // add course details
    tooltipString += "\n" + session.course.longTitle;
    tooltipString += "\nCRN: " + session.crn;
    tooltipString += "\nEnrollment: " + session.enrollment;
    tooltipString += "\nMax enrollment: " + session.maxEnrollment;

    tooltipString += "\nInstructor(s): ";
    // add all instructors
    for (let instructor of session.instructors) {
        tooltipString += instructor.firstName + " " + instructor.lastName;
    }

    return tooltipString;
};

const convertSectionToEvents = (section, session) => {
    let events = [];
    if (!section.startTime || !section.endTime) {
        return events;
    }

    // Necessary for event title
    let courseLabel = courseToCourseLabel(session.course);

    // Create moment objects for the time
    let momentStart = moment(section.startTime, "HH:mm");
    let momentEnd = moment(section.endTime, "HH:mm");

    // create tooltip label
    let tooltipLabel = courseToTooltipLabel(session);

    // Create event for each day
    for (let dayCode of section.days) {
        console.log(events);
        // Convert the shorthand to a full weekday string
        let dayString = dayCode2dayString[dayCode];

        // Convert to a moment object
        let baseDay = moment(dayString, "dddd");

        let eventStart = baseDay
            .clone()
            .add(momentStart.hour(), "hours")
            .add(momentStart.minute(), "minutes");
        let eventEnd = baseDay
            .clone()
            .add(momentEnd.hour(), "hours")
            .add(momentEnd.minute(), "minutes");

        events.push({
            id: id++,
            title: courseLabel,
            desc: `${eventStart.format("hh:mm a")} - ${eventEnd.format(
                "hh:mm a"
            )}`,
            source: section,
            start: eventStart.toDate(),
            end: eventEnd.toDate(),
            hexId: hexId,
            tooltip: tooltipLabel,
        });
    }
    hexId++;
    return events;
};

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
            events = events.concat(
                convertSectionToEvents(session.class, session)
            );
            // Convert lab
            events = events.concat(
                convertSectionToEvents(session.lab, session)
            );
        }
    }

    return events;
};

const slotStyleGetter = (date) => {
    var style = {
        font: "Medium 23px/26px Acari Sans",
        letterSpacing: "0px",
        color: "#8E9EB2",
        opacity: 1,
    };

    return {
        style: style,
    };
};

const dayStyleGetter = (date) => {
    var style = {
        textAlign: "center",
        font: "Medium 23px/26px Acari Sans",
        letterSpacing: "0px",
        color: "#8E9EB2",
        opacity: 1,
        border: "1px dashed #E4E8EE",
        paddingTop: "16.5px",
    };

    return {
        style: style,
    };
};

const eventStyleGetter = (event) => {
    let moduloValue = event.hexId % 4;

    var backgroundColor = colorCombos[moduloValue][0];
    var borderColor = colorCombos[moduloValue][1];

    var style = {
        // background:  0% 0% no-repeat padding-box;
        backgroundColor: backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: "10px",
        opacity: 1,
        color: "#384569",
        display: "block",
    };

    return {
        style: style,
    };
};

const CustomClassEvent = ({ event }) => {
    let moduloValue = event.hexId % 4;

    var sidebarColor = colorCombos[moduloValue][1];

    return (
        <div className="courseEventWrapper">
            <hr style={{ backgroundColor: `${sidebarColor}`}} className="courseEventBar" />
            <div className="courseEvent">
                <p id="courseCode">ARCH 225</p>
                <p id="courseTime">09:25am - 10:30am</p>
                <p id="courseInstructor">Reto Geiser</p>
            </div>
        </div>
    );
};

const CourseCalendar = ({ draftSessions }) => {
    return (
        <div>
            <Calendar
                components={{ event: CustomClassEvent }}
                events={draftSessionsToEvents(draftSessions)}
                step={10}
                timeslots={3}
                localizer={localizer}
                defaultView={Views.WEEK}
                formats={{ dayFormat: "ddd" }} // Calendar columns show "MON", "TUES", ...
                views={{ month: false, week: CourseWeek, day: false }}
                drilldownView={null}
                defaultDate={moment("Sunday", "ddd")} // Always start on Sunday of the week
                eventPropGetter={eventStyleGetter}
                dayPropGetter={dayStyleGetter}
                slotPropGetter={slotStyleGetter}
                showMultiDayTimes={true} // disable all day row
                toolbar={false}
                style={style}
                tooltipAccessor={"tooltip"}
            />
        </div>
    );
};

const style = {
    height: "100%",
};

export default CourseCalendar;
