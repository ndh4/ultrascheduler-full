import React, { useState, useEffect } from "react";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA } from "../../utils/analytics";
import { useQuery, gql } from "@apollo/client";

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

// const GET_DEPARTMENTS = gql`
// 	query GetDepartments($term: Int!) {
// 		departments(term: $term)
// 	}
// `;
const GET_DISTRIBUTIONS = gql`
	query GetDistributions($term: Int!) {
		distributions(term: $term)
	}
`;

const CourseSearch = ({ scheduleID }) => {
	// const [getDepts, setDepts] = useState([]); // Used for the entire list of departments
	// const [getDept, setDept] = useState(dummy); // Used for selection of a particular department
	const [getDists, setDists] = useState([]); // Used for the entire list of departments
	const [getDist, setDist] = useState(""); // Used for selection of a particular department

	const {
		data: { term },
	} = useQuery(GET_TERM); // Gets the term which we need to request subjects from

	// const { data: departmentsData } = useQuery(GET_DEPARTMENTS, {
	// 	variables: { term },
	// });
	const { data: distributionsData } = useQuery(GET_DISTRIBUTIONS, {
		variables: { term },
	});

    /**
     * We only want this to run when the subjects list data loads
     */
	// useEffect(() => {
	// 	if (departmentsData) {
	// 		let { departments } = departmentsData;
	// 		setDepts(departments.map((dept) => ({ label: dept, value: dept })));
	// 	}
	// }, [departmentsData]);
	useEffect(() => {
		if (distributionsData) {
			let { distributions } = distributionsData;
			setDists(distributions.map((dist) => (dist)));
		}
	}, [distributionsData]);

	// const handleChangeDept = (selectedOption) => {
	// 	setDept(selectedOption);
	// };
	const handleChangeDist = (selectedOption) => {
		setDist(selectedOption);
	};

	// Initialize Google Analytics
	initGA();

	return (
		<div className="Search">
			<div style={styles.filter}>
				<p style={styles.button}>Department</p>
				{/* <Selection
						title="Department"
						options={getDepts}
						selected={getDept}
						show={true}
						handleChange={handleChangeDept}
					/> */}
				<Selection
					title="Distribution"
					options={getDists}
					selected={getDist}
					show={true}
					handleChange={handleChangeDist}
				/>
			</div>
			{/* <CourseList scheduleID={scheduleID} department={getDept.value} /> */}
			<CourseList scheduleID={scheduleID} distribution={getDist.value} />
		</div>
	);
};

export default CourseSearch;
