import React from "react";

interface prop {
  label: any;
  checked: boolean;
  onChange: any;
}

export default function Checkbox(props: prop) {
  return (
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          name={props.label}
          checked={props.checked}
          onChange={props.onChange}
          className="form-check-input"
        />
        {props.label}
      </label>
    </div>
  );
}
