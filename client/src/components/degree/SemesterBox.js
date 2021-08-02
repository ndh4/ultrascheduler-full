import React, { useState, useEffect }from "react";
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
    var row = [];
    var counter = 0;
    const message = () => {
        console.log("Hello World!");
        row.push(<CourseRowBox />);
        console.log(row);
        counter++;
        console.log(counter);
    }
    
    // console.log('checkmark', props["draftSessions"][6].session)
    // console.log('checkmark', props["draftSessions"][6].session)

    // const instructorFN = (typeof props["draftSessions"].session.instructors[0].firstName !== undefined) ? props["draftSessions"].sessions.instructors[0].firstName : "N/A"
    // const instructorLN = (typeof props["draftSessions"].session.instructors[0].lastName !== undefined) ? props["draftSessions"].sessions.instructors[0].lastName : "N/A"

    // console.log('check', props["draftSessions"])
    // console.log('check1', props["draftSessions"][6].session.instructors)

    const defaultDraftSessions = props["draftSessions"].map(sessions => (
        {
        "subject": sessions.session.course.subject,
        "courseNum": sessions.session.course.courseNum, 
        "longTitle": sessions.session.course.longTitle, 
        "credits": sessions.session.course.creditsMin,
        // "instructors": (sessions.session.instructors.length != 0) ? sessions.session.instructors : "N/A",
        "instructorFN": sessions.session.instructors[0].firstName,
        "instructorLN": sessions.session.instructors[0].lastName,
        "prereqs": sessions.session.course.prereqs,
        "coreqs": sessions.session.course.coreqs,
        "maxEnrollment": sessions.session.maxEnrollment
        }
    ));
    // console.log('check2', defaultDraftSessions)

    // console.log(defaultDraftSessions[0]["instructors"])
    // console.log('check3', defaultDraftSessions[6]['instructors'])

    // const [instructorList, setInstructorList] = useState([]);

    // console.log("before the use effect")
    
    // useEffect(() => {
    //     console.log("enter the use effect")
    //     defaultDraftSessions && defaultDraftSessions.map((session) => {
    //     const instructorsPerSession = []
    //     console.log('entered')
    //     if (session['instructors'].length != 0) {
    //         console.log("hi")
    //         session['instructors'] && session['instructors'].map((instructor) => (
    //             instructorsPerSession.push({ 
    //                 'instructorName': instructor.firstName + ' ' + instructor.lastName
    //             })
    //         ))
    //     } else {
    //         instructorsPerSession.push({'instructorName': "N/A"})
    //     }
    //     setInstructorList([...instructorList, instructorsPerSession])
    // })
    // })
    
    // if (defaultDraftSessions[0]["instructors"].length != 0){
    //     instructorList = defaultDraftSessions["instructors"].map((instructor) => (
    //         {
    //             'instructorName' : instructor.firstName + ' ' + instructor.lastName,
    //         }
    //     ))
    // } else {
    //     instructorDict = {
    //         'instructorName' : "N/A",
    //     }
    //     instructorList.push(instructorDict)
    // }
        
    creditSum = defaultDraftSessions.reduce(function(sum, arr) {
        return sum + arr.credits
    },0);
    
    // console.log('instructor list', instructorList)
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
                <TitleBox term    = {props["term"]} 
                          credits = {props["credits"]}/>

                {defaultDraftSessions && defaultDraftSessions.map((session) => {
                    return (<CourseRowBox subject   = {session["subject"]} 
                                          courseNum = {session["courseNum"]} 
                                          longTitle = {session["longTitle"]} 
                                          credits   = {session["credits"]} 
                                          instructorFN  = {session['instructorFN']}
                                          instructorLN  = {session['instructorLN']}
                                          prereqs       = {session["prereqs"]}
                                          coreqs        = {session["coreqs"]}
                                          maxEnrollment = {session["maxEnrollment"]}/>
                    )
                })}
            </div>
        </div>
    );
};

export { creditSum };
export default SemesterBox;
