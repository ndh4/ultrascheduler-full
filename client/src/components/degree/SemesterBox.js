import React from "react";
import "./SemesterBox.css";
import CourseRowBox from "./CourseRowBox";
import TitleBox from "./TitleBox";
import { useHistory } from "react-router";
import Modal from 'react-modal';
import { useState } from "react";

const SemesterBox = (props) => {
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

    return (
        <div className="bigBox">
            <button onClick={props.deleteSem} style={{width:"35px"}} className="button">x</button>
            <button
                className="button" style={{width:"170px"}}
                onClick={() => history.push("/schedule")}
            >
                Edit Schedule
            </button>

            <button className="button" style={{width:"170px"}} onClick={openModal}>
                Edit Notes
            </button>
            <Modal isOpen={modalState} className='modal' onRequestClose={closeModal}>
                <div className='notesContent'>
                    <textarea 
                        maxlength='400' 
                        placeholder='Write your notes here...' 
                        className='textbox' 
                        value={inputVal}
                        onChange={(e) => changeInputVal(e.target.value)}>
                    </textarea>
                </div>
            </Modal>

            <button className="button" style={{width:"170px"}} onClick="modal">
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
