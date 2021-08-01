import React, {useEffect} from 'react'
import SemesterBox from './SemesterBox'
import './DegreePlan.css'
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from 'react';

const DegreePlan = () => {

    // to keep the semester in a list to order them
    const [semesterList, setSemesterList] = useState([{id: 1},]);

    // adding new semester to semester list (state variable)
    const addNewSem = () => {
        const newSem = {id: semesterList.length + 1}
        setSemesterList([...semesterList, newSem])
    }

    const deleteSem = (id) => {
        const updated_list = semesterList.filter((semester) => semester.id != id)
        setSemesterList(updated_list)
    }

    return (
        <div>
            <div className='layout'>
            {semesterList.map(
            (semester) => {
            return (
                <SemesterBox id={semester.id} deleteSem={() => deleteSem(semester.id)}/>)})}
            <button onClick={addNewSem} className="addBtn">+</button>
            </div>
        </div>
    )
}
export default DegreePlan
