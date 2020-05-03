import * as ACTIONS from "../actions/CoursesActions"

const defaultCoursesReducerState = {
		draftCourses: [],
                draftCoursesLoaded: false,
                term: "202110"
}

const CoursesReducer = (state=defaultCoursesReducerState, action) => {
        let copy;
        switch (action.type) {
                case ACTIONS.ADD_COURSE:
                        copy = [...state.draftCourses]
						copy.push(action.course);
                        return {...state, draftCourses: copy};
                case ACTIONS.REMOVE_COURSE:
                        return {...state, draftCourses: state.draftCourses.filter(c => c.sessionID != action.sessionID)};
                case ACTIONS.TOGGLE_COURSE:
                        copy = [...state.draftCourses]
                        let sessionIdx = copy.findIndex(c => c.sessionID === action.sessionID);
                        copy[sessionIdx].visible = !copy[sessionIdx].visible;
						return {...state, draftCourses: copy};
				case ACTIONS.SET_SCHEDULE:
					return {...state, draftCourses: action.draftCourses, draftCoursesLoaded: true}
                default:
                        return {...state};
        }
}

export default CoursesReducer;
