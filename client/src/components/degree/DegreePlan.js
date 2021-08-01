import React from 'react'
import Semester from './SemesterBox'
import './DegreePlan.css'
import { useState } from 'react'

const DegreePlan = () => {
    // to keep the semester in a list to order them
    const [semesterList, setSemesterList] = useState(["202110"]);
    const addNewSem = () => {
        // var sem = document.createElement("Semester");
        // sem.appendChild("Semester")

        // var sems = document.getElementById("semList");
        // sems.innerHTML += Semester;
        // console.log(sems);

        // var oneSem = document.registerElement('sem-ele');
        // document.body.appendChild(new oneSem());
        // var sems = document.getElementById("semList");
        // var s = document.createElement('oneSem');
        // sems.appendChild(s);

        // var sems = document.getElementById('semList');
        // sems.value+="<Semester />"
        // console.log(sems)

        // customElements.define('new-semester', Semester, { extends: "ul" });
        // let newSem = document.createElement('ul', { is : 'new-semester' })
        const sems = document.getElementById("semList");
        const oneSem = document.createElement("Semester");
        // var s = document.getElementById('s');
        // var text = document.createTextNode("+");
        // oneSem.appendChild(text);
        sems.appendChild(oneSem);

        // var s = document.getElementById('s');
        // console.log(s);
    }
    return (
        <div className='layout'>
        <button onClick={addNewSem}>+</button>
            <div id='semList'>
                <Semester id='s'/>
                <Semester/>
            </div>
        </div>
    )
}

export default DegreePlan
