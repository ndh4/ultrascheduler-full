import createDataContext from "./createDataContext";

const initialState = {
    customCourses: [],
};

const customCourseReducer = (state, action) => {
    switch (action.type) {
        case "ADD_CUSTOM_COURSE":
            return {
                ...state,
                customCourses: [...state.customCourses, action.payload],
            };
        default:
            break;
    }
};

const addCustomCourse = (dispatch) => {
    return (customCourse) => {
        dispatch({ type: "ADD_CUSTOM_COURSE", payload: customCourse });
    };
};

export const { Context, Provider } = createDataContext(
    customCourseReducer,
    { addCustomCourse },
    initialState
);
