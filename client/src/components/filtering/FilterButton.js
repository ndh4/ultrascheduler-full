import React, { Component, components} from 'react';

const Placeholder = props => {
  return <components.Placeholder {...props} />;
};

const labelStyle = {fontFamily: 'Acari Sans',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16',
    lineHeight: '19px',
    color: '#FFFFFF'
    };


const buttonStyle = {
    margin: '10px 0',
    color: 'black',
    background: '#1DC2C4'
    };
    
const FilterButton = ({ label, handleClick }) => (
    <div class = "w-full px-8 ">
           
        <button
            className="w-full py-3 px-8 border rounded-xl"
            style={buttonStyle}
            onClick={handleClick}>
            <div style = {labelStyle}>{label}</div>
        </button>

    </div>
    );
export default FilterButton;
