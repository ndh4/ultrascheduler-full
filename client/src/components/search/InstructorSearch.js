import React, { useState, useEffect } from "react";
import InstructorList from "./InstructorList";
import { useQuery, gql } from "@apollo/client";
import Selection from "./Selection";

const dummy = { label: "", value: "", firstName: "", lastName: "" };

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

const GET_TERM = gql`
    query {
        term @client
    }
`;

const GET_INSTRUCTORS = gql`
    query getInstructors {
        instructorMany {
            firstName
            lastName
        }
    }
`;

const InstructorSearch = ({ scheduleID }) => {
    const [getInstruct, setInstruct] = useState([]); // Used for the entire list of instructors
    const [getInst, setInst] = useState(dummy); // Used for selection of a particular instructor

    const {
        data: { term },
    } = useQuery(GET_TERM); // Gets the term which we need to request instructor from

    const { data: instructorData } = useQuery(GET_INSTRUCTORS, {
        variables: { term },
    });

    //deal with instructor names with different structures (ex. Benjamin C. Kerswell, Maria Fabiola Lopez Duran, Benjamin Fregly)
    //easier to split into first and last names for query in InstructorList
    const instructorsToNames = (instructors) => {
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

    useEffect(() => {
        if (instructorData) {
            let instructors = instructorData["instructorMany"];
            let instructorList = instructorsToNames(instructors);
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

    const handleChangeInst = (selectedOption) => {
        setInst(selectedOption);
    };

    return (
        <div className="Search">
            <div style={styles.filter}>
                <p style={styles.button}>Instructor</p>
                <Selection
                    title="Instructor"
                    options={getInstruct}
                    selected={getInst}
                    show={true}
                    handleChange={handleChangeInst}
                />
            </div>
            <InstructorList
                scheduleID={scheduleID}
                instructor={getInst.value}
                firstName={getInst.firstName}
                lastName={getInst.lastName}
            />
        </div>
    );
};
export default InstructorSearch;
