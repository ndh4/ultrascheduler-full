import React from 'react';
// import Slider from 'react-rangeslider'
// import Slider from '@material-ui/core/Slider';


const FilterRange = (props) => {
    // Get options from backend based on if subject or course
    // const range = <Slider
    // min={props.options[min]}
    // max={props.options[max]}
    // value={props.options[value]}
    // labels={{0: "Free"}}
    // // format={Function}
    // // onChangeStart={Function}
    // // onChange={Function}
    // // onChangeComplete={Function}
    // />
    
    return(
        <div class = "w-full px-8">
            <div class='pb-2'>
                {props.label}
            </div>                
            {/* {selector} */}
        </div>
    );
};
export default FilterRange;