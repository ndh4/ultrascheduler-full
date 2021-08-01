import React, {useEffect} from 'react'
import Semester from './SemesterBox'
import './DegreePlan.css'
import { gql, useMutation, useQuery } from "@apollo/client";

const QUERY_ALL_USER_SCHEDULES = gql`
    query scheduleMany {
        scheduleMany {
        _id
        term
        draftSessions {
            session {
            course {
                subject
                longTitle
                courseNum
                creditsMin
                creditsMax
                prereqs
            }
            instructors{
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

const FIND_CREATE_SCHEDULE = gql`
    query scheduleOne($term: String!) {
        scheduleOne(filter: { term: $term }) {
        _id
        term
        draftSessions {
            session {
            course {
                subject
                longTitle
                courseNum
                creditsMin
                creditsMax
                prereqs
            }
            instructors{
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

// const MUTATION_CREATE_SCHEDULE = gql`
//     mutation {
//         degreePlanAddTerm(record: {**nothing in here for now**}) {
//         term
//         customCourse
//         notes
//         }
//     }
// `;

// const MUTATION_REMOVE_SCHEDULE = gql`
//     mutation {
//         degreePlanRemoveTerm(record: {_id: ID!}) {
//         _id
//         }
//     }
// `;

/**
 * Removes the custom course from the term
 */
const REMOVE_CUSTOM_COURSE = gql`
    mutation RemoveCustomCourse($scheduleID: ID!, $sessionID: ID!) {
        scheduleRemoveSession(scheduleID: $scheduleID, sessionID: $sessionID) {
            _id
            term
            draftSessions {
                _id
                session {
                    _id
                }
                visible
            }
        }
    }
`;

const DegreePlan = () => {
    const { data, loading, error } = useQuery(QUERY_ALL_USER_SCHEDULES, {
    });

    if (loading) return <p>Loading</p>;
    if (error) return <p>Error</p>;
    if (!data) return <p>Error</p>;   
    
    console.log("Hi")
    console.log(data.scheduleMany[1])
    console.log("Hi")

    // let [removeCustomCourse] = useMutation(REMOVE_CUSTOM_COURSE, {
    //     variables: { scheduleID: scheduleID, sessionID: session._id },
    // });

    // let [findOrCreateSchedule] = useQuery(FIND_CREATE_SCHEDULE, {
    //     variables: { term: "202010"/*new String(term)*/ },
    // });

    return (
        <div className='layout'>
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <Semester />
            <p>
            Hello, this should be the data: {JSON.stringify(data)}
            </p>
            {/* <button onClick={removeCustomCourse()}>
                Remove Course
            </button>

            <button onChange={updateCustomCourse()}>
                Update Course
            </button> */}

            {/* <button onClick={findOrCreateSchedule()}>
                Add Term
            </button> */}
        </div>
    )
}
export default DegreePlan
