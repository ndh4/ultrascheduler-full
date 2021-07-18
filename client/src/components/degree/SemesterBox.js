import React from 'react'
import './SemesterBox.css'
import CourseRowBox from './CourseRowBox'
import TitleBox from './TitleBox'

const SemesterBox = () => {
    return (
        <div className='semesterFlexBox'>
            <TitleBox />
            <CourseRowBox />
            <CourseRowBox />
            <CourseRowBox />
            <CourseRowBox />
            <CourseRowBox />
        </div>
    )
}

export default SemesterBox
