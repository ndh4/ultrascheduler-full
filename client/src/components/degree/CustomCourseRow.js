import React, { useState, useContext, useEffect } from "react";
import "./RowBox.css";
import "./LeftCourseBox.css";
import "./RightCourseBox.css";
import SemesterBox from "./SemesterBox";
import { Context as CustomCourseContext } from "../../contexts/customCourseContext";

const CustomCourseRow = (props) => {
    // const courseInfo = props.customCourse ? props.customCourse.split(" ") : [];

    const [inputCode, setInputCode] = useState();
    const [inputName, setInputName] = useState("");
    const [inputCredit, setInputCredit] = useState(1);
    const { addCustomCourse } = useContext(CustomCourseContext);

    // useEffect(() => {
    //     setInputCode(courseInfo[0]);
    //     setInputName(courseInfo[1]);
    //     setInputCredit(courseInfo[2]);
    // });

    const saveCustomCourse = () => {
        if (inputCode && inputName && inputCredit) {
            addCustomCourse(`${inputCode}&${inputName}&${inputCredit}`);
        } else {
            alert("Please fill in all the information for the course");
        }
    };
    return (
        <div className="outerRowBox">
            <div className="rowBox">
                <div className="lcbox">
                    <input
                        placeholder={inputCode ? inputCode : "Enter Code"}
                        className="customCourseCode"
                        type="text"
                        onChange={(e) => setInputCode(e.target.value)}
                    />
                    <input
                        placeholder={inputName ? inputName : "Enter Name"}
                        className="customCourseName"
                        type="text"
                        onChange={(e) => setInputName(e.target.value)}
                    />
                </div>
                <div className="rccbox">
                    <input
                        placeholder={inputCredit ? inputCredit : "#"}
                        className="customCredit"
                        type="number"
                        min="1"
                        onChange={(e) => setInputCredit(e.target.value)}
                    />
                </div>
            </div>
            <div className="button-container">
                <button
                    // style={{ width: "35px" }}
                    className="deleteButton"
                    onClick={saveCustomCourse}
                >
                    <span style={{ fontSize: 18 }}>+</span>
                </button>

                <button
                    // style={{ width: "35px" }}
                    className="deleteButton"
                >
                    x
                </button>
            </div>
        </div>
    );
};
export default CustomCourseRow;
