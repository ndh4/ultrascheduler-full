import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';

import moment from "moment";

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

import Infinite from "react-infinite";

const sessionToString = (session) => {
    let result = [];
    // console.log(session);
    if (session.class.days.length > 0) {
        let classTime = "Class: " + session.class.days.join("")
        // Convert times
        let startTime = session.class.startTime;
        let endTime = session.class.endTime;
        startTime = moment(startTime, 'HHmm').format('hh:mm a');
        endTime = moment(endTime, 'HHmm').format('hh:mm a');

        classTime += " " + startTime + " - " + endTime
        result.push(<p>{classTime}</p>);
    }
    if (session.lab.days.length > 0) {
        let labTime = "Lab: " + session.lab.days.join("")

        // Convert times
        let startTime = session.lab.startTime;
        let endTime = session.lab.endTime;
        startTime = moment(startTime, 'HHmm').format('hh:mm a');
        endTime = moment(endTime, 'HHmm').format('hh:mm a');

        labTime += " " + startTime + " - " + endTime
        result.push(<p>{labTime}</p>);
    }
    return ((result.length > 0) ? result : "No class times");
}

const CourseList = ({ searchResults }) => {
    const [courseSelected, setCourseSelected] = useState("");

    if (searchResults == []) {
        return (<br />);
    }

    if (courseSelected != "") {
        return (
            <div>
                <h4 onClick={() => setCourseSelected("")}>{courseSelected.label}</h4>
                {courseSelected.sessions.map(session => {
                    return (
                        <div key={courseSelected.crn} style={{ borderStyle: 'solid', display: "inline-block" }}>
                            <input type="checkbox" onClick={() => console.log("Add/Rem course")} style={{ alignItems: "left" }} />
                            <div style={{ alignItems: "left" }}>
                                {sessionToString(session)}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return (
            <Infinite containerHeight={courseSelected ? 200 : 500} elementHeight={courseSelected ? 200 : 50}>
                <Accordion allowZeroExpanded={true}>
                {searchResults.map(res => (
                    <AccordionItem 
                    key={res.label} 
                    style={{ visibility: (courseSelected != "" && courseSelected != res.label) ? "hidden" : "visible" }}
                    onClick={() => courseSelected ? setCourseSelected("") : setCourseSelected(res)}
                    >
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                {res.label}
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            {res.sessions.map(session => {
                                return (
                                    <div key={res.crn} style={{ borderStyle: 'solid', display: "inline-block" }}>
                                        <input type="checkbox" onClick={() => console.log("Add/Rem course")} style={{ alignItems: "left" }} />
                                        <div style={{ alignItems: "left" }}>
                                            {sessionToString(session)}
                                        </div>
                                    </div>
                                )
                            })}
                        </AccordionItemPanel>
                    </AccordionItem>
                    // <div style={styles.result} key={res.crn} onClick={() => console.log("clicked " + res.label)}>
                    //     <p>{res.label}</p>
                    // </div>
                ))}
                </Accordion>
            </Infinite>
        )
    }
}

export default connect(
    (state) => ({
    }),
    (dispatch) => ({
    }),
)(CourseList);