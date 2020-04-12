import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import {toggleCourse} from '../actions/CoursesActions';

const ClassSelector = ({courses, toggleCourse}) => {
	return (<div>
		{courses.map(c => 
			(<button key={c.crn} onClick={() => toggleCourse(c.crn)}>
				{c.courseName}
			</button>))}
	</div>);
}

export default connect(
        (state) => ({
                courses: state.CoursesReducer.draftCourses,
        }),
        (dispatch) => ({
			toggleCourse: crn => dispatch(toggleCourse(crn))
        }),
)(ClassSelector);