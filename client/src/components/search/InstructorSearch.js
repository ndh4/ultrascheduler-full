import React, { useState, useEffect } from "react";
import InstructorList from "./InstructorList";
import { useQuery, gql } from "@apollo/client";
import Selection from "./Selection";

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
    const [getInstruct, setInstruct] = useState([]); // Used for the entire list of instructor
    const [getInst, setInst] = useState(dummy); // Used for selection of a particular instructor
    // const allInstructors = [{ label: "Scott Rixner", value: "Scott Rixner" }];

    const {
        data: { term },
    } = useQuery(GET_TERM); // Gets the term which we need to request instructor from

    const { data: instructorData } = useQuery(GET_INSTRUCTORS, {
        variables: { term },
    });

    //PASS IN THE FUNCTION?
    const instructorsToNames = (instructors) => {
        let instructorNames = [];
        for (let instructor of instructors) {
            let instructorName =
                instructor.firstName + " " + instructor.lastName;
            instructorNames.push(instructorName);
        }
        return instructorNames;
    };

    useEffect(() => {
        if (instructorData) {
            let instructors = instructorData["instructorMany"];
            let instructorList = instructorsToNames(instructors);
            setInstruct(
                instructorList.map((inst) => ({
                    label: inst,
                    value: inst,
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
            />
        </div>
    );
};
export default InstructorSearch;
