import React from 'react';
import './RowBox.css';
import LeftCourseBox from './LeftCourseBox';
import RightCourseBox from './RightCourseBox';

const CourseRowBox = () => {
    return (
        <div className='rowBox'>
            <LeftCourseBox />
            <RightCourseBox />
        </div>
    )
}

export default CourseRowBox

