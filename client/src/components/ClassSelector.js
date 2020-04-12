import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import {toggleCourse, removeCourse} from '../actions/CoursesActions';

const CourseButton = ({course, toggleCourse, removeCourse}) => (
	<div style={{ borderStyle: 'solid', display: "inline-block", padding: 2, margin: 4}}>
		<p>{course.courseName}</p>
		<button key={course.crn} onClick={() => toggleCourse(course.crn)}>Toggle</button>
		<button key={course.crn} onClick={() => removeCourse(course.crn)}>Remove</button>
	</div>
);

const ClassSelector = ({courses, toggleCourse, removeCourse}) => {
	return (<div>
		{courses.map(c => <CourseButton course={c} toggleCourse={toggleCourse} removeCourse={removeCourse}/>)}
	</div>);
}


export default connect(
        (state) => ({
                courses: state.CoursesReducer.draftCourses,
        }),
        (dispatch) => ({
			toggleCourse: crn => dispatch(toggleCourse(crn)),
			removeCourse: crn => dispatch(removeCourse(crn))
        }),
)(ClassSelector);