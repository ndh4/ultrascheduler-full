import React from "react";
import Select from "react-select";

const style = {
  width:100,
  display:"inline-block",
  float:"center",
  padding: 2,
}

function Selection({ options, selected, show, handleChange }) {
  if (show) {
    return (
      <div style={style}>
        <Select value={selected} onChange={handleChange} options={options} />
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Selection;