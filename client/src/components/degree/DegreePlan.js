import React from 'react'
import Semester from './SemesterBox'
import './DegreePlan.css'
import { useState } from 'react'

const DegreePlan = () => {
    // to keep the semester in a list to order them
    const [semesterList, setSemesterList] = useState([{id: 1},]);

    // adding new semester to semester list (state variable)
    const addNewSem = () => {
        const newSem = {id: semesterList.length + 1}
        setSemesterList([...semesterList, newSem])
    }

    return (
        <div>
            <div className='layout'>
            {semesterList.map(
            (semester) => {
            return (
                <Semester id={semester.id} />)})}
            </div>
            <button onClick={addNewSem} className="addBtn">+</button>
        </div>
    )
}

export default DegreePlan
