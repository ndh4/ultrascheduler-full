import React, {Component} from 'react'
import Header from "./Header";
import CourseCalendar from "./Calendar";

const Main = () => {
    return (
        <div className="App" stle={{ display: "inline" }}>
			<Header />
			<CourseCalendar />
		</div>
    )
}

export default Main;