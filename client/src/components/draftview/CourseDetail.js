import React from "react";
import { Table, TableBody, TableRow, TableCell, Box } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";

/* Component for collapsible displaying prereqs and coreqs of a course*/
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
                                <div>
                                    <b>Class Time: </b> {Times(session.class)}
                                </div>
                                <div>
                                    <b>Lab Time: </b>
                                    {Times(session.lab)}
                                </div>
                                <div>
                                    <b> Instructor: </b>{" "}
                                    {instructorsToNames(
                                        session.instructors
                                    ).join(", ")}
                                </div>
                                <div>
                                    <b>Course Type: </b>
                                    Lecture / Laboratory
                                </div>
                                <div>
                                    <b>Distribution Group: </b>{" "}
                                    {course.distribution}
                                </div>
                                <div>
                                    <b>CRN:</b> {session.crn}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <b>Section Max Enrollment: </b>
                                    {session.maxEnrollment}
                                </div>
                                <div>
                                    <b>Section Enrolled:</b>{" "}
                                    {session.enrollment}
                                </div>
                                <div>
                                    <b>Total Cross-list Max Enrollment: </b>{" "}
                                    {session.maxCrossEnrollment}
                                </div>
                                <div>
                                    <b>Total Cross-list Enrolled:</b>{" "}
                                    {session.crossEnrollment}
                                </div>
                                <div>
                                    <b>Enrollment Restrictions:</b>{" "}
                                    {course.restrictions}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <b>Long Title: </b>
                                    {course.longTitle}
                                </div>
                                <div>
                                    <b>Prerequisites:</b>{" "}
                                    {course.prereqs === ""
                                        ? "None"
                                        : course.prereqs}
                                </div>
                                <div>
                                    <b>Corequisites: </b>
                                    {course.coreqs.length === 0
                                        ? "None"
                                        : course.coreqs.join(", ")}
                                </div>
                                <div>
                                    <b>Department: </b> N/A
                                </div>
                                <div>
                                    <b>Session:</b>
                                    {session.term}
                                </div>
                                <div>
                                    <b>Grade Mode: </b>
                                    Standard Letter
                                </div>
                            </TableCell>
                        </TableBody>
                    </Table>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
export default collapse;
