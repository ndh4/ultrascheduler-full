import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import {toggleCourse} from '../../actions/CoursesActions';
import Course from "../courseview/Course";

const Day = ({day, courses, toggleCourse}) => (
        <li style = {{display:"inline"}}>
            <h1>{day}</h1>
            <ul>
                {
                courses.filter(course => (course.slots[day]))
                        .map(course => (
                        <Course name={course.name} 
                            visible={course.visible} 
                            toggle={() => toggleCourse(course.crn)}
                        />))
                }
            </ul>
        </li>
)

export default connect(
    (state) => ({
    }),
    (dispatch) => ({
        toggleCourse: crn => dispatch(toggleCourse(crn))
    }),
)(Day);