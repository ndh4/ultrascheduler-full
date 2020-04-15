import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import config from "../config";
import Selection from "./Selection";
import CourseList from "./CourseList";
import { initGA, Event } from "../utils/analytics";

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
            let classes = {}
            result.forEach(sessionObj => {
                let subject = sessionObj["subject"];
                let courseNum = sessionObj["courseNum"];
                let longTitle = sessionObj["longTitle"];
                let prefix = subject + " " + courseNum + " || " + longTitle;
                // Check if we already have this prefix
                if (prefix in classes) {
                    classes[prefix].sessions.push(sessionObj.terms.sessions);
                } else {
                    let sessions = [ sessionObj.terms.sessions ];
                    let courseDetail = {
                        _id: sessionObj["_id"], // this is the course object id
                        subject,
                        courseNum,
                        longTitle,
                        term
                    };
                    classes[prefix] = { label: prefix, value: prefix, sessions, detail: courseDetail }
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
}

export default connect(
        (state) => ({
        }),
        (dispatch) => ({
        }),
)(CourseSearch);