import React, { useState, useEffect } from "react";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA } from "../../utils/analytics";
import { useQuery, gql } from "@apollo/client";
import Button from "@material-ui/core/Button";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const dummy = { label: "", value: "" };

const styles = {
	filter: {
		width: "400px",
		display: "inline-block",
		marginTop: 20,
		marginLeft: 20,
	},
	button: {
		display: "flex",
		float: "center",
		marginRight: 8,
		marginTop: 8,
		padding: "1px 8px 1px 8px",
		fontSize: "11px",
		boxShadow: "none",
		borderRadius: "25px",
		textTransform: "none",
		width: "30%",
		justifyContent: "space-around",
	},
	buttons: {
		display: "flex",
		marginLeft: 20,
	},
	searchBar: {
		background: "#E4E8EE",
		border: "2px solid #E4E8EE",
		borderRadius: "15px 0px 0px 15px",
		opacity: 1,
		top: "100vw",
		left: "20vw",
		width: "28vw",
		height: "43vw",
	},
	searchTxt: {
		fontSize: "12px",
		marginLeft: 20,
		marginTop: 8,
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

	// These variables are used in displaySearch function:
	// Department is used as a placeholder for Instructors for now
	const searchTypes = ["Department", "Distribution", "Instructors"];
	const allOptions = [getDepts, allDistributions, getDepts];
	const allSelected = [getDept, getDist, getDept];

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
		if (activeButtonIndex == 0) setDept(selectedOption);
		if (activeButtonIndex == 1) setDist(selectedOption);
		// This is a temperary holder for instructors which currently display search by distribution
		if (activeButtonIndex == 2) setDept(selectedOption);
	};

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
						style={styles.button}
						color={buttonColor}
						size="small"
						variant="contained"
						onClick={() => { setButtonIndex(index) }}
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

		const searchType = searchTypes[activeButtonIndex]
		const option = allOptions[activeButtonIndex]
		const selected = allSelected[activeButtonIndex]

		return (
			<Selection
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
		if (activeButtonIndex == 1) {
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
		<div style={styles.searchBar}>
			<div>
				<div style={styles.filter}>{displaySearch()}</div>
				<div style={styles.searchTxt}>Search By:</div>
				<div style={styles.buttons}>{renderSearchOptions()}</div>
			</div>
			{displayCourseList()}
		</div>
	);
};

export default CourseSearch;
