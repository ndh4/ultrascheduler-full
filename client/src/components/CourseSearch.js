import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import config from "../config";
import Selection from "./Selection";

const dummy = {label:"", value:""};

const sessionToString = (prefix, session) => {
    let result = [];
    console.log(session);
    if (session.class.days.length > 0) {
        let classTime = "Class: " + session.class.days.join("")
        classTime += " " + session.class.startTime + "-" + session.class.endTime
        result.push(classTime);
    }
    if (session.lab.days.length > 0) {
        let labTime = "Lab: " + session.lab.days.join("")
        labTime += " " + session.lab.startTime + "-" + session.lab.endTime
        result.push(labTime);
    }
    return prefix + " // " +  ((result.length > 0) ? result.join(", ") : "No class times");
}

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
                let prefix = subject + " " + number + " // " + longTitle;
                courseObj["terms"][0]["sessions"].forEach(session => {
                    let label = sessionToString(prefix, session);
                    classes.push({ label: label, value: label, crn:courseObj.crn, session:session})
                })
            });
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
            {searchResults.map(res => (
                <div style={styles.result} key={res.crn} onClick={() => console.log("clicked " + res.label)}>
                    <p>{res.label}</p>
                </div>
            ))}
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