import React from 'react';
import FilterDropdown from './FilterDropdown';
//import FilterRange from './FilterRange';
import FilterOption from './FilterOption';
import FilterLabel from './FilterLabel.js';


const Filter = (props) => {
    // Get options from backend based on if subject or course
    const cat_label = 'Category'
    const course_label = "Course" 
    const format_label = "Format" 
    const range_label =  "Range" 
    const range_dict = {"min":0, "max":3000, "value":3000 ,"label":{0: "Free"}}
    const status_label = "Listing Status" 
    const pickup_label = "Pickup Type"

    const category_options = ["Textbook", "Stand Text"]
    const course_options = ["COMP 182", "ELEC 220", "HUMA 125"]
    const format_options = ["Hardcopy", "Digital"]
    const status_options = ["Available"]
    const pickup_options = [" On Campus", " Near Campus", " Shipped"]

   
    //[
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' }
// ]
    //const options = {} Some backend call
    return(
        <div class='flex flex-col'>
            <div class='py-5'>
                <FilterDropdown label = {cat_label} options={category_options} />
            </div>
            <div>
                <FilterDropdown label = {course_label} options = {course_options}/>
            </div>
            <div class='py-5'>
                <FilterDropdown label = {format_label} options={format_options} />
            </div>
            {/* <FilterRange label = {range_label}  options={range_dict}/> */}
            <div>
                <FilterOption label = {status_label} options={status_options} />
            </div>
            <div class = 'py-5'>
                <FilterOption label = {pickup_label} options={pickup_options} />
            </div>
            
            
        
        </div>
    );
};
export default Filter;