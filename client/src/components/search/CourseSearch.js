import React, { useState, useEffect } from "react";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA } from "../../utils/analytics";

const dummy = { label: "", value: "" };

const styles = {
    filter: {
        width:"100%",
    },
    button: {
        display:"inline-block", 
        float:"center",
        margin: 8, 
        padding: 2,
    },
}

const CourseSearch = ({ depts, scheduleID }) => {
        const [getDept, setDept] = useState(dummy);
    
        const handleChangeDept = selectedOption => {
            setDept(selectedOption);
        };

        // Initialize Google Analytics
        initGA();

        return (
        <div className="Search">
            <div style={styles.filter}>
                <p style={styles.button}>Department</p>
                <Selection
                    title="Department"
                    options={depts} 
                    selected={getDept}
                    show={true}
                    handleChange={handleChangeDept}
                />
            </div>
            <CourseList scheduleID={scheduleID} department={getDept.value} />
        </div>
        );
}

export default CourseSearch;