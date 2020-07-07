import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SwipeableViews from "react-swipeable-views";

import DraftCourseItem from "./DraftCourseItem";

const useStyles = makeStyles({
	table: {
		width: "100%",
	},
});

const styles = {
	slideContainer: {
		maxHeight: "50vh",
		maxWidth: "100vw",
		WebkitOverflowScrolling: "touch", // iOS momentum scrolling
	},
};

const ClassSelector = ({ draftSessions, scheduleID }) => {
	const classes = useStyles();
	// Get headers
	let headers = [
		"Visible",
		"Course Code",
		"CRN",
		"Credits",
		"Distribution",
		"Class Times",
		"Lab Times",
		"Enrollment",
		"Waitlisted",
		"Instructor(s)",
		"Remove",
	];

	// Calculate total credit hours
	let creditTotal = draftSessions.reduce((totalCredits, draftSession) => {
		if (draftSession.visible) {
			return totalCredits + draftSession.session.course.creditsMin;
		} else {
			return totalCredits;
		}
	}, 0);

	return (
		<TableContainer component={Paper}>
			<SwipeableViews containerStyle={styles.slideContainer}>
				<Table
					stickyHeader={true}
					stickyFooter={true}
					className={classes.table}
					aria-label="simple table"
				>
					<colgroup>
						<col style={{ width: "3%" }}></col>
						<col style={{ width: "20%" }}></col>
						<col style={{ width: "3%" }}></col>
						<col style={{ width: "3%" }}></col>
						<col style={{ width: "3%" }}></col>
						<col style={{ width: "17.5%" }}></col>
						<col style={{ width: "17.5%" }}></col>
						<col style={{ width: "10%" }}></col>
						<col style={{ width: "10%" }}></col>
						<col style={{ width: "10%" }}></col>
						<col style={{ width: "3%" }}></col>
					</colgroup>
					<TableHead>
						<TableRow>
							{headers.map((heading, idx) => {
								if (idx == 0) {
									return <TableCell>{heading}</TableCell>;
								} else {
									return (
										<TableCell align="right">
											{heading}
										</TableCell>
									);
								}
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{draftSessions.map((draftSession) => (
							<DraftCourseItem
								visible={draftSession.visible}
								session={draftSession.session}
								course={draftSession.session.course}
								scheduleID={scheduleID}
							/>
						))}
					</TableBody>
				</Table>
			</SwipeableViews>
			<Table>
				<TableRow>
					<TableCell align="left">
						Total Visible Hours: {creditTotal}
					</TableCell>
				</TableRow>
			</Table>
		</TableContainer>
	);
};

export default ClassSelector;
