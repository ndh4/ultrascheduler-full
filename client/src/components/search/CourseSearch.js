import React, { useState, useEffect } from "react";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA } from "../../utils/analytics";
import { useQuery, gql } from "@apollo/client";
import Button from "@material-ui/core/Button";
import { useTheme, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
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
		backgroundColor: "#e6e6e6",
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

	const searchTypes = ["Department", "Distribution", "Instructors"];

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

	const muiTheme = createMuiTheme({ palette: { primary: red, secondary: blue, }, });
	const [buttonColor, setColor] = useState("primary");

	const handleChangeSearch = (searchOption) => {
		setSearchType(searchOption);
		setColor("secondary");
		console.log(buttonColor);
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
				<div style={styles.filter}>
					{displaySearch()}
				</div>
				<div style={{ fontSize: "12px", marginLeft: "4px", marginTop: "3px" }}>
					Search By:
					{/* <p style={{ fontSize: "12px", marginLeft: "4px" }}>Search By:</p> */}
				</div>
				<div style={styles.buttons}>
					{searchTypes.map((type) => {
						return (
							<ThemeProvider theme={muiTheme}>
								<Button
									color={buttonColor}
									style={styles.button}
									size="small"
									variant="contained"
									onClick={() => handleChangeSearch(`${type}`)}
								>
									{type}
								</Button>
							</ThemeProvider>
						);
					})}
				</div>
			</div>
			{displayCourseList()}
		</div>
	);
};

export default CourseSearch;
