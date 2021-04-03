import React from 'react'


const FilterOption = (props) => {
    const options = props.options

    const check_boxes = options.map((option) =>(
        <div class='flex bg-red pr-4 flex-row'>
            <input type='checkbox' id='option'/>
            {/* <label for={option}>{option}</label> */}
            <p class='px-1'>{option}</p>
        </div>
    ));
    
    return(
        <div class='flex w-3/12 flex-col'>
            <div class="px-8 py-2">
                {props.label}
            </div>
            <div class = "flex px-8 flex-wrap">
                {check_boxes}
            </div>
            
        </div>
    );
};
export default FilterOption;