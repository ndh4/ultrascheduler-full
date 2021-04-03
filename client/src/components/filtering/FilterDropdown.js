import React, { Component } from 'react';
import Select from 'react-select';
import FilterLabel from './FilterLabel';



const FilterDropdown = (props) => {
    // Get options from backend based on if subject or course
    
    const options = props.options
    const choices = options.map((choice) =>  ( {label:choice, value: choice}
    ))

    const selector = <Select options={choices} isMulti/>
    
    return(
        <div class = "w-3/12 px-8">
            <div class='pb-2'>
                {props.label}
            </div>
            {selector}
        </div>
    );
};
export default FilterDropdown;
//Slider Example:
//https://whoisandy.github.io/react-rangeslider/