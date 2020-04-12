import React from 'react'
import {connect} from 'react-redux';
import * as dates from 'date-arithmetic'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'

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
        let range = Array.from({length: 7}, (x,i) => dates.add(date, i, 'day'));
        let showWeekend = false;
        // let showWeekend = [false, false];
        let startHr = 8;
        let endHr = 14;
        courses.forEach(c => {
            // Skip invisible courses
            if (!c.visible) return;
            // Check whether or not to show the weekend
            if (!showWeekend && (c.days.indexOf("U") > -1 || c.days.indexOf("S") > -1)) 
                showWeekend = true;
            // if (!showWeekend[0] && c.days.indexOf("U") > -1) showWeekend[0] = true;
            // if (!showWeekend[1] && c.days.indexOf("S") > -1) showWeekend[1] = true;
            startHr = min(startHr, c.startTime[0] - 1);
            endHr = max(endHr, c.endTime[0] + 1);
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
          courses: state.CoursesReducer.courses,
  }),
  (dispatch) => ({}),
)(CourseWeek);
