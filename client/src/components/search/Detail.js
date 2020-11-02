import React, { Fragment, useState } from "react";
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    Box,
    withStyles,
} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import "./Detail.global.css";

const StyledTableBody = withStyles((theme) => ({
    root: {
        backgroundColor: "#F7FAFC",
        borderRadius: "15px",
        borderBottom: "none",
        opacity: 1,
    },
}))(TableBody);

const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: "#F7FAFC",
        borderRadius: "15px",
        opacity: 1,
        borderBottom: "none",
    },
}))(TableRow);

/* Return a div for each row */
const formatDiv = (bold, normalTxt) => {
    return (
        <div>
            <b>{bold}</b> {normalTxt}
        </div>
    );
};
/* Replace undefined or null value to N/A */
const replaceNull = (text) => {
    switch (text) {
        case undefined:
            return "N/A";
        case "":
            return "N/A";
        case null:
            return "N/A";
        default:
            return text;
    }
};

const Detail = ({
    course, //course is multiple sessions or used for instructorQuery
    session, //session is within course; used for courseQuery; for instructorQuery, session and course are the same
    instructorsToNames,
    open,
    classTimeString,
    style,
}) => {
    const Times = (section) => {
        if (!section.startTime || !section.endTime) {
            return "None";
        } else {
            return (
                <span>
                    {section.days}{" "}
                    {classTimeString(section.startTime, section.endTime)}
                </span>
            );
        }
    };
    const Instructors = (session) => {
        if (session.instructors) {
            return formatDiv(
                "Instructor:",
                replaceNull(instructorsToNames(session.instructors).join(", "))
            );
        }
    };
    const longTitle = (course) => {
        if (course.course) {
            return formatDiv("Long Title:", course.course.longTitle);
        } else {
            return formatDiv("Long Title:", course.longTitle);
        }
    };

    return (
        <Collapse className="detailCollapsible" in={open} timeout="auto" unmountOnExit>
            <div className="detail">
                <div className="column">
                    {formatDiv("Class Time:", Times(session.class))}
                    {formatDiv("Lab Time:", Times(session.lab))}
                    {Instructors(session)}
                    {formatDiv("Course Type:", "Lecture/Laboratory")}
                    {formatDiv(
                        "Distribution Group:",
                        replaceNull(session.course.distribution)
                    )}
                    {formatDiv("CRN:", replaceNull(session.crn))}
                </div>
                <div className="column">
                    {formatDiv(
                        "Section Max Enrollment:",
                        replaceNull(session.maxEnrollment)
                    )}
                    {formatDiv(
                        "Section Enrolled:",
                        replaceNull(session.enrollment)
                    )}
                    {formatDiv(
                        "Total Cross-list Max Enrollment:",
                        replaceNull(session.maxCrossEnrollment)
                    )}
                    {formatDiv(
                        "Total Cross-list Enrolled:",
                        replaceNull(session.crossEnrollment)
                    )}
                    {/*look at queries again*/}
                    {/* {formatDiv(
                                        "Enrollment Restrictions:",
                                        replaceNull(course.restrictions)
                                    )} */}
                </div>
                <div className="column">
                    {longTitle(course)}
                    {formatDiv(
                        "Prerequisites:",
                        session.course.prereqs === ""
                            ? "None"
                            : session.course.prereqs
                    )}
                    {formatDiv(
                        "Corequisites:",
                        session.course.coreqs.length === 0
                            ? "None"
                            : session.course.coreqs.join(", ")
                    )}
                    {formatDiv("Department:", "N/A")}
                    {formatDiv("Session:", replaceNull(session.term))}
                    {formatDiv("Grade Mode:", "Standard Letter")}
                </div>
            </div>
        </Collapse>
    );
};

export default Detail;
