import React from "react";
import "./SemesterBox.css";
import CourseRowBox from "./CourseRowBox";
import TitleBox from "./TitleBox";
import { useHistory } from "react-router";
import Modal from "react-modal";
import { useState } from "react";


const SemesterBox = () => {
    // for the edit schedule button
    const history = useHistory();

    // for the notes modal
    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    };
    const closeModal = () => {
        setModal(false);
    };

    // for the notes content
    const [inputVal, changeInputVal] = useState("");
    // const saveInput = (e) => {
    //     changeInputVal(document.getElementById("notes").value);
    //     document.getElementById("notes").value = inputVal;
    // }

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
                Edit Notes
            </button>
            <Modal isOpen={modalState} className='modal' onRequestClose={closeModal}>
                <div className='notesContent'>
                    {/* <input type='text' id='notes' placeholder='Write your notes here...' /> */}
                    {/* <input 
                        type='text' 
                        id='notes' 
                        placeholder='Write your notes here...'
                        value={inputVal}
                        onChange={(e) => changeInputVal(e.target.value)}
                        style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}
                        className='textbox'
                        /> */}
                    <textarea 
                        maxlength='400' 
                        placeholder='Write your notes here...' 
                        className='textbox' 
                        value={inputVal}
                        onChange={(e) => changeInputVal(e.target.value)}>
                    </textarea>
                    {/* <button onClick={saveInput}>Save</button> */}
                    {/* <div style={{width: "90%", wordWrap: "break-word"}}>{inputVal}</div> */}
                </div>
            </Modal>

            <button className="button" onClick="modal">
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
