import React from 'react';
import './LeftTitleBox.css'

const LeftTitleBox = (props) => {
    return (
        <div className='ltbox'>
            <div className='year'>{props.year}</div>
            <div className='semester'>{props.semester}</div>
        </div>
    )
}

export default LeftTitleBox
