import * as ACTIONS from "../actions/CoursesActions"

const defaultCoursesReducerState = {
        draftCourses: []
}

const CoursesReducer = (state=defaultCoursesReducerState, action) => {
        let copy;
        switch (action.type) {
                case ACTIONS.ADD_COURSE:
                        copy = [...state.draftCourses]
						copy.push(action.course);
                        return {...state, draftCourses: copy};
                case ACTIONS.REMOVE_COURSE:
                        return {...state, draftCourses: state.draftCourses.filter(c => c.crn != action.crn)};
                case ACTIONS.TOGGLE_COURSE:
                        copy = [...state.draftCourses]
                        let crnIdx = copy.findIndex(c => c.crn === action.crn);
                        copy[crnIdx].visible = !copy[crnIdx].visible;
                        return {...state, draftCourses: copy};
                default:
                        return {...state};
        }
}

export default CoursesReducer;
