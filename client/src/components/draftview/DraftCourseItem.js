import React, { Fragment } from "react";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// Course evals
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
// Course visible
import Checkbox from '@material-ui/core/Checkbox';
// Delete course
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

// Tracking
import ReactGA from "react-ga";
import { classTimeString } from '../../utils/CourseTimeTransforms';
import URLTypes from "../../constants/URLTypes";

const createURL = (termcode, crn, type=URLTypes.DETAIL) => {
	switch (type) {
		case URLTypes.DETAIL:
			return `https://courses.rice.edu/courses/!SWKSCAT.cat?p_action=COURSE&p_term=${termcode}&p_crn=${crn}`;
		case URLTypes.EVAL:
			return `https://esther.rice.edu/selfserve/swkscmt.main?p_term=${termcode}&p_crn=${crn}&p_commentid=&p_confirm=1&p_type=Course`;
		default:
			console.log(`Uknown URL type: ${type}`);
			return "https://rice.edu/"
	}
}

const creditsDisplay = (creditsMin, creditsMax) => {
	if (creditsMax == null) {
		// Only display credit min
		return (<p>{creditsMin}</p>);
	} else {
		return (<p>{creditsMin} - {creditsMax}</p>);
	}
}

const DraftCourseItem = ({ course, onToggle, onRemove }) => {
		const emptyCellGenerator = (count) => {
			let cells = [];
			for (let i = 0; i < count; i++) {
				cells.push(<TableCell align="right"></TableCell>);
			}
			return cells;
		}
		const createCourseTimeCells = (courseTime, exists) => {
				return exists ? (
						<Fragment>
								<TableCell align="right">{courseTime.days}</TableCell>
								<TableCell align="right">
										{classTimeString(courseTime.startTime, courseTime.endTime)}
								</TableCell>
						</Fragment>) 
						: <Fragment>{emptyCellGenerator(2)}</Fragment>;
		}

		console.log(course);

		return (
		<TableRow key={course.crn}>
				<TableCell padding="checkbox">
						<Checkbox
						checked={course.visible}
						onClick={() => onToggle(course)}
						/>
				</TableCell>
				<TableCell align="right" component="th" scope="row">
						<Tooltip title="View Course Details">
								<ReactGA.OutboundLink 
								style={{ color: "#272D2D", textDecoration: 'none' }} 
								eventLabel="course_description" 
								to={createURL("202110", course.crn, URLTypes.DETAIL)} 
								target="_blank">
										<span style={{ color: "272D2D" }}>{course.courseName}</span>
								</ReactGA.OutboundLink>
						</Tooltip>
						<Tooltip title="View Evaluations">
								<ReactGA.OutboundLink 
								eventLabel="course_evaluation" 
								to={createURL("202110", course.crn, URLTypes.EVAL)} 
								target="_blank">
										<IconButton aria-label="evaluations">
										<QuestionAnswerIcon />
										</IconButton>
								</ReactGA.OutboundLink>
						</Tooltip>
				</TableCell>
				<TableCell align="right">{course.crn}</TableCell>
				<TableCell align="right">{creditsDisplay(course.creditsMin, course.creditsMax)}</TableCell>
				<TableCell align="right">{course.distribution}</TableCell>
				{createCourseTimeCells(course.class, course.class.hasClass)}
				{createCourseTimeCells(course.lab, course.class.hasLab)}
				<TableCell align="right">{course.instructors.join(", ")}</TableCell>
				<TableCell align="right">
						<Tooltip title="Delete">
								<IconButton aria-label="delete" onClick={() => onRemove(course)}>
								<DeleteIcon />
								</IconButton>
						</Tooltip>
				</TableCell>
		</TableRow>);
}



export default DraftCourseItem;