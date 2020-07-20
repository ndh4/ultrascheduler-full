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
    query GetDeptCourses($subject: String!, $term: Float!, $skip: Int, $limit: Int) {
        courseMany(filter: { subject: $subject }, sort: COURSE_NUM_ASC, skip: $skip, limit: $limit ) {
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
    query CourseQuery($distribution: String!, $term: Float!, $skip: Int, $limit: Int) {
        courseMany(
            filter: { distribution: $distribution }
            sort: SUBJECT_AND_COURSE_NUM_ASC,
            skip: $skip, 
            limit: $limit 
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

const CourseSearch = ({ scheduleID }) => {
    const [getDepts, setDepts] = useState([]); // Used for the entire list of departments
    const [getDept, setDept] = useState(dummy); // Used for selection of a particular department

    const [getDist, setDist] = useState(dummy); // Used for selection of a particular distribution

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

    // These variables are used in displaySearch function and displayCourseList function:
    // Department is used as a placeholder for Instructors for now
    const searchTypes = ["Department", "Distribution", "Instructors"];
    const allOptions = [getDepts, allDistributions, getDepts];
    const allSelected = [getDept, getDist, getDept];
    const setFuncs = [setDept, setDist, setDept];
    const variables4Query = [
        { subject: getDept.value },
        { distribution: getDist.value },
        { subject: getDept.value },
    ];
    const getQuery = [GET_DEPT_COURSES, GET_DIST_COURSES, GET_DEPT_COURSES];

    /**
     * We only want this to run when the subjects list data loads
     */
    useEffect(() => {
        if (departmentsData) {
            let { departments } = departmentsData;
            setDepts(departments.map((dept) => ({ label: dept, value: dept })));
        }
    }, [departmentsData]);

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
                <ThemeProvider theme={muiTheme}>
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
