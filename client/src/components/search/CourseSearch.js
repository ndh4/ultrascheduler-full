import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import config from "../../config";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA, Event } from "../../utils/analytics";

const dummy = {label:"", value:""};

const CourseSearch = ({ term, depts, scheduleID }) => {
        const [getDept, setDept] = useState(dummy);
        const [searchResults, setSearchResults] = useState([]);
    
        const handleChangeDept = selectedOption => {
            setDept(selectedOption);
        };

        const searchClasses = async (term, dept) => {
            // Fetch courses by subject
            let response = await fetch(config.backendURL + "/courses/newSearchCourses?subject="+dept+"&term="+term);
            let result = await response.json();
            // Transform each course into {label: dept + number + long title, value is same}
            let classes = {}
            result.forEach(sessionObj => {
                console.log(sessionObj);
                let {course, ...session} = sessionObj; // session is all of sessionObj, minus course

                let subject = course["subject"];
                let courseNum = course["courseNum"];
                let longTitle = course["longTitle"];
                let prefix = subject + " " + courseNum + " || " + longTitle;
                // Check if we already have this prefix
                if (prefix in classes) {
                    classes[prefix].sessions.push(session);
                } else {
                    let sessions = [ session ];
                    // Need to set additional details to start
                    classes[prefix] = { label: prefix, value: prefix, sessions, detail: course }
                }
            });
            // Transform classes back into array
            classes = Object.values(classes);
            setSearchResults(classes);
        }

        if (getDept === dummy) {
            if (depts.length > 0)
                setDept(depts[0]);
            else
                return (<p>Search loading...</p>);
        }

        // Initialize GA before use
        initGA();

        const handleSearchClasses = () => {
            // Tracking
            Event("SEARCH", "Search for Department", getDept.label);

            // Search through classes
            searchClasses(term, getDept.label);
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
                <button style={styles.button} onClick={() => handleSearchClasses()}>Search</button>
            </div>
            <CourseList scheduleID={scheduleID} department={getDept.value} searchResults={searchResults} />
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
}

export default connect(
        (state) => ({
            term: state.courses.term
        }),
        (dispatch) => ({
        }),
)(CourseSearch);