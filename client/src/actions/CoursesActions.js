export const ADD_COURSE = "ADD_COURSE";
export const REMOVE_COURSE = "REMOVE_COURSE";
export const TOGGLE_COURSE = "TOGGLE_COURSE";
export const ADD_COURSE_REQUEST = "ADD_COURSE_REQUEST"
export const REMOVE_COURSE_REQUEST = "REMOVE_COURSE_REQUEST"
export const TOGGLE_COURSE_REQUEST = "TOGGLE_COURSE_REQUEST";
export const SET_SCHEDULE = "SET_SCHEDULE";

export const addCourseRequest = (course) => {
	return {
		type: ADD_COURSE_REQUEST,
		course
	}
}

export const removeCourseRequest = (course) => {
	return {
		type: REMOVE_COURSE_REQUEST,
		course
	}
}

export const toggleCourseRequest = (course) => {
	return {
		type: TOGGLE_COURSE_REQUEST,
		course
	}
}

export const addCourse = (course) => {
	// First add to backend
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