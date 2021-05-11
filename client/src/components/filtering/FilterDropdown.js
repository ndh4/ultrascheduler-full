import React, { Component, components, useEffect, useState} from 'react';
import Select from 'react-select';
import FilterLabel from './FilterLabel';


function FilterDropdown({selected, setSelected, label, options, placeholder }){
    // Get options from backend based on if subject or course
    // const options = props.options
    const choices = options.map((choice) =>  ( {label:choice, value: choice}
    ))
    const textStyle = {fontFamily: 'Acari Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '20px',
    lineHeight: '19px',
    color: '#898E91'}
    // const placeholder = props.placeholder;

    // const [selected, setSelected] = useState([]);
    

    const customStyles = {
      control: (base, state) => ({
        ...base,
        // background: "#023950",
        // match with the menu
        borderRadius: 10,
        // Overwrittes the different states of border
        // borderColor: state.isFocused ? "yellow" : "green",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
          // Overwrittes the different states of border
          // borderColor: state.isFocused ? "red" : "blue"
        }
      }),
      menu: (base) => ({
        ...base,
        // override border radius to match the box
        borderRadius: 0,
        // beautify the word cut by adding a dash see https://caniuse.com/#search=hyphens for the compatibility
        hyphens: "auto",
        // kill the gap
        marginTop: 0,
        textAlign: "left",
        // prevent menu to scroll y
        wordWrap: "break-word"
      }),
      menuList: (base) => ({
        ...base,
        // kill the white space on first and last option
        padding: 0
      }),
      placeholder: base => ({
        ...base,
        // fontSize: '1em',
        // // color: colourOptions[2].color,
        // fontWeight: 400,
      })
    };

    const selector = <Select options={choices} styles={customStyles} placeholder={placeholder} onChange = {(e) => setSelected({...selected, [label]: e ? e : [] })} isMulti/>
    
    return(
        <div class = "w-full px-8 ">
            <div class='pb-2' style = {textStyle}>
                {label}
            </div>
            <div class='border rounded-xl'>
                {selector}
            </div>
            
        </div>
    );
};
export default FilterDropdown;
//Slider Example:
//https://whoisandy.github.io/react-rangeslider/