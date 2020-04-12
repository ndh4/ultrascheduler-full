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
        console.log(result);
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
        <div className="App" stle={{ display: "inline" }}>
			<Header />
            <ClassSelector />
            <CourseSearch depts={depts} term="Fall 2017"/>
			<CourseCalendar />
		</div>
    )
}

export default Main;