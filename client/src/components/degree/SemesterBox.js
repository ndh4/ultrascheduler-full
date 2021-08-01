import React from "react";
import "./SemesterBox.css";
import CourseRowBox from "./CourseRowBox";
import TitleBox from "./TitleBox";
import { useHistory } from "react-router";
import Modal from 'react-modal';
import { useState } from "react";


const SemesterBox = () => {
    // for the edit schedule button
    const history = useHistory();

    // for the notes modal
    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    }

    // for the notes content
    const [inputVal, changeInputVal] = useState("");
    const saveInput = () => {
        changeInputVal(document.getElementById("notes").value);
        document.getElementById('notes').value = '';
    }

    //for the add course button
    var row = [];
    var counter = 0;
    const message = () => {
        console.log("Hello World!");
        row.push(<CourseRowBox />);
        console.log(row);
        counter++;
        console.log(counter);
    }


    return (
        <div className="bigBox">
            <button
                className="button"
                onClick={() => history.push("/schedule")}
            >
                Edit Schedule
            </button>

            <button className="button" onClick={openModal}>
                Add Notes
            </button>
            <Modal isOpen={modalState} className='modal'>
                <button onClick={closeModal} className='closeBtn'></button>
                <div className='notesContent'>
                <div>
                    <input type='text' id='notes' placeholder='Write your notes here...'></input>
                    <button onClick={saveInput}>Save</button>
                </div>
                    <div>{inputVal}</div>
                </div>
            </Modal>
            
            <button className="button" onClick={message}>
                Add Custom Course
            </button>
            <div className="semesterFlexBox">
                <TitleBox />
                {/*for (var x = 0; x < counter; x++) {
                    <CourseRowBox />
                }*/}
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
