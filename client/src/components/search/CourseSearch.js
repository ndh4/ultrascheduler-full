import React, { useState, useEffect } from "react";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA } from "../../utils/analytics";
import { useQuery, gql } from "@apollo/client";
import Button from "@material-ui/core/Button";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "./CourseSearch.global.css";

const dummy = { label: "", value: "" };
const dummy2 = { label: "", value: "", firstName: "", lastName: "" };

/**
 * TODO: MAKE A FRAGMENT! THIS IS USED IN TWO PLACES
 * Gets the term from local state management
 */
const GET_TERM = gql`
    query {
        term @client
    }
`;

const GET_DEPARTMENTS = gql`
    query GetDepartments($term: Int!) {
        departments(term: $term)
    }
`;

const GET_DEPT_COURSES = gql`
    query GetDeptCourses($subject: String!, $term: Float!) {
        courseMany(filter: { subject: $subject }, sort: COURSE_NUM_ASC) {
            _id
            subject
            courseNum
            longTitle
            sessions(filter: { term: $term }) {
                _id
                crn
                class {
                    days
                    startTime
                    endTime
                }
                lab {
                    days
                    startTime
                    endTime
                }
                instructors {
                    firstName
                    lastName
                }
            }
        }
    }
`;

// new:
const GET_DIST_COURSES = gql`
    query CourseQuery($distribution: String!, $term: Float!) {
        courseMany(
            filter: { distribution: $distribution }
            sort: SUBJECT_AND_COURSE_NUM_ASC
        ) {
            _id
            subject
            courseNum
            longTitle
            distribution
            sessions(filter: { term: $term }) {
                _id
                crn
                class {
                    days
                    startTime
                    endTime
                }
                lab {
                    days
                    startTime
                    endTime
                }
                instructors {
                    firstName
                    lastName
                }
            }
        }
    }
`;

//NEWWWWW
const GET_INSTRUCTORS = gql`
    query getInstructors {
        instructorMany {
            firstName
            lastName
        }
    }
`;
const COURSES_BY_INSTRUCTORS = gql`
    query InstructorQuery(
        $firstName: String!
        $lastName: String!
        $term: Float!
    ) {
        instructorOne(filter: { firstName: $firstName, lastName: $lastName }) {
            sessions(filter: { term: $term }) {
                _id
                term
                course {
                    subject
                    courseNum
                    longTitle
                }
                class {
                    days
                    startTime
                    endTime
                }
                lab {
                    days
                    startTime
                    endTime
                }
                crn
            }
        }
    }
`;

