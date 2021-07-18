import React from 'react'
import Semester from './SemesterBox'
import './DegreePlan.css'

const DegreePlan = () => {
    return (
        <div className='layout'>
            <Semester />
            <Semester />
            <Semester />
            <Semester />
        </div>
    )
}

export default DegreePlan
