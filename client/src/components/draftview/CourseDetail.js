import React from "react";
import { Table, TableBody, TableRow, TableCell, Box } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";

/* Return a div for each row */
const formatDiv = (bold, normalTxt) => {
    console.log("bold", bold);
    console.log("normaltxt", normalTxt);
    if (normalTxt === undefined) {
        console.log("undefined!!!!!!!!!");
    }
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
        default:
            return text;
    }
};

/* Component for collapsible displaying prereqs and coreqs of a course */
const collapse = ({
    course,
    session,
    instructorsToNames,
    open,
    classTimeString,
}) => {
    const Times = (section) => {
        if (!section.startTime || !section.endTime) {
            return "None";
        } else {
            return (
                <div>
                    {section.days}{" "}
                    {classTimeString(section.startTime, section.endTime)}
                </div>
            );
        }
    };
    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Table>
                        <TableBody>
                            <TableCell>
                                {formatDiv("Class Time:", Times(session.class))}
                                {formatDiv("Lab Time:", Times(session.lab))}
                                {formatDiv(
                                    "Instructor:",
                                    replaceNull(
                                        instructorsToNames(
                                            session.instructors
                                        ).join(", ")
                                    )
                                )}
                                {formatDiv(
                                    "Course Type:",
                                    "Lecture / Laboratory"
                                )}
                                {formatDiv(
                                    "Distribution Group:",
                                    replaceNull(course.distribution)
                                )}
                                {formatDiv("CRN:", replaceNull(session.crn))}
                            </TableCell>
                            <TableCell>
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
                                {formatDiv(
                                    "Enrollment Restrictions:",
                                    replaceNull(course.restrictions)
                                )}
                            </TableCell>
                            <TableCell>
                                {formatDiv("Long Title:", course.longTitle)}
                                {formatDiv(
                                    "Prerequisites:",
                                    course.prereqs === ""
                                        ? "None"
                                        : course.prereqs
                                )}
                                {formatDiv(
                                    "Corequisites:",
                                    course.coreqs.length === 0
                                        ? "None"
                                        : course.coreqs.join(", ")
                                )}
                                {formatDiv("Department:", "N/A")}
                                {formatDiv(
                                    "Session:",
                                    replaceNull(session.term)
                                )}
                                {formatDiv("Grade Mode:", "Standard Letter")}
                            </TableCell>
                        </TableBody>
                    </Table>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
export default collapse;
