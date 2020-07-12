import React from "react";
import CourseList from "./CourseList";
import SwipeableViews from "react-swipeable-views";

const styles = {
    slideContainer: {
      height: 500,
      WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
    },
  };

// Create an array with all of the values of the selected departments
const getDeptValues = (selectedDepts) => {
    let deptValues = [];
    for (let i = 0; i < selectedDepts.length; i++) {
        deptValues.push(selectedDepts[i].value);
    }
    return deptValues;
}

const CompiledLists = ({ scheduleID, selectedDepts }) => {
    let deptValues = getDeptValues(selectedDepts);
    return (
        <SwipeableViews containerStyle={styles.slideContainer}>
            <div>
                {deptValues.map(department => {
                    return (
                        <CourseList scheduleID={scheduleID} department={department} key = {department}/>
                    )
                })}
            </div>
        </SwipeableViews>
    )

};

export default CompiledLists;