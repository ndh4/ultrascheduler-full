import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';

const Course = ({name, visible, toggle}) => {
    if (!visible)
        {return null}
    return(
    <div style={{border: "3px solid black"}} onClick={toggle}>
        <h1>
            {name}
        </h1>
    </div>    
    
    )
}



export default Course;
