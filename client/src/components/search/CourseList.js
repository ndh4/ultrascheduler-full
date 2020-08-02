import React, { useState, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import { Event } from "../../utils/analytics";
import Checkbox from '@material-ui/core/Checkbox';

import moment from "moment";
import { useQuery, gql, useMutation } from "@apollo/client";


const GET_DEPT_COURSES = gql`
    query GetDeptCourses($subject: String!, $term: Float!) {
        courseMany(filter: { subject: $subject }, sort:COURSE_NUM_ASC ) {
            _id
            subject
            courseNum
            longTitle
            sessions(filter:{term:$term}) {
                _id
                crn
                class {
                    days
                    startTime
                    endTime               
                }
                course {
                    distribution
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

/**
 * Gets the term from local state management
 */
const GET_TERM = gql`
    query {
        term @client
    }
`;

// These should go to utils
const formatTime = (time) => moment(time, "HHmm").format("hh:mm a");

const courseToLabel = (course) => {
    //distribution and department
    if (course.sessions) {
        return `${course.subject} ${course.courseNum} || ${course.longTitle}`;
    } else {
        //instructors
        return `${course.course.subject} ${course.course.courseNum} || ${course.course.longTitle}`;
    }
};

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
};

const sessionToString = (session) => {
    let courseResult = [];
    // Find class times
    if (session.class.days.length > 0) {

        let classTime =  session.class.days.join("")
        // Convert times
        let startTime = formatTime(session.class.startTime);
        let endTime = formatTime(session.class.endTime);


        classTime += ",     " + startTime + " - " + endTime
        courseResult.push(<p style={stylesDesc.classDesc}><span style={{ fontWeight: "bold"}}> Class Time: </span>{classTime}</p>);
    }
    // Find lab times
    if (session.lab.days.length > 0) {
        let labTime = session.lab.days.join("")
        // Convert times
        let startTime = formatTime(session.lab.startTime);
        let endTime = formatTime(session.lab.endTime);

        labTime += ",     " + startTime + " - " + endTime
        courseResult.push(<p style={stylesDesc.classDesc}> <span style={{ fontWeight: "bold"}}> Lab Time: </span>{labTime}</p>);
    }
    // Finally find instructors
    if (session.instructors.length > 0) {
        let instructorNames = instructorsToNames(session.instructors);
        courseResult.push(<p style={stylesDesc.classDesc}> <span style={{ fontWeight: "bold"}}> Instructors: </span>{instructorNames.join(", ")}</p>)
    }
    else if(session.instructors.length <= 0){
        courseResult.push(<p style={stylesDesc.classDesc}> <span style={{ fontWeight: "bold"}}> Instructor: </span>N/A</p>)
    }

    if(session.crn > 0){
        let crnName = session.crn;
        courseResult.push(<p style={stylesDesc.classDesc}> <span style={{ fontWeight: "bold"}}> CRN: </span> {crnName}</p>)
    }

    if(session.course.distribution.length > 0){
        let distributionName = session.course.distribution;
        courseResult.push(<p style={stylesDesc.classDesc}> <span style={{ fontWeight: "bold"}}> Distribution: </span> {distributionName}</p>)
    }

    return ((courseResult.length > 0) ? courseResult : ["No information found for this session."]);
}

const styles = {
    slideContainer: {
        height: 500,
        WebkitOverflowScrolling: "touch", // iOS momentum scrolling
    },
};

const ADD_DRAFT_SESSION = gql`
    mutation AddDraftSession($scheduleID: ID!, $sessionID: ID!) {
        scheduleAddSession(scheduleID: $scheduleID, sessionID: $sessionID) {
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
`;

const QUERY_DRAFT_SESSIONS = gql`
    query GetDraftSession($term: String!) {
        scheduleOne(filter: { term: $term }) {
            _id
            __typename
            draftSessions {
                _id
                __typename
                visible
                session {
                    _id
                }
            }
        }
    }
`;

/**
 * This is found in DraftCourseItem.js too; should be in utils
 */
const REMOVE_DRAFT_SESSION = gql`
    mutation RemoveDraftSession($scheduleID: ID!, $sessionID: ID!) {
        scheduleRemoveSession(scheduleID: $scheduleID, sessionID: $sessionID) {
            _id
            __typename
            term
            draftSessions {
                _id
                __typename
                session {
                    _id
                }
                visible
            }
        }
    }
`;

const SessionItem = ({ scheduleID, session, draftSessions }) => {
    let sessionSelected = false;

    // Check if this course is in draftSessions
    for (let draftSession of draftSessions) {
        if (draftSession.session._id == session._id) {
            sessionSelected = true;
        }
    }

    let [addDraftSession, { data, loading, error }] = useMutation(
        ADD_DRAFT_SESSION,
        {
            variables: { scheduleID: scheduleID, sessionID: session._id },
        }
    );

    let [
        removeDraftSession,
        { dataOnRemove, loadingOnRemove, errorOnRemove },
    ] = useMutation(REMOVE_DRAFT_SESSION, {
        variables: { scheduleID: scheduleID, sessionID: session._id },
    });

    return (
    <div key={session.crn} style={{ borderBottom: 'solid black 1px', borderLeft: 'solid black 1px',  display: "flex" }}>
        <Checkbox
            checked={sessionSelected}
            onChange={() => {
                // Simple transformation of CRN to a string
                let crnString = String.toString(session.crn);

                if (sessionSelected) {
                    // Track remove with GA
                    Event("COURSE_LIST", "Remove Course from Schedule: " + crnString, crnString);

                    console.log("Boom.");

                    // Execute mutation to remove this session of the course from user's draftsessions
                    removeDraftSession();

                    console.log("No errors...?");
                } else {
                    // Track add with GA
                    Event("COURSE_LIST", "Add Course to Schedule: " + crnString, crnString);

                    // Execute mutation to add this session of the course to the user's draftsessions
                    addDraftSession();
                }
            }} 
            style={stylesDesc.checkbox}
        />
        <div style={{ alignItems: "left" }}>
            {sessionToString(session)}
        </div>
    </div>
    );
}

const CourseList = ({ scheduleID, query, searchType, idx }) => {
    const [courseSelected, setCourseSelected] = useState([]);

    // Get term from local state management
    const { data: termData } = useQuery(GET_TERM);
    let { term } = termData;

    let courseResults;
    let draftSessions;

    // We also want to fetch(from our cache, so this does NOT call the backend) the user's draftSessions
    let { data: scheduleData } = useQuery(QUERY_DRAFT_SESSIONS, {
        variables: { term: term.toString() },
    });

    // Fetch data required
    const { data: courseData, loading, error } = useQuery(query, {
        variables: { ...searchType, term: term },
    });
    // Since searchType is passed in as an object with the value as the query returned value,
    // we need to check the object's value instead of directly checking searchType === ""
    if (Object.values(searchType)[0] === "") return <br />;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (!courseData) return <p>No Data...</p>;

    // Once the data has loaded, we want to extract the course results
    // We need to filter out any courses which have 0 sessions
    // or we get the session's course field for days and time interval selection
    switch (idx) {
        case 2:
            courseResults = courseData.instructorOne.sessions;
            break;
        case 3:
            courseResults = courseData.sessionByTimeInterval;
            courseResults = courseResults
                .map((session) => session.course)
                .filter((course) => course.sessions.length > 0);
            break;
        case 4:
            courseResults = courseData.sessionByDay;
            courseResults = courseResults
                .map((session) => session.course)
                .filter((course) => course.sessions.length > 0);
            break;
        default:
            courseResults = courseData.courseMany;
            courseResults = courseResults.filter(
                (course) => course.sessions.length > 0
            );
    }

    if (courseResults.length === 0)
        return <p>No Available Course In This Range</p>;

    // We also want to extract the user's draftSessions, nested inside their schedule
    draftSessions = scheduleData.scheduleOne.draftSessions;

    /**
     * Adds course to list of courses with their collapsibles open in the search menu,
     * effectively opening its collapsible
     */
    const addToCoursesSelected = (courseLabel) => {
        let copy = courseSelected.slice();

        // Add course with this label
        copy.push(courseLabel);
        setCourseSelected(copy);
    };

    /**
     * Removes course from list of courses with their collapsibles open in the search menu,
     * effectively closing its collapsible
     */
    const removeFromCoursesSelected = (courseLabel) => {
        let copy = courseSelected.slice();

        // Filter out all courses with this label
        copy = copy.filter((label) => label != courseLabel);
        setCourseSelected(copy);
    };

    const collapseItem = (course) => {
        //distribution, department, day, time interval
        if (course.sessions) {
            return course.sessions.map((session, idx) => (
                <SessionItem
                    //replace key with uuid
                    key={idx}
                    course={course}
                    session={session}
                    draftSessions={draftSessions}
                    scheduleID={scheduleID}
                />
            ));
        } else {
            //instructors
            return (
                <SessionItem
                    course={course}
                    session={course}
                    draftSessions={draftSessions}
                    scheduleID={scheduleID}
                />
            );
        }
    };

    return (
        <SwipeableViews containerStyle={styles.slideContainer}>
            <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            >
                {courseResults.map(course => {
                    let id = course._id;
                    return (
                        <div>
                            <ListItem 
                            key={id} 
                            onClick={() => (courseSelected.includes(id)) ? removeFromCoursesSelected(id) : addToCoursesSelected(id)}
                            button>
                                {courseToLabel(course)}
                            </ListItem>
                            <Collapse in={(courseSelected.includes(id)) ? true : false} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                {course.sessions.map(session => (
                                    <SessionItem 
                                    course={course} 
                                    session={session} 
                                    draftSessions={draftSessions} 
                                    scheduleID={scheduleID}
                                    />
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
const stylesDesc = {
    classDesc: {
        marginLeft: "30px",
        marginTop: "6px",
    },
    checkbox: {
        alignItems: 'top',
        marginTop: "1px",
        marginLeft: '15px'
    }
}



export default CourseList;
