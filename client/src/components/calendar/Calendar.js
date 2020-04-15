import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import coursetimes from "../../utils/coursetimes";
import moment from 'moment'
import CourseWeek from "./CourseWeek"
import { Calendar, Views, momentLocalizer }  from "react-big-calendar"
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { WEEKSTART } from "../../constants/Defaults";

const localizer = momentLocalizer(moment)

const CourseCalendar = ({courses}) => {
    return (
        <div>
            <Calendar
            events = {coursetimes(courses)}
            step={10}
            timeslots={3}
            localizer={localizer}
            defaultView={Views.WEEK}
            views={{month: false, week: CourseWeek, day: false}}
            defaultDate={WEEKSTART}
            onSelectEvent={event => alert(event.title + "\n" + event.desc + "\n" + event.source)}
            toolbar={false}
            style={style}
            />
        </div>
    )
}

const style = {
    height: '100%'
}

export default connect(
    (state) => ({
            courses: state.CoursesReducer.draftCourses,
    }),
    (dispatch) => ({
        
    }),
)(CourseCalendar);
