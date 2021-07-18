import React from "react";
import "./SemesterBox.css";
import CourseRowBox from "./CourseRowBox";
import TitleBox from "./TitleBox";
import { useHistory } from "react-router";

const SemesterBox = () => {
    const history = useHistory();

    return (
        <div className="bigBox">
            <button
                className="editSchedule"
                onClick={() => history.push("/schedule")}
            >
                Edit Schedule
            </button>
            <button className="notes" onClick="modal">
                Notes
            </button>
            <button className="addCustomCourse" onClick="modal">
                Add Custom Course
            </button>
            <div className="semesterFlexBox">
                <TitleBox />
                <CourseRowBox />
                <CourseRowBox />
                <CourseRowBox />
                <CourseRowBox />
                <CourseRowBox />
            </div>
        </div>
    );
};

export default SemesterBox;
