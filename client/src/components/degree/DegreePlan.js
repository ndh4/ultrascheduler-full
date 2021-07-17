import React from 'react'
import './DegreePlan.css'

const DegreePlan = () => {
    return (
        <div className='semesterFlexBox'>
            <div className='titleBox'>
                <div className='titleText'>2018 FALL SEMESTER</div>
                <div className='titleText'>15 credits</div>
            </div>
            <div className='vertLine'></div>
            <div className='courseBox'>
                <div className='boldText'>ARCH 102</div>
                <div className='normalText'>PRINCIPLES OF ARCHITECTURE II</div>
                <div className='normalText'>3</div>
            </div>
            <div className='courseBox'>
                <div className='boldText'>ARCH 102</div>
                <div className='normalText'>PRINCIPLES OF ARCHITECTURE II</div>
                <div className='normalText'>3</div>
            </div>
            <div className='courseBox'>
                <div className='boldText'>ARCH 102</div>
                <div className='normalText'>PRINCIPLES OF ARCHITECTURE II</div>
                <div className='normalText'>3</div>
            </div>
            <div className='courseBox'>
                <div className='boldText'>ARCH 102</div>
                <div className='normalText'>PRINCIPLES OF ARCHITECTURE II</div>
                <div className='normalText'>3</div>
                {/* separate the credit and course name boxes (12 total) */}
            </div>
            <div className='transparentCourseBox'>
                <div className='boldText'>ARCH 102</div>
                <div className='normalText'>PRINCIPLES OF ARCHITECTURE II</div>
                <div className='normalText'>3</div>
            </div>
            {/* <div className='courseBox'>
                <h10>Code</h10>
                <h10>Name</h10>
                <h10># credits</h10>
            </div> */}
            {/* <div className='horizLine'>
                <h10>Code</h10>
                <h10>Name</h10>
                <h10># credits</h10>
            </div> */}
        </div>
    )
}

export default DegreePlan
