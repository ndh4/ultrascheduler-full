import React, { useState, useEffect } from 'react'
import Header from "./Header";
import CourseCalendar from "./Calendar";
import ClassSelector from "./ClassSelector";
import CourseSearch from "./CourseSearch";
import config from '../config';

const Main = () => {
    const [depts, setDepts] = useState([]);
    const fetchDepts = async () => {
        let response = await fetch(config.backendURL + "/courses/getAllSubjects");
        let result = await response.json();
        return result;
    }
    useEffect(
        () => {
            fetchDepts()
            .then(subjects => {
                setDepts(subjects.map(dept => ({label: dept, value: dept})));
            })
        }, []
    );
    return (
        <div className="App" style={{ display: "inline", color: "#272D2D" }}>
			<Header />
            <div style={{ padding: "2%" }}>
                <ClassSelector />
            </div>
            <div className="Container" style={{ padding: "2%" }}>
                <div style={{ float: "left", width: '30%' }}>
                    <CourseSearch depts={depts} term="Fall 2020"/>
                </div>
                <div style={{ float: "left", width: '70%' }}>
                    <CourseCalendar />
                </div>
            </div>
		</div>
    )
}

export default Main;