const CourseSearch = ({ scheduleID }) => {
    const [getDepts, setDepts] = useState([]); // Used for the entire list of departments
    const [getDept, setDept] = useState(dummy); // Used for selection of a particular department

    const [getDist, setDist] = useState(dummy); // Used for selection of a particular distribution

    //INSTRUCTOR SEARCH
    const [getInstruct, setInstruct] = useState([]); // Used for the entire list of instructors
    const [getInst, setInst] = useState(dummy2); // Used for selection of a particular instructor

    const allDistributions = [
        { label: "Distribution I", value: "Distribution I" },
        { label: "Distribution II", value: "Distribution II" },
        { label: "Distribution III", value: "Distribution III" },
    ]; // All distributions

    // Represents which button is currently clicked for styling and returning data
    const [activeButtonIndex, setButtonIndex] = useState(0);

    const {
        data: { term },
    } = useQuery(GET_TERM); // Gets the term which we need to request subjects from

    const { data: departmentsData } = useQuery(GET_DEPARTMENTS, {
        variables: { term },
    });

    //get instructor data
    const { data: instructorData } = useQuery(GET_INSTRUCTORS, {
        variables: { term },
    });

    //deal with instructor names with different structures (ex. Benjamin C. Kerswell, Maria Fabiola Lopez Duran, Benjamin Fregly)
    //easier to split into first and last names for query in InstructorList
    const instructorsToSplit = (instructors) => {
        let instructorNames = [];
        for (let instructor of instructors) {
            let instructorName =
                instructor.firstName + " " + instructor.lastName;
            instructorNames.push({
                fullName: instructorName,
                firstName: instructor.firstName,
                lastName: instructor.lastName,
            });
        }
        return instructorNames;
    };

    // These variables are used in displaySearch function and displayCourseList function:
    // Department is used as a placeholder for Instructors for now
    const searchTypes = ["Department", "Distribution", "Instructors"];
    const allOptions = [getDepts, allDistributions, getInstruct];
    const allSelected = [getDept, getDist, getInst];
    const setFuncs = [setDept, setDist, setInst];
    const variables4Query = [
        { subject: getDept.value },
        { distribution: getDist.value },
        {
            firstName: getInst.firstName,
            lastName: getInst.lastName,
        },
    ];
    const getQuery = [
        GET_DEPT_COURSES,
        GET_DIST_COURSES,
        COURSES_BY_INSTRUCTORS,
    ];
    /**
     * We only want this to run when the subjects list data loads
     */
    useEffect(() => {
        if (departmentsData) {
            let { departments } = departmentsData;
            setDepts(departments.map((dept) => ({ label: dept, value: dept })));
        }
    }, [departmentsData]);

    //for instructor data
    useEffect(() => {
        if (instructorData) {
            let instructors = instructorData["instructorMany"];
            let instructorList = instructorsToSplit(instructors);
            setInstruct(
                instructorList.map((inst) => ({
                    label: inst.fullName,
                    value: inst.fullName,
                    firstName: inst.firstName,
                    lastName: inst.lastName,
                }))
            );
        }
    }, [instructorData]);

    // Set the selected departmen/distribution
    const handleChange = (selectedOption) => {
        const setFunc = setFuncs[activeButtonIndex];
        setFunc(selectedOption);
    };

    // Set color theme for the button for clicked and unclicked effect
    const muiTheme = createMuiTheme({
        palette: {
            primary: { main: "#697E99" },
            secondary: { main: "#FFFFFF" },
        },
    });

    const renderSearchOptions = () => {
        return searchTypes.map((type, index) => {
            /**
             * If the current index of the element is the same as the
             * active button index, then the button color is primary.
             * Otherwise, the button color is secondary.
             *
             */
            const buttonColor =
                index === activeButtonIndex ? "primary" : "secondary";

            return (
                <ThemeProvider
                    theme={muiTheme}
                    //replace key with uuid
                    key={index}
                >
                    <Button
                        style={{
                            textTransform: "none",
                            marginRight: "12px",
                            padding: "1px 24px 1px 24px",
                            borderRadius: "25px",
                            fontSize: "12px",
                        }}
                        color={buttonColor}
                        size="small"
                        variant="contained"
                        onClick={() => {
                            setButtonIndex(index);
                        }}
                    >
                        {type}
                    </Button>
                </ThemeProvider>
            );
        });
    };

    /**
     * Displays the search component based on whether user is searching
     * by distribution or by department
     */
    const displaySearch = () => {
        const searchType = searchTypes[activeButtonIndex];
        const option = allOptions[activeButtonIndex];
        const selected = allSelected[activeButtonIndex];

        return (
            <Selection
                className="filter"
                title={searchType}
                options={option}
                selected={selected}
                show={true}
                handleChange={handleChange}
            />
        );
    };

    /**
     * Displays the course list component based on whether user is searching
     * by distribution or by department
     */
    const displayCourseList = () => {
        return (
            <CourseList
                scheduleID={scheduleID}
                query={getQuery[activeButtonIndex]}
                searchType={variables4Query[activeButtonIndex]}
            />
            //<div></div>
        );
    };

    // Initialize Google Analytics
    initGA();

    return (
        <div className="searchBar">
            <div>
                <div className="filter">{displaySearch()}</div>
                <div className="searchTxt">Search By:</div>
                <div className="buttons">{renderSearchOptions()}</div>
            </div>
            {displayCourseList()}
        </div>
    );
};

export default CourseSearch;
