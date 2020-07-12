import React from "react";
import Select from "react-select";

const style = {
  width: 100,
  display: "inline-block",
  float: "center",
  padding: 2,
}

/**
 * Selection component which can be used for any list of options (choices) provided
 * @param options: The choices available for the user to select
 * @param selected: The choice selected among the options
 * @param show: Whether to show this select button or not
 * @param handleChange: The function to execute when the selection changes.
 */
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