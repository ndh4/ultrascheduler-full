import React, { useState, useEffect } from "react";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA } from "../../utils/analytics";
import { useQuery, gql } from "@apollo/client";
import Button from "@material-ui/core/Button";
import {
    useTheme,
    MuiThemeProvider,
    createMuiTheme,
} from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import { ThemeProvider } from "@material-ui/styles";

const dummy = { label: "", value: "" };

const styles = {
    filter: {
        width: "400px",
        display: "inline-block",
    },
    button: {
        display: "inline-block",
        float: "center",
        marginRight: 8,
        marginTop: 8,
        padding: "1px 8px 1px 8px",
        fontSize: "11px",
        // backgroundColor: "#e6e6e6",
        boxShadow: "none",
        "border-radius": "25px",
        textTransform: "none",
    },
    searchBar: {
        fontSize: "11px",
        display: "inline-block",
    },
    buttons: {
        display: "flex",
    },
};

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

const CourseSearch = ({ scheduleID }) => {
    const [getDepts, setDepts] = useState([]); // Used for the entire list of departments
    const [getDept, setDept] = useState(dummy); // Used for selection of a particular department

    const [getDist, setDist] = useState(dummy); // Used for selection of a particular distribution

    const [searchType, setSearchType] = useState("Department");

    const allDistributions = [
        { label: "Distribution I", value: "Distribution I" },
        { label: "Distribution II", value: "Distribution II" },
        { label: "Distribution III", value: "Distribution III" },
    ]; // All distributions

    const {
        data: { term },
    } = useQuery(GET_TERM); // Gets the term which we need to request subjects from

    const { data: departmentsData } = useQuery(GET_DEPARTMENTS, {
        variables: { term },
    });

    /**
     * We only want this to run when the subjects list data loads
     */
    useEffect(() => {
        if (departmentsData) {
            let { departments } = departmentsData;
            setDepts(departments.map((dept) => ({ label: dept, value: dept })));
        }
    }, [departmentsData]);

    const handleChange = (selectedOption) => {
        if (searchType == "Distribution") setDist(selectedOption);
        if (searchType == "Department") setDept(selectedOption);
        if (searchType == "Instructor") setDept(selectedOption); // This is a temperary holder for instructors which currently display search by distribution
    };

    const muiTheme = createMuiTheme({
        palette: { primary: red, secondary: blue },
    });

    const searchTypes = ["Department", "Distribution", "Instructors"];

    /**
     * This state variable represents which button is currently clicked.
     * The reason we need this is such that we can pass different styling
     * to the button that is clicked. The reason I'm using index is because
     * we already have the above array.
     */
    const [activeButtonIndex, setButtonIndex] = useState(0);

    /**
     * Generally you do not want code that creates HTML (JSX) inside of the
     * return section of a component. This is because it's harder to update
     * and harder to find what code represents what
     *
     * Therefore its usually better to create a function named "renderWhateverYouAreRendering"
     */

    const renderSearchOptions = () => {
        /**
         * Same map as before, but a cool trick with .map, is that the second
         * argument is always the index of the array. I remember using the index
         * of a map very very frequently.
         */
        return searchTypes.map((type, index) => {
            /**
             * If the current index of the element is the same as the
             * active button index, then I make the button color primary.
             * Otherwise, the button color is secondary.
             *
             * Note how I only change the value of a variable and only have one
             * return value. It's "nicer" sometimes to write
             * code like this instead of having multiple returns because you have
             * to write less code
             *
             * An example of multiple returns that I would personally change is
             * the code in the displaySearch function. You see how you are always
             * returning a <Selection/> component? This means that instead of
             * having two returns with differrent props in the component.
             * You can have variables that change based on the same if statement
             * and always pass it down to one <Selection/> component. If, you
             * don't get it, don't worry, I'll talk about some good coding practices
             * this Thursday
             *
             *
             */
            const buttonColor =
                index === activeButtonIndex ? "primary" : "secondary";

            return (
                <ThemeProvider theme={muiTheme}>
                    <Button
                        style={styles.button}
                        color={buttonColor}
                        size="small"
                        variant="contained"
                        onClick={() => setButtonIndex(index)}
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
        if (searchType == "Distribution") {
            return (
                <Selection
                    title="Distribution"
                    options={allDistributions}
                    selected={getDist}
                    show={true}
                    handleChange={handleChange}
                />
            );
        } else {
            return (
                <Selection
                    title="Department"
                    options={getDepts}
                    selected={getDept}
                    show={true}
                    handleChange={handleChange}
                />
            );
        }
    };

    /**
     * Displays the course list component based on whether user is searching
     * by distribution or by department
     */
    const displayCourseList = () => {
        if (searchType == "Distribution") {
            return (
                <CourseList
                    scheduleID={scheduleID}
                    type="distribution"
                    distribution={getDist.value}
                />
            );
        } else {
            return (
                <CourseList
                    scheduleID={scheduleID}
                    type="department"
                    department={getDept.value}
                />
            );
        }
    };

    // Initialize Google Analytics
    initGA();

    return (
        <div className="Search">
            <div>
                <div style={styles.filter}>{displaySearch()}</div>
                <div
                    style={{
                        fontSize: "12px",
                        marginLeft: "4px",
                        marginTop: "3px",
                    }}
                >
                    Search By:
                    {/* <p style={{ fontSize: "12px", marginLeft: "4px" }}>Search By:</p> */}
                </div>
                <div style={styles.buttons}>{renderSearchOptions()}</div>
            </div>
            {displayCourseList()}
        </div>
    );
};

export default CourseSearch;
