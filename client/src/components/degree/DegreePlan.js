import React from 'react'
import Semester from './SemesterBox'
import './DegreePlan.css'
import { useHistory } from "react-router";

const DegreePlan = () => {
    const history = useHistory();
    return (
        <div>
            <button
                className="gotoschedule"
                onClick={() => history.push("/schedule")}
            >
                Back to Schedule
            </button>
            <h1 className='title'>My Degree Plan</h1>
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
        </div>
    )
}

export default DegreePlan
