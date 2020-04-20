import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import SwipeableViews from "react-swipeable-views";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import { Event } from "../../utils/analytics";
import { sessionToDraftCourse } from "../../utils/SessionUtils";
import {addCourseRequest, removeCourseRequest} from '../../actions/CoursesActions';

import moment from "moment";

const formatTime = (time) => moment(time, "HHmm").format("hh:mm a");

/**
 * 
 * @param {instructor} instructors 
 * {id: xxx, firstName: xxx, lastName: xxx}
 */
const instructorsToNames = (instructors) => {
    let instructorNames = [];
    for (let instructor of instructors) {
        let instructorName = instructor.firstName + " " + instructor.lastName;
        instructorNames.push(instructorName);
    }
    return instructorNames;
}

const sessionToString = (session) => {
    let result = [];
    // Find class times
    if (session.class.days.length > 0) {
        let classTime = "Class: " + session.class.days.join("")
        // Convert times
        let startTime = formatTime(session.class.startTime);
        let endTime = formatTime(session.class.endTime);

        classTime += " " + startTime + " - " + endTime
        result.push(<p style={{ padding: "5px" }}>{classTime}</p>);
    }
    // Find lab times
    if (session.lab.days.length > 0) {
        let labTime = "Lab: " + session.lab.days.join("")

        // Convert times
        let startTime = formatTime(session.lab.startTime);
        let endTime = formatTime(session.lab.endTime);

        labTime += " " + startTime + " - " + endTime
        result.push(<p style={{ padding: "5px" }}>{labTime}</p>);
    }
    // Finally find instructors
    if (session.instructors.length > 0) {
        let instructorNames = instructorsToNames(session.instructors);
        result.push(<p style={{ padding: "5px" }}>{instructorNames.join(", ")}</p>)
    }
    return ((result.length > 0) ? result : ["No information found for this session."]);
}

const styles = {
    slideContainer: {
      height: 500,
      WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
    },
  };

const SessionItem = ({res, session, draftCourses, addCourseRequest, removeCourseRequest }) => {
    // Check if this course is in draftCourses
    let courseSelected = -1;
    for (let idx in draftCourses) {
        let course = draftCourses[idx];
        if (course.crn == session.crn) {
            courseSelected = idx;
        }
    }
    return (
    <div key={session.crn} style={{ borderStyle: 'solid', display: "inline-block" }}>
        <input 
            type="checkbox" 
            checked={courseSelected > -1}
            onClick={() => {
                let crnString = String.toString(session.crn);
                if (courseSelected > -1) {
                    // Track remove
                    Event("COURSE_LIST", "Remove Course from Schedule: " + crnString, crnString);
                    removeCourseRequest(draftCourses[courseSelected]);
                } else {
                    // Track add
                    Event("COURSE_LIST", "Add Course to Schedule: " + crnString, crnString);
                    addCourseRequest(sessionToDraftCourse(session, res.detail, session.term));
                }
            }} 
            style={{ alignItems: "left" }} 
        />
        <div style={{ alignItems: "left" }}>
            {sessionToString(session)}
        </div>
    </div>
    );
}

const CourseList = ({ searchResults, draftCourses, addCourseRequest, removeCourseRequest }) => {
    const [courseSelected, setCourseSelected] = useState([]);

    if (searchResults == []) {
        return (<br />);
    }

    const courseSelectedAdd = (courseLabel) => {
        let copy = courseSelected.slice();
        
        // Add course with this label
        copy.push(courseLabel);
        setCourseSelected(copy);
    }

    const courseSelectedRemove = (courseLabel) => {
        let copy = courseSelected.slice();

        // Filter out all courses with this label
        copy = copy.filter(label => label != courseLabel)
        setCourseSelected(copy);
    }

    return (
        <SwipeableViews containerStyle={styles.slideContainer}>
            <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            >
                {searchResults.map(res => {
                    return (
                        <div>
                            <ListItem 
                            key={res.label} 
                            onClick={() => (courseSelected.includes(res.label)) ? courseSelectedRemove(res.label) : courseSelectedAdd(res.label)}
                            button>
                                {res.label}
                            </ListItem>
                            <Collapse in={(courseSelected.includes(res.label)) ? true : false} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                {res.sessions.map(session => (
                                    <SessionItem 
                                    res={res} 
                                    session={session} 
                                    draftCourses={draftCourses} 
                                    addCourseRequest={addCourseRequest} 
                                    removeCourseRequest={removeCourseRequest} />
                                ))}
                                </List>
                            </Collapse>
                        </div>
                    )
                })}
            </List>
        </SwipeableViews>
    )

}

export default connect(
    (state) => ({
        draftCourses: state.courses.draftCourses
    }),
    (dispatch) => ({
        addCourseRequest: (course) => dispatch(addCourseRequest(course)),
        removeCourseRequest: (course) => dispatch(removeCourseRequest(course))
    }),
)(CourseList);