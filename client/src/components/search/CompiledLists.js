import React from "react";
import CourseList from "./CourseList";
import SwipeableViews from "react-swipeable-views";

const styles = {
    slideContainer: {
        height: 500,
        WebkitOverflowScrolling: "touch", // iOS momentum scrolling
    },
};

// Create an array with all of the necessary search values of the selected options
const getValues = (selectedOptions, searchKey, queryFilters) => {
    console.log("selectedOptions", selectedOptions);
    console.log("searchKey", searchKey);
    let selectedValues = [];
    if (selectedOptions) {
        // for each selected option, create a new object and get query filter values
        for (let i = 0; i < selectedOptions.length; i++) {
            let option = {};
            // for each query filter, store appropriate value with the corresponding search key
            for (let j = 0; j < queryFilters.length; j++) {
                option[searchKey[j]] = selectedOptions[i][queryFilters[j]];
            }
            selectedValues.push(option);
        }
    }
    return selectedValues;
};

const displayDaysCourseList = (
    scheduleID,
    query,
    selectedOptions,
    convertDays,
    idx
) => {
    if (selectedOptions) {
        let daysArray = convertDays(
            selectedOptions.map((option) => option.value)
        );
        console.log("daysArray", daysArray);
        let searchType = { days: daysArray };
        return (
            <CourseList
                scheduleID={scheduleID}
                query={query}
                searchType={searchType}
                // key={option[searchKey[0]]}
                idx={idx}
            />
        );
    }
};

const CompiledLists = ({
    scheduleID,
    selectedOptions,
    searchKey,
    query,
    queryFilters,
    convertDays,
    idx,
}) => {
    if (idx === 4)
        return displayDaysCourseList(
            scheduleID,
            query,
            selectedOptions,
            convertDays,
            idx
        );

    let optionValues = getValues(selectedOptions, searchKey, queryFilters);

    return (
        <SwipeableViews containerStyle={styles.slideContainer}>
            <div>
                {
                    // return a CourseList for each of the selected options
                    optionValues.map((option) => {
                        let searchType = {};
                        for (let key of searchKey) {
                            searchType[key] = option[key];
                        }
                        return (
                            <CourseList
                                scheduleID={scheduleID}
                                query={query}
                                searchType={searchType}
                                key={option[searchKey[0]]}
                                idx={idx}
                            />
                        );
                    })
                }
            </div>
        </SwipeableViews>
    );
};

export default CompiledLists;
