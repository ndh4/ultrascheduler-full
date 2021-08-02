import React, { useState } from "react";
import "./SemesterBox.css";
import CourseRowBox from "./CourseRowBox";
import TitleBox from "./TitleBox";
import { useHistory } from "react-router";
import Modal from "react-modal";

let creditSum;

const SemesterBox = (props) => {
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
    const saveInput = (e) => {
        changeInputVal(document.getElementById("notes").value);
        document.getElementById("notes").value = inputVal;
    };

    //for the add course button
    const defaultDraftSessions = props.draftSessions.map((sessions) => ({
        subject: sessions.session.course.subject,
        courseNum: sessions.session.course.courseNum,
        longTitle: sessions.session.course.longTitle,
        credits: sessions.session.course.creditsMin,
        instructorFN:
            sessions.session.instructors[0] == undefined
                ? "N/A"
                : sessions.session.instructors[0].firstName,
        instructorLN: sessions.session.instructors[0]
            ? sessions.session.instructors[0].lastName
            : "N/A",
        prereqs: sessions.session.course.prereqs,
        corereqs: sessions.session.course.corereqs,
        maxEnrollment: sessions.session.maxEnrollment,
    }));

    creditSum = defaultDraftSessions.reduce(function (sum, arr) {
        return sum + arr.credits;
    }, 0);

    console.log(creditSum);

    return (
        <div className="bigBox">
            <button
                onClick={props.deleteSem}
                style={{ width: "35px" }}
                className="button"
            >
                x
            </button>
            <button
                className="button"
                style={{ width: "170px" }}
                onClick={() => history.push("/schedule")}
            >
                Edit Schedule
            </button>

            <button
                className="button"
                style={{ width: "170px" }}
                onClick={openModal}
            >
                Edit Notes
            </button>
            <Modal
                isOpen={modalState}
                className="modal"
                onRequestClose={closeModal}
            >
                <div className="notesContent">
                    <textarea
                        maxlength="400"
                        placeholder="Write your notes here..."
                        className="textbox"
                        value={inputVal}
                        onChange={(e) => changeInputVal(e.target.value)}
                    ></textarea>
                </div>
            </Modal>

            <button
                className="button"
                style={{ width: "170px" }}
                onClick="modal"
            >
                Add Custom Course
            </button>
            <div className="semesterFlexBox">
                <TitleBox term={props["term"]} credits={props["credits"]} />

                {defaultDraftSessions &&
                    defaultDraftSessions.map((session) => {
                        return (
                            <CourseRowBox
                                subject={session["subject"]}
                                courseNum={session["courseNum"]}
                                longTitle={session["longTitle"]}
                                credits={session["credits"]}
                                instructorFN={session["instructorFN"]}
                                instructorLN={session["instructorLN"]}
                                prereqs={session["prereqs"]}
                                coreqs={session["coreqs"]}
                                maxEnrollment={session["maxEnrollment"]}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export { creditSum };
export default SemesterBox;
