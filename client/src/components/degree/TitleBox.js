import React from 'react'
import LeftTitleBox from './LeftTitleBox'
import RightTitleBox from './RightTitleBox'
import './RowBox.css'

const TitleBox = () => {
    return (
        <div className='rowBox'>
            <LeftTitleBox />
            <RightTitleBox />
        </div>
    )
}

export default TitleBox