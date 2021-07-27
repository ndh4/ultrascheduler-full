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

const DegreePlan = () => {
    const { data, loading, error } = useQuery(QUERY_ALL_USER_SCHEDULES, {
    });

    if (loading) return <p>Loading</p>;
    if (error) return <p>Error</p>;
    if (!data) return <p>Error</p>;   
    
    console.log(data.scheduleMany[1])

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
        </div>
    )
}
export default DegreePlan
