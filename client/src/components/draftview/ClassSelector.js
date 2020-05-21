import React from "react";
import {connect} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SwipeableViews from "react-swipeable-views";

// Tracking
import {toggleCourseRequest, removeCourseRequest} from '../../actions/CoursesActions';
import { initGA, Event } from "../../utils/analytics";
import DraftCourseItem from "./DraftCourseItem";
import { TableFooter, Tab } from "@material-ui/core";


const useStyles = makeStyles({
	table: {
		width: "100%"
	}
  });

  const styles = {
	  slideContainer: {
	    maxHeight: '50vh',
	    maxWidth: '100vw',
	    WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
	  },
  };

const ClassSelector = ({draftSessions, toggleCourseRequest, removeCourseRequest}) => {
	const classes = useStyles();
	// Get headers
	let headers = ["Visible", "Course Code", "CRN", "Credits", "Distribution", "Class Days", "Class Time", "Lab Days", "Lab Times", "Instructor(s)", "Remove"]

	// Initialize GA before use
	initGA();

	const handleCourseRemoveRequest = (course) => {
		let crnString = String.toString(course.crn);
		// Tracking 
		Event("COURSE_SELECTOR", "Remove Course from Schedule: " + crnString, crnString);
		// Remove course
		removeCourseRequest(course)
	}

	const emptyCellGenerator = (count) => {
		let cells = [];
		for (let i = 0; i < count; i++) {
			cells.push(<TableCell align="right"></TableCell>);
		}
		return cells;
	}

	// Calculate total credit hours
	let creditTotal = draftSessions.reduce((totalCredits, draftSession) => {
		if (draftSession.visible) {
			return totalCredits + draftSession.session.course.creditsMin;
		} else {
			return totalCredits;
		}
	}, 0);

	console.log(creditTotal);

	return (
		<TableContainer component={Paper}>
			<SwipeableViews containerStyle={styles.slideContainer}>
			<Table stickyHeader={true} stickyFooter={true} className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						{headers.map((heading, idx) => {
							if (idx == 0) {
								return (<TableCell>{heading}</TableCell>)
							} else {
								return (<TableCell align="right">{heading}</TableCell>)
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
						onToggle={toggleCourseRequest}
						onRemove={handleCourseRemoveRequest}/>
				))}
				</TableBody>
			</Table>
			</SwipeableViews>
			<Table>
				<TableRow>
					<TableCell align="left">Total Visible Hours: {creditTotal}</TableCell>
				</TableRow>
			</Table>
		</TableContainer>
	)
}


export default connect(
        (state) => ({
            // draftSessions: state.courses.draftSessions,
        }),
        (dispatch) => ({
			toggleCourseRequest: course => dispatch(toggleCourseRequest(course)),
			removeCourseRequest: course => dispatch(removeCourseRequest(course))
        }),
)(ClassSelector);