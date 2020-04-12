import * as ACTIONS from "../actions/CoursesActions"

const defaultCoursesReducerState = {
        draftCourses: [
                {
                        "days": "TRF",
                        "startTime": [9, 25],
                        "endTime": [10, 40],
                        "courseName": "COMP 182",
                        "instructors": ["Luay, Nakleh"],
                        "lab": {
                            "hasLab": true,
							"labDays": "MWF",
							"labStartTime": [9, 25],
							"labEndTime": [10, 40],
                        },
                        "crn": 123456,
                        "visible": true,
                },
                {
                        "days": "MWF",
                        "startTime": [14, 0],
                        "endTime": [14, 50],
                        "courseName": "CAAM 210",
						"instructors": ["Sershen, Protasov"],
						"lab": {
							"hasLab": false,
						},
                        "crn": 654321,
                        "visible": true,
                },
                {
                        "days": "MWF",
                        "startTime": [10, 0],
                        "endTime": [11, 0],
                        "courseName": "FWIS 151",
						"instructors": ["Smith, Doe"],
						"lab": {
							"hasLab": false
						},
                        "crn": 655657,
                        "visible": true,
                },
                {
                        "days": "S",
                        "startTime": [6, 19],
                        "endTime": [13, 37],
                        "courseName": "HELL 666",
						"instructors": ["Pher, Lucy"],
						"lab": {
                            "hasLab": true,
							"labDays": "TF",
							"labStartTime": [9, 25],
							"labEndTime": [10, 40],
                        },
                        "crn": 239530,
                        "visible": false,
                },
                {
                        "days": "U",
                        "startTime": [22, 30],
                        "endTime": [23, 30],
                        "courseName": "SLPZ 222",
						"instructors": ["Baere, James", "Roosevelt, Theodore"],
						"lab": {
							"hasLab": false
						},
                        "crn": 222222,
                        "visible": false,
                }

        ]
}

const CoursesReducer = (state=defaultCoursesReducerState, action) => {
        switch (action.type) {
                case ACTIONS.ADD_COURSE:
                        return {...state, draftCourses: state.draftCourses.push(action.course)};
                case ACTIONS.REMOVE_COURSE:
                        return {...state, draftCourses: state.draftCourses.filter(c => c.crn != action.crn)};
                case ACTIONS.TOGGLE_COURSE:
                        let copy = [...state.draftCourses]
                        let crnIdx = copy.findIndex(c => c.crn === action.crn);
                        copy[crnIdx].visible = !copy[crnIdx].visible;
                        return {...state, draftCourses: copy};
                default:
                        return {...state};
        }
}

export default CoursesReducer;
