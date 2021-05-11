import React from 'react'


const FilterOption = (props) => {
    const options = props.options
    const checkStyle = {background: '#1DC2C4',
        borderRadius: '2px', color:'#1DC2C4'}
        
    const labelTextStyle = {fontFamily: 'Acari Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '20px',
    lineHeight: '19px',
    color: '#898E91'}

    const textStyle = {fontFamily: 'Acari Sans',
        fontStyle: 'normal',
        fontWeight:' normal',
        fontSize: '15px',
        lineHeight: '18px',
        color:' #A0A2A4'
        }
    const check_boxes = options.map((option) =>(
        <div class='flex bg-red pr-4 flex-row'>
            <input type='checkbox' id='option' style = {checkStyle}/>
            {/* <label for={option}>{option}</label> */}
            <p class='px-1' style = {textStyle}>{option}</p>
        </div>
    ));
    
    return(
        <div class='flex w-full flex-col'>
            <div class="px-8 py-2" style={labelTextStyle}>
                {props.label}
            </div>
            <div class = "flex px-8 flex-wrap">
                {check_boxes}
            </div>
            
        </div>
    );
};
export default FilterOption;