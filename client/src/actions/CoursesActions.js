export const ADD_COURSE = "ADD_COURSE";
export const REMOVE_COURSE = "REMOVE_COURSE";
export const TOGGLE_COURSE = "TOGGLE_COURSE";

export const addCourse = (course) => {
        return {
                type: ADD_COURSE,
                course
        };
}

export const removeCourse = (crn) => {
        return {
                type: REMOVE_COURSE,
                crn
        };
}

export const toggleCourse = (crn) => {
        return {
                type: TOGGLE_COURSE,
                crn
        };
}