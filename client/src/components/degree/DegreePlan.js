import React, { useState, }from 'react'
import SemesterBox from './SemesterBox'
import './DegreePlan.css'
import { gql, useQuery, useMutation} from "@apollo/client";

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
                coreqs
                distribution
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

    // get only the data we need
    const defaultSchedule = data.scheduleMany.map(schedule => 
        (
            {"term": schedule.term, 
             "draftSessions": schedule.draftSessions, 
             "notes": schedule.notes}
        )
    );

    return (
        <div>
            <div className='layout'>
            {defaultSchedule.map((semester) => {
                return (<SemesterBox term={semester.term} draftSessions={semester.draftSessions} notes={semester.notes} />)
            })}
            </div>
        </div>
    )
}
export default DegreePlan