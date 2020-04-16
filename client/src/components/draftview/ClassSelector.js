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

const ClassSelector = ({draftCourses, toggleCourseRequest, removeCourseRequest}) => {
	const classes = useStyles();
	// Get headers
	let headers = ["Visible", "Course Code", "Class Days", "Class Time", "CRN", "Lab Days", "Lab Times", "Instructor(s)", "Remove"]

	// Initialize GA before use
	initGA();

	const handleCourseRemoveRequest = (course) => {
		let crnString = String.toString(course.crn);
		// Tracking 
		Event("COURSE_SELECTOR", "Remove Course from Schedule: " + crnString, crnString);
		// Remove course
		removeCourseRequest(course)
	}

	return (
		<TableContainer component={Paper}>
			<SwipeableViews containerStyle={styles.slideContainer}>
			<Table stickyHeader={true} className={classes.table} aria-label="simple table">
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
				{draftCourses.map((course) => (
					<DraftCourseItem 
						course={course}
						onToggle={toggleCourseRequest}
						onRemove={handleCourseRemoveRequest}/>
				))}
				</TableBody>
			</Table>
		</SwipeableViews>
		</TableContainer>
	)
}


export default connect(
        (state) => ({
            draftCourses: state.courses.draftCourses,
        }),
        (dispatch) => ({
			toggleCourseRequest: course => dispatch(toggleCourseRequest(course)),
			removeCourseRequest: course => dispatch(removeCourseRequest(course))
        }),
)(ClassSelector);