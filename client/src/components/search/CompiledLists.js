import React from "react";
import CourseList from "./CourseList";
import SwipeableViews from "react-swipeable-views";

const styles = {
    slideContainer: {
      height: 500,
      WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
    },
  };

// Create an array with all of the values of the selected options
const getValues = (selectedOptions) => {
    let selectedValues = [];
    if(selectedOptions) {
        for (let i = 0; i < selectedOptions.length; i++) {
            selectedValues.push(selectedOptions[i].value);
        }
    }
    return selectedValues.sort();
}

const CompiledLists = ({ scheduleID, selectedOptions, searchKey, query }) => {
    let optionValues = getValues(selectedOptions);
    
    return (
        <SwipeableViews containerStyle={styles.slideContainer}>
            <div>
                
                {
                    // return a CourseList for each of the selected options
                    optionValues.map(option => {
                    let searchType = {[searchKey]: option};
                    return (
                        <CourseList scheduleID={scheduleID} query={query} searchType={searchType} key={option}/>
                    )
                })}
            </div>
        </SwipeableViews>
    )

};

export default CompiledLists;