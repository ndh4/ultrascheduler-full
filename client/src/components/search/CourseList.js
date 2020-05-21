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
import { useQuery, gql, useMutation } from "@apollo/client";

const GET_DEPT_COURSES = gql`
    query GetDeptCourses($subject: String!, $term: Float!) {
        courseMany(filter: { subject: $subject } ) {
            _id
            subject
            courseNum
            longTitle
            sessions(filter: { term: $term } ) {
                _id
                crn
                class {
                    days
                    startTime
                    endTime
                }
                lab {
                    days
                    startTime
                    endTime
                }
                instructors {
                    firstName
                    lastName
                }
            }
        }
    }
`

// These should go to utils
const formatTime = (time) => moment(time, "HHmm").format("hh:mm a");

const courseToLabel = (course) => {
    return course.subject + " " + course.courseNum + " || " + course.longTitle;
}

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
    let courseResult = [];
    // Find class times
    if (session.class.days.length > 0) {
        let classTime = "Class: " + session.class.days.join("")
        // Convert times
        let startTime = formatTime(session.class.startTime);
        let endTime = formatTime(session.class.endTime);

        classTime += " " + startTime + " - " + endTime
        courseResult.push(<p style={{ padding: "5px" }}>{classTime}</p>);
    }
    // Find lab times
    if (session.lab.days.length > 0) {
        let labTime = "Lab: " + session.lab.days.join("")

        // Convert times
        let startTime = formatTime(session.lab.startTime);
        let endTime = formatTime(session.lab.endTime);

        labTime += " " + startTime + " - " + endTime
        courseResult.push(<p style={{ padding: "5px" }}>{labTime}</p>);
    }
    // Finally find instructors
    if (session.instructors.length > 0) {
        let instructorNames = instructorsToNames(session.instructors);
        courseResult.push(<p style={{ padding: "5px" }}>{instructorNames.join(", ")}</p>)
    }
    return ((courseResult.length > 0) ? courseResult : ["No information found for this session."]);
}

const styles = {
    slideContainer: {
      height: 500,
      WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
    },
  };

const ADD_DRAFT_SESSION = gql`
    mutation AddDraftSession($scheduleID: ID!, $sessionID: ID!) {
        scheduleAddSession(scheduleID:$scheduleID, sessionID:$sessionID) {
            _id
            term
            draftSessions {
                _id
                session {
                    _id
                }
                visible
            }
        }
    }
`

const QUERY_DRAFT_SESSIONS = gql`
    query GetDraftSession($netid: String!, $term: String!) {
        userOne(filter:{netid:"wsm3"}) {
            schedules(filter:{term:"202110"}) {
                _id
                draftSessions @client {
                    _id
                    visible
                    session {
                        _id
                    }
                }
            }
        }
    }
`

/**
 * This is found in DraftCourseItem.js too; should be in utils
 */
const REMOVE_DRAFT_SESSION = gql`
	mutation RemoveDraftSession($scheduleID: ID!, $sessionID: ID!) {
		scheduleRemoveSession(scheduleID:$scheduleID, sessionID:$sessionID) {
			_id
			term
			draftSessions {
				_id
				session {
					_id
				}
				visible
			}
		}
	}
`

const SessionItem = ({scheduleID, course, session, draftCourses, addCourseRequest, removeCourseRequest }) => {
    // Check if this course is in draftCourses
    let courseSelected = -1;
    for (let idx in draftCourses) {
        let course = draftCourses[idx];
        if (course.session._id == session._id) {
            courseSelected = idx;
        }
    }

    let [addDraftSession, ] = useMutation(
        ADD_DRAFT_SESSION,
        { variables: { scheduleID: scheduleID, sessionID: session._id } }
    )

    let [removeDraftSession, ] = useMutation(
        REMOVE_DRAFT_SESSION,
        { variables: { scheduleID: scheduleID, sessionID: session._id } }
    )

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
                    removeDraftSession();
                    // removeCourseRequest(draftCourses[courseSelected]);
                } else {
                    // Track add
                    Event("COURSE_LIST", "Add Course to Schedule: " + crnString, crnString);
                    addDraftSession();
                    // addCourseRequest(sessionToDraftCourse(session, course.detail, session.term));
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

const CourseList = ({ scheduleID, department, searchcourseResults, draftCourses, addCourseRequest, removeCourseRequest }) => {
    const [courseSelected, setCourseSelected] = useState([]);

    if (department == "") {
        return (<br />)
    }

    // Department isn't empty, so we need to fetch courseResults
    const { data, loading, error } = useQuery(
        GET_DEPT_COURSES,
        { variables: { subject: department, term: 202110 } }
    );

    let { data: queryData } = useQuery(QUERY_DRAFT_SESSIONS);

    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error :(</p>);
    if (!data) return (<p>No Data...</p>);

    console.log(data);

    const courseResults = data.courseMany;
    let draftSessions = queryData.userOne.schedules[0].draftSessions;

    if (searchcourseResults == []) {
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
                {courseResults.map(course => {
                    let label = courseToLabel(course);
                    return (
                        <div>
                            <ListItem 
                            key={label} 
                            onClick={() => (courseSelected.includes(label)) ? courseSelectedRemove(label) : courseSelectedAdd(label)}
                            button>
                                {label}
                            </ListItem>
                            <Collapse in={(courseSelected.includes(label)) ? true : false} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                {course.sessions.map(session => (
                                    <SessionItem 
                                    course={course} 
                                    session={session} 
                                    draftCourses={draftSessions} 
                                    scheduleID={scheduleID}
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