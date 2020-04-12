import * as ACTIONS from "../actions/CoursesActions"

const defaultCoursesReducerState = {
        draftCourses: [
                {
                        "courseName": "COMP 182",
						"instructors": ["Luay, Nakleh"],
						"class": {
							"hasClass": true,
							"days": "TRF",
							"startTime": "0925",
							"endTime": "1040",
						},
                        "lab": {
                            "hasLab": true,
							"days": "F",
							"startTime": "1100",
							"endTime": "1200",
                        },
                        "crn": 123456,
                        "visible": true,
                },
                {
                        "courseName": "CAAM 210",
						"instructors": ["Sershen, Protasov"],
						"class": {
							"hasClass": true,
							"days": "MWF",
							"startTime": "1400",
							"endTime": "1450",
						},
						"lab": {
							"hasLab": false,
						},
                        "crn": 654321,
                        "visible": true,
                },
                // {
                //         "days": "MWF",
                //         "startTime": [10, 0],
                //         "endTime": [11, 0],
                //         "courseName": "FWIS 151",
				// 		"instructors": ["Smith, Doe"],
				// 		"lab": {
				// 			"hasLab": false
				// 		},
                //         "crn": 655657,
                //         "visible": true,
                // },
                // {
                //         "days": "S",
                //         "startTime": [6, 19],
                //         "endTime": [13, 37],
                //         "courseName": "HELL 666",
				// 		"instructors": ["Pher, Lucy"],
				// 		"lab": {
                //             "hasLab": true,
				// 			"labDays": "TF",
				// 			"labStartTime": [9, 25],
				// 			"labEndTime": [10, 40],
                //         },
                //         "crn": 239530,
                //         "visible": false,
                // },
                // {
                //         "days": "U",
                //         "startTime": [22, 30],
                //         "endTime": [23, 30],
                //         "courseName": "SLPZ 222",
				// 		"instructors": ["Baere, James", "Roosevelt, Theodore"],
				// 		"lab": {
				// 			"hasLab": false
				// 		},
                //         "crn": 222222,
                //         "visible": false,
                // }

        ]
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
