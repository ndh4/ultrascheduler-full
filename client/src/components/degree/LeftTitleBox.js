import React from "react";
import "./LeftTitleBox.css";
import { useState } from "react";

const LeftTitleBox = (props) => {
    // for the drop-down box for semester selection
    const [year, setYear] = useState(props.year);
    const [sem, setSem] = useState(props.semester);

    const saveSelections = (e) => {
        setYear(e.target.value);
        setSem(e.target.value);
        console.log(year, sem);
    };
    console.log(props.index);
    console.log(props.currentLength - 1);

    return (
        <div className="ltbox">
            {props.index != props.currentLength - 1 ? (
                <>
                    <div className="year">{props.year}</div>
                    <div className="semester">{props.semester}</div>
                </>
            ) : (
                <>
                    <select
                        name="year"
                        id="y"
                        className="year"
                        onChange={(e) => setYear(e.target.value)}
                    >
                                      <option value="2021">2021</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                    </select>
                                
                    <select
                        name="sem"
                        id="s"
                        className="semester"
                        onChange={(e) => setSem(e.target.value)}
                    >
                                        <option value="Fall">Fall</option>
                                        <option value="Spring">Spring</option>
                                    
                    </select>
                                
                    <button onClick={saveSelections} className="saveBtn">
                        Save
                    </button>
                </>
            )}
                    
        </div>
    );
};

export default LeftTitleBox;
