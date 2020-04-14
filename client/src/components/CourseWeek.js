import React from 'react'
import {connect} from 'react-redux';
import * as dates from 'date-arithmetic'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import { timesToMoment } from '../utils/transformCourseTime';

const max = Math.max
const min = Math.min

class CourseWeek extends React.Component {
    static navigate = (date, action) => {
        return date
    }
    static title = date => {
      return `My Awesome Course Schedule`
    }
    render() {
        const {date, courses} = this.props
        console.log(date);
        console.log(courses);
        let range = Array.from({length: 7}, (x,i) => dates.add(date, i, 'day'));
        let showWeekend = false;
        // let showWeekend = [false, false];
        let startHr = 8;
        let endHr = 14;
        // TODO: fix this
        courses.forEach(course => {
            // Skip invisible courses (and new format courses)
            if (!course.visible || (!course.class.days && !course.lab.days)) return;

            // Check whether or not to show the weekend
            if (!showWeekend && (course.class.days.indexOf("U") > -1 || course.class.days.indexOf("S") > -1)) 
                showWeekend = true;
            if (!showWeekend && course.lab.hasLab && (course.lab.days.indexOf("U") > -1 || course.lab.days.indexOf("S") > -1)) 
                showWeekend = true;
            
            // Extend start & end time if needed
            let newStartTime = course.class.startTime;
            let newEndTime = course.class.endTime;

            if (course.lab.hasLab) {
                let labStartTime = course.lab.startTime;
                let labEndTime = course.lab.endTime;

                // Compare lab times with class times
                newStartTime = labStartTime.hour() < newStartTime.hour() ? labStartTime : newStartTime;
                newEndTime = labEndTime.hour() > newEndTime.hour() ? labEndTime : newEndTime;
            }

            // Check min of class & lab start time
            startHr = min(startHr, newStartTime.hour() - 1);

            // Check max of class & lab end time
            endHr = max(endHr, newEndTime.hour() + 1);
        })
        if (!showWeekend)
            range = range.slice(1, range.length - 1)
        // range = range.slice(showWeekend[0] ? 0 : 1, range.length - (showWeekend[1] ? 0 : 1))
        return (
            <TimeGrid
                {...this.props} 
                min={startHr <= 0 ? new Date(0,0,0) : new Date(0, 0, 0, startHr, 30)} 
                max={endHr >= 24 ?  new Date(0, 0, 0, 23, 59, 59) : new Date(0, 0, 0, endHr)} 
                range={range}
                eventOffset={15}/>
        );
    }
}

export default connect(
  (state) => ({
          courses: state.courses.draftCourses,
  }),
  (dispatch) => ({}),
)(CourseWeek);
