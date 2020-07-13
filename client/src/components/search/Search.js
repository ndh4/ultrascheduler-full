import React from 'react';

function Search({ value, handleChange }) {

    return (
        <div>
            Search: <input value={value} onChange={handleChange} />
        </div>
    );
}

export default Search; 