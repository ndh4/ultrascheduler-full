import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import config from "../config";
import Selection from "./Selection";
import CourseList from "./CourseList";

const dummy = {label:"", value:""};

const CourseSearch = ({ term, depts }) => {
        const [getDept, setDept] = useState(dummy);
        const [searchResults, setSearchResults] = useState([]);
    
        const handleChangeDept = selectedOption => {
            setDept(selectedOption);
        };

        const searchClasses = async (term, dept) => {
            // Fetch courses by subject
            let response = await fetch(config.backendURL + "/courses/searchCourses?subject="+dept+"&term="+term);
            let result = await response.json();
            // Transform each course into {label: dept + number + long title, value is same}
            const classes = []
            result.forEach(courseObj => {
                let subject = courseObj["subject"];
                let number = courseObj["courseNum"];
                let longTitle = courseObj["longTitle"];
                let prefix = subject + " " + number + " || " + longTitle;
                let sessions = courseObj["terms"][0]["sessions"];
                classes.push({ label: prefix, value: prefix, sessions: sessions });
            });
            console.log(classes);
            setSearchResults(classes);
        }

        if (getDept === dummy) {
            if (depts.length > 0)
                setDept(depts[0]);
            else
                return (<p>Search loading...</p>);
        }

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
                <button style={styles.button} onClick={() => searchClasses(term, getDept.label)}>Search</button>
            </div>
            <CourseList searchResults={searchResults} />
        </div>
        );
}

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
    result: {
        padding:2,
        margin:4,
        background:"#ADDFFF",
    }
}

export default connect(
        (state) => ({
        }),
        (dispatch) => ({
        }),
)(CourseSearch);