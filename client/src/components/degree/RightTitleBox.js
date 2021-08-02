import React from 'react'
import './RightTitleBox.css'
import { creditSum } from "./SemesterBox"

const RightTitleBox = () => {
    return (
        <div className='rtbox'>
            <div className='totalCredit'>{creditSum} credits</div>
        </div>
    )
}

export default RightTitleBox