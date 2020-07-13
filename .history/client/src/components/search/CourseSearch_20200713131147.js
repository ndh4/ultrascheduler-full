import React, { useState, useEffect } from "react";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA } from "../../utils/analytics";
import { useQuery, gql } from "@apollo/client";
import Search from "./Search";

const dummy = { label: "", value: "" };

const styles = {
	filter: {
		width: "100%",
	},
	button: {
		display: "inline-block",
		float: "center",
		margin: 8,
		padding: 2,
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


	const handleChangeDept = (selectedOption) => {
		setDept(selectedOption);
	};

	const handleChangeDist = (selectedOption) => {
		setDist(selectedOption);
	};

	const handleChangeSearch = (searchOption) => {
		setSearchType(searchOption);
	};

	const displaySearch = () => {
		if (searchType == "Distribution") {
			return <Selection
				title="Distribution"
				options={allDistributions}
				selected={getDist}
				show={true}
				handleChange={handleChangeDist}
			/>
		}
		else {
			return <Selection
				title="Department"
				options={getDepts}
				selected={getDept}
				show={true}
				handleChange={handleChangeDept}
			/>
		}
	};

	const displayCourseList = () => {
		if (searchType == "Distribution") {
			return <CourseList scheduleID={scheduleID} state="distribution" distribution={getDist.value} />
		}
		else {
			return <CourseList scheduleID={scheduleID} state="department" department={getDept.value} />
		}
	};

	// Initialize Google Analytics
	initGA();

	return (
		<div className="Search">
			<div>
				<p>Search By:</p>
				<button onClick={() => handleChangeSearch("Department")}>Department</button>
				<button onClick={() => handleChangeSearch("Distribution")}>Distribution</button>
			</div>
			<div style={styles.filter}>
				<p style={styles.button}>{searchType}</p>
				{displaySearch()}
			</div>
			{/* <CourseList scheduleID={scheduleID} department={getDept.value} /> */}
			{/* <CourseList scheduleID={scheduleID} distribution={getDist.value} /> */}
			{displayCourseList()}
		</div>
	);
};

export default CourseSearch;
