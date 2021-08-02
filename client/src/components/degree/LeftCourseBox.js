import React from 'react';
import './LeftCourseBox.css'
import Modal from 'react-modal';
import { useState } from "react";

const LeftCourseBox = () => {

    //for the course info modal
    const [modalState, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    }

    return (
        <div>
        <div className='lcbox'>
            <div className='courseCode'>ARCH 102</div>
            <a href="#" className='courseName' onClick={openModal}>PRINCIPLES OF ARCHITECTURE II</a>
        </div>

        <Modal isOpen={modalState} className='modal' onRequestClose={closeModal}>
            <div className='courseInfoContent'>
            <div>
                <div>Course Instructor:</div>
                <div>Meeting Location:</div>
                <div>Meeting Time:</div>
                <div>Prerequisites:</div>
                <div>Textbooks:</div>
            </div>
            </div>
        </Modal>
        </div>
    )
}

export default LeftCourseBox
