import React, { useState, useEffect, useContext } from "react";
import SemesterBox from "./SemesterBox";
import "./DegreePlan.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router";
import { Context as TermContext } from "../../contexts/termContext";
import TitleBox from "./TitleBox";

// query all of the schedules for a user
const QUERY_ALL_USER_SCHEDULES = gql`
    query scheduleMany {
        scheduleMany {
            _id
            term
            user {
                _id
            }
            draftSessions {
                session {
                    course {
                        subject
                        longTitle
                        courseNum
                        creditsMin
                        creditsMax
                        prereqs
                        coreqs
                        distribution
                    }
                    instructors {
                        firstName
                        lastName
                    }
                    maxEnrollment
                }
                visible
            }
            customCourse
            notes
        }
    }
`;

// mutation to add semester, call from onclick the buttons
// const MUTATION_ADD_SEMESTER = gql`
//     mutation degreePlanAddTerm($term: String!) {
//         degreePlanAddTerm(record: { term: $term }) {
//             record {
//                 _id
//                 term
//             }
//         }
//     }
// `;

const MUTATION_ADD_SEMESTER = gql`
    mutation createNewSchedule($term: String!) {
        createNewSchedule(record: { term: $term }) {
            term
            user {
                _id
            }
        }
    }
`;

const DELETE_SEMESTER = gql`
    mutation removeSchedule($_id: MongoID!) {
        removeSchedule(filter: { _id: $_id }) {
            term
            _id
        }
    }
`;

// mutation to delete semester, call from onclick the buttons
// const MUTATION_DELETE_SEMESTER = gql`
//     mutation
// `;

const DegreePlan = () => {
    // to keep the semester in a list to order them
    const [semesterList, setSemesterList] = useState([]);
    const [userId, setUserId] = useState("");
    // get the data from the query
    const { loading, error, data } = useQuery(QUERY_ALL_USER_SCHEDULES);
    const {
        state: { term },
    } = useContext(TermContext);

    // add a new semester from the mutation
    const [mutateSemester, { loadingMutation, errorMutation, dataMutation }] =
        useMutation(MUTATION_ADD_SEMESTER);
    const [
        deleteSemester,
        { loadingMutationDelete, errorMutationDelete, dataMutationDelete },
    ] = useMutation(DELETE_SEMESTER);

    // print status to page (NOTE: Raises Rending more hooks than previous... error)
    // if (loading) return <p>Loading</p>;
    // if (error) return <p>Error</p>;
    // if (!data) return <p>Error</p>;

    useEffect(() => {
        // get only the data we need
        // const defaultSchedule = data.scheduleMany.map(schedule =>
        //     (
        //         {"term": schedule.term,
        //         "draftSessions": schedule.draftSessions,
        //         "notes": schedule.notes}
        //     )
        // );
        const user_id = data?.scheduleMany[0].user._id;
        const defaultSchedule = data?.scheduleMany.map((schedule) => ({
            term: schedule.term,
            draftSessions: schedule.draftSessions,
            notes: schedule.notes,
            _id: schedule._id,
        }));
        setUserId(user_id);
        setSemesterList(defaultSchedule);
    }, [loading, data, error]);
    console.log(userId);

    // adding new semester to semester list (state variable)
    const addNewSem = () => {
        console.log("entered");
        mutateSemester({
            variables: {
                term: term,
                draftSessions: [],
            },
        });
        const newSem = { term: term, draftSessions: [], notes: "", _id: "" };
        setSemesterList([...semesterList, newSem]);
    };
    console.log(semesterList);

    // delete a semester
    const deleteSem = (term, _id) => {
        const updated_list = semesterList.filter(
            (semester) => semester.term != term
        );
        deleteSemester({
            variables: {
                _id: _id,
            },
        });
        setSemesterList(updated_list);
    };

    const history = useHistory();
    return (
        <div>
            <button
                className="button"
                onClick={() => history.push("/schedule")}
            >
                Back To Schedule
            </button>
            <h1 className="title">My Degree Plan</h1>
            <div className="layout">
                {/* {defaultSchedule.map((semester) => {
                return (<SemesterBox term={semester.term} draftSessions={semester.draftSessions} notes={semester.notes} />)
            })} */}
                {semesterList &&
                    semesterList.map((semester, index) => {
                        return (
                            <SemesterBox
                                term={semester.term}
                                draftSessions={semester.draftSessions}
                                notes={semester.notes}
                                //  id={semester.id}
                                deleteSem={() =>
                                    deleteSem(semester.term, semester._id)
                                }
                                currentLength={semesterList.length}
                                index={index}
                                selector={false}
                            />
                        );
                    })}

                <div className="bigBox">
                    <TitleBox term={""} credits={0} selector={true} />

                    <button
                        onClick={() => {
                            addNewSem();
                        }}
                        className="addBtn"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};
export default DegreePlan;
