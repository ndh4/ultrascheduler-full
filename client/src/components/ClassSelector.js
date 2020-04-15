import React, { useState, useEffect, Fragment } from "react";
import {connect} from 'react-redux';
import {toggleCourseRequest, removeCourseRequest} from '../actions/CoursesActions';

import { classTimeString } from '../utils/transformCourseTime';

import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// Course evals
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';

// Course visible
import Checkbox from '@material-ui/core/Checkbox';

// Has lab
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// Delete course
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SwipeableViews from "react-swipeable-views";

// Tracking
import ReactGA from "react-ga";
import { initGA } from "../utils/analytics";

const useStyles = makeStyles({
	table: {
	  minWidth: 650,
	},
  });

const createURL = (crn, detail=true) => {
	if (detail) {
		// Return detail
		return `https://courses.rice.edu/courses/!SWKSCAT.cat?p_action=COURSE&p_term=202110&p_crn=${crn}`;
	} else {
		// Return eval
		return `https://esther.rice.edu/selfserve/swkscmt.main?p_term=202110&p_crn=${crn}&p_commentid=&p_confirm=1&p_type=Course`;
	}
}

const ClassSelector = ({draftCourses, toggleCourseRequest, removeCourseRequest}) => {
	const classes = useStyles();

	// Get headers
	let headers = ["Visible", "Course Code", "Class Days", "Class Time", "Has Lab?", "Lab Days", "Lab Times", "Instructor(s)", "Remove"]

	const styles = {
		slideContainer: {
		  height: '30vh',
		  width: '100vw',
		  WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
		},
	  };

	const emptyCellGenerator = (count) => {
		let cells = [];
		for (let i = 0; i < count; i++) {
			cells.push(<TableCell align="right"></TableCell>);
		}
		return cells;
	}

	// Initialize GA before use
	initGA();

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
						<TableRow key={course.crn}>
							<TableCell padding="checkbox">
								<Checkbox
								checked={course.visible}
								onClick={() => toggleCourseRequest(course)}
								/>
							</TableCell>
							<TableCell align="right" component="th" scope="row">
								<Tooltip title="View Course Details">
									<ReactGA.OutboundLink eventLabel="Course Description" to={createURL(course.crn)} target="_blank" style={{ color: "272D2D" }}>
										{course.courseName}
									</ReactGA.OutboundLink>
									{/* <a href={createURL(course.crn)} target="_blank" style={{ color: '#272D2D' }}></a> */}
								</Tooltip>
								<Tooltip title="View Evaluations">
									<IconButton aria-label="evaluations" onClick={() => window.open(createURL(course.crn, false), "_blank")}>
										<QuestionAnswerIcon />
									</IconButton>
								</Tooltip>
							</TableCell>
							{course.class.hasClass ? (
								<Fragment>
									<TableCell align="right">{course.class.days}</TableCell>
									<TableCell align="right">{classTimeString(course.class.startTime, course.class.endTime)}</TableCell>
								</Fragment>
							) : <Fragment>{emptyCellGenerator(2)}</Fragment>}
							{course.lab.hasLab ? (
								<Fragment>
									<TableCell align="right"><CheckCircleIcon /></TableCell>
									<TableCell align="right">{course.lab.days}</TableCell>
									<TableCell align="right">{classTimeString(course.lab.startTime, course.lab.endTime)}</TableCell>
								</Fragment>
							) : <Fragment>{emptyCellGenerator(3)}</Fragment>}
							<TableCell align="right">{course.instructors.join(" | ")}</TableCell>
							<TableCell align="right">
								<Tooltip title="Delete">
									<IconButton aria-label="delete" onClick={() => removeCourseRequest(course)}>
										<DeleteIcon />
									</IconButton>
								</Tooltip>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			</SwipeableViews>
		</TableContainer>
	)
	// return (
	// 	<List>
	// 		{courses.map(course => {
	// 			return (
	// 				<ListItem key={course.crn} onClick={() => toggleCourse(course.crn)}>
	// 					{course.courseName}
	// 				</ListItem>
	// 			)
	// 		})}
	// 	</List>
	// )
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