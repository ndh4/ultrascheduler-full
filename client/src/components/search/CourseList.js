import React, { useState, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import { Event } from "../../utils/analytics";
import { classTimeString } from "../../utils/CourseTimeTransforms";
import Detail from "./Detail";

import moment from "moment";
import { useQuery, gql, useMutation } from "@apollo/client";

const detailStyle = {
    fontSize: "10px",
    color: "#6C7488",
    background: "#F7F8FA",
    width: "415px"
};

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
        return `${course.subject} ${course.courseNum}: ${course.longTitle}`;
    } else {
        //instructors
        return `${course.course.subject} ${course.course.courseNum}: ${course.course.longTitle}`;
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

// const sessionToString = (session) => {
//     let courseResult = [];
//     // Find class times
//     if (session.class.days.length > 0) {
//         let classTime = "Class: " + session.class.days.join("");
//         // Convert times
//         let startTime = formatTime(session.class.startTime);
//         let endTime = formatTime(session.class.endTime);

//         classTime += " " + startTime + " - " + endTime;
//         courseResult.push(
//             //added key here
//             <p style={{ padding: "5px" }} key={session.crn}>
//                 {classTime}
//             </p>
//         );
//     }
//     // Find lab times
//     if (session.lab.days.length > 0) {
//         let labTime = "Lab: " + session.lab.days.join("");

//         // Convert times
//         let startTime = formatTime(session.lab.startTime);
//         let endTime = formatTime(session.lab.endTime);

//         labTime += " " + startTime + " - " + endTime;
//         courseResult.push(
//             //added key here
//             <p style={{ padding: "5px" }} key={session._id}>
//                 {labTime}
//             </p>
//         );
//     }

// // Finally find instructors - only for distribution and departments
// if (session.instructors) {
//     if (session.instructors.length > 0) {
//         let instructorNames = instructorsToNames(session.instructors);
//         courseResult.push(
//             //added key here
//             <p style={{ padding: "5px" }} key={session._id}>
//                 {instructorNames.join(", ")}{" "}
//             </p>
//         );
//     }
// }
// return courseResult.length > 0
//     ? courseResult
//     : ["No information found for this session."];
// };

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

const SessionItem = ({ scheduleID, course, session, draftSessions }) => {
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
        <div
            // style={{ borderStyle: "solid", display: "inline-block" }}
            key={session.crn}
        >
            <input
                type="checkbox"
                checked={sessionSelected}
                onChange={() => {
                    // Simple transformation of CRN to a string
                    let crnString = String.toString(session.crn);

                    if (sessionSelected) {
                        // Track remove with GA
                        Event(
                            "COURSE_LIST",
                            "Remove Course from Schedule: " + crnString,
                            crnString
                        );

                        console.log("Boom.");

                        // Execute mutation to remove this session of the course from user's draftsessions
                        removeDraftSession();

                        console.log("No errors...?");
                    } else {
                        // Track add with GA
                        Event(
                            "COURSE_LIST",
                            "Add Course to Schedule: " + crnString,
                            crnString
                        );

                        // Execute mutation to add this session of the course to the user's draftsessions
                        addDraftSession();
                    }
                }}
                style={{ alignItems: "left" }}
            />
            {/* <div style={{ alignItems: "left" }}>{sessionToString(session)}</div> */}
            <div style={{
                alignItems: "left"
            }}>
                {
                    <Detail
                        style={detailStyle}
                        session={session}
                        course={course}
                        open={true}
                        classTimeString={classTimeString}
                        instructorsToNames={instructorsToNames}
                    />
                }
            </div>
        </div>
    );
};

const CourseList = ({ scheduleID, query, searchType }) => {
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

    // Once the data has loaded, we want to extract the course results for the distribution
    //distribution and departments (1 key)
    if (Object.keys(searchType).length === 1) {
        courseResults = courseData.courseMany;
        // We need to filter out any courses which have 0 sessions - only filter for distribution and departments
        courseResults = courseResults.filter(
            (course) => course.sessions.length > 0
        );
    }
    //instructor (2 keys)
    if (Object.keys(searchType).length === 2) {
        courseResults = courseData.instructorOne.sessions;
    }

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
        //distribution and department
        if (course.sessions) {
            // return <Detail course={course} classTimeString={classTimeString} />;
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
            <List component="nav" aria-labelledby="nested-list-subheader">
                {courseResults.map((course) => {
                    let id = course._id;
                    return (
                        <div key={id}>
                            <ListItem
                                key={id}
                                onClick={() =>
                                    courseSelected.includes(id)
                                        ? removeFromCoursesSelected(id)
                                        : addToCoursesSelected(id)
                                }
                                button
                            >
                                <div style={{ uppercase: "none" }}>
                                    {courseToLabel(course)}
                                </div>
                            </ListItem>
                            <Collapse
                                in={courseSelected.includes(id) ? true : false}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {collapseItem(course)}
                                </List>
                            </Collapse>
                        </div>
                    );
                })}
            </List>
        </SwipeableViews>
    );
};

export default CourseList;
