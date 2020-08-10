import React, { Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SwipeableViews from "react-swipeable-views";

import DraftCourseItem from "./DraftCourseItem";
import { TableBody } from "@material-ui/core";

import "./ClassSelector.global.css";

const useStyles = makeStyles({
    table: {
        width: "100%",
    },
});

const styles = {
    slideContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: "50vh",
        maxWidth: "1600px",
        overflow: "inherit",
        // WebkitOverflowScrolling: "touch", // iOS momentum scrolling
    },
    slide: {
        position: 'sticky',
        top: 0
    }
};

// Styled rows
const StyledTableHeader = withStyles((theme) => ({
    root: {
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        border: "0px",
        opacity: 1,
    },
}))(TableRow);

const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: "#F7FAFC",
        borderRadius: "15px",
        opacity: 1,
    },
}))(TableRow);

const StyledHeaderTableCell = withStyles((theme) => ({
    root: {
        color: "#697E99",
        backgroundColor: "#FFFFFF",
        border: "0px",
    },
}))(TableCell);

const ClassSelector = ({ draftSessions, scheduleID }) => {
    const classes = useStyles();
    // Get headers

    const headers = {
        Visible: false,
        "Course Code": true,
        CRN: true,
        Credits: true,
        Distribution: true,
        "Class Times": true,
        "Lab Times": true,
        "Instructor(s)": true,
        Remove: false,
    };

    // Calculate total credit hours
    let creditTotal = draftSessions.reduce((totalCredits, draftSession) => {
        if (draftSession.visible) {
            return totalCredits + draftSession.session.course.creditsMin;
        } else {
            return totalCredits;
        }
    }, 0);

    return (
        <Fragment>
            <SwipeableViews containerStyle={styles.slideContainer}>
                {/* <div className="tableBody"> */}
                    <div style={styles.slide} className="tableHeader">
                        {Object.keys(headers).map((headerKey) => (
                            <p>{headers[headerKey] ? headerKey : null}</p>
                        ))}
                    </div>
                    {draftSessions.map((draftSession, idx) => (
                        <DraftCourseItem
                            //replace key with uuid
                            key={idx}
                            visible={draftSession.visible}
                            session={draftSession.session}
                            course={draftSession.session.course}
                            scheduleID={scheduleID}
                        />
                    ))}
                {/* </div> */}
            </SwipeableViews>
        </Fragment>
    );

    return (
        <TableContainer>
            <SwipeableViews containerStyle={styles.slideContainer}>
                <Table
                    stickyHeader={true}
                    //commented out cause there was a warning?
                    //stickyFooter={true}
                    className={classes.table}
                    aria-label="simple table"
                >
                    <TableHead>
                        <StyledTableHeader>
                            {headers.map((heading, idx) => {
                                if (idx == 0) {
                                    return (
                                        <StyledHeaderTableCell
                                            //replace key with uuid
                                            key={idx}
                                        ></StyledHeaderTableCell>
                                    );
                                } else {
                                    return (
                                        <StyledHeaderTableCell
                                            align="right"
                                            //replace key with uuid
                                            key={idx}
                                        >
                                            {heading}
                                        </StyledHeaderTableCell>
                                    );
                                }
                            })}
                        </StyledTableHeader>
                    </TableHead>
                    {draftSessions.map((draftSession, idx) => (
                        <DraftCourseItem
                            //replace key with uuid
                            key={idx}
                            visible={draftSession.visible}
                            session={draftSession.session}
                            course={draftSession.session.course}
                            scheduleID={scheduleID}
                        />
                    ))}
                </Table>
            </SwipeableViews>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align="left">
                            Total Visible Hours: {creditTotal}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClassSelector;
