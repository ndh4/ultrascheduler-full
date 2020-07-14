import React, { useState, useEffect } from "react";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA } from "../../utils/analytics";
import { useQuery, gql } from "@apollo/client";
import Button from "@material-ui/core/Button";

const dummy = { label: "", value: "" };

const styles = {
	filter: {
		width: '100px',
	},
	button: {
		display: "inline-block",
		float: "center",
		margin: 8,
		padding: 2,
		fontSize: '12px'
	},
	buttons: {
		display: "flex",
		"flex-wrap": "wrap",
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
const GET_DISTRIBUTIONS = gql`
    query GetDistributions($term: Int!) {
        distributions(term: $term)
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
	const { data: distributionsData, error } = useQuery(GET_DISTRIBUTIONS, {
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
	};

	const handleChangeSearch = (searchOption) => {
		setSearchType(searchOption);
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
					<p size="small" style={styles.button}>
						{searchType}
					</p>
					{displaySearch()}
				</div>
				<div>
					<b style={{ fontSize: '12px', margin: 8 }}>Search By:</b>
				</div>
				<div style={styles.buttons}>
					<Button
						style={styles.button}
						size="small"
						variant="contained"
						onClick={() => handleChangeSearch("Department")}
					>
						Department
                    </Button>
					<Button
						style={styles.button}
						size="small"
						variant="contained"
						onClick={() => handleChangeSearch("Distribution")}
					>
						Distribution
                    </Button>
					<Button
						style={styles.button}
						size="small"
						variant="contained"
						onClick={() => handleChangeSearch("Distribution")}
					>
						Instructor
                    </Button>
				</div>
			</div>
			{displayCourseList()}
		</div>
	);
};

export default CourseSearch;
