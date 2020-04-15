import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import SwipeableViews from "react-swipeable-views";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import { sessionToDraftCourse } from "../../utils/SessionUtils";
import {addCourseRequest, removeCourseRequest} from '../../actions/CoursesActions';

import moment from "moment";

const formatTime = (time) => moment(time, "HHmm").format("hh:mm a");

const sessionToString = (session) => {
    let result = [];
    if (session.class.days.length > 0) {
        let classTime = "Class: " + session.class.days.join("")
        // Convert times
        let startTime = formatTime(session.class.startTime);
        let endTime = formatTime(session.class.endTime);

        classTime += " " + startTime + " - " + endTime
        result.push(<p>{classTime}</p>);
    }
    if (session.lab.days.length > 0) {
        let labTime = "Lab: " + session.lab.days.join("")

        // Convert times
        let startTime = formatTime(session.lab.startTime);
        let endTime = formatTime(session.lab.endTime);

        labTime += " " + startTime + " - " + endTime
        result.push(<p>{labTime}</p>);
    }
    return ((result.length > 0) ? result : ["No class times"]);
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
    console.log(session);
    console.log(res);
    return (
    <div key={session.crn} style={{ borderStyle: 'solid', display: "inline-block" }}>
        <input 
            type="checkbox" 
            checked={courseSelected > -1}
            onClick={() => {
                if (courseSelected > -1) {
                    removeCourseRequest(draftCourses[courseSelected]);
                } else {
                    addCourseRequest(sessionToDraftCourse(session, res.detail, res.detail.term));
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
    const [courseSelected, setCourseSelected] = useState("");

    if (searchResults == []) {
        return (<br />);
    }

    console.log("new search results");
    // console.log(searchResults);

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
                            onClick={() => courseSelected ? setCourseSelected("") : setCourseSelected(res)}
                            button>
                                {res.label}
                            </ListItem>
                            <Collapse in={(courseSelected != "" && courseSelected.label == res.label) ? true : false} timeout="auto" unmountOnExit>
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
        draftCourses: state.CoursesReducer.draftCourses
    }),
    (dispatch) => ({
        addCourseRequest: (course) => dispatch(addCourseRequest(course)),
        removeCourseRequest: (course) => dispatch(removeCourseRequest(course))
    }),
)(CourseList);