import React from "react";

const FormInput = (props) => {
  let options = props.options || [];

  const inputStyles = {
    ...props.style,
    backgroundColor: "#fff",
  };

  const focusStyles = {
    outline: "none",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
    border: "1px solid #000",
  };

  if (
    props.tag === "input" ||
    props.tag === "password" ||
    props.tag === "number"
  ) {
    return (
      <div className="form-group">
        {props.label && (
          <label htmlFor={props.name} className="font-weight-bold">
            {props.label}
          </label>
        )}
        <input
          id={props.name}
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          className={props.classes}
          style={inputStyles}
          value={props.value}
          onChange={props.onChange}
          onFocus={(e) => (e.target.style = { ...inputStyles, ...focusStyles })}
          onBlur={(e) => (e.target.style = inputStyles)}
        />
      </div>
    );
  }

  if (props.tag === "textarea") {
    return (
      <div className="form-group">
        {props.label && (
          <label htmlFor={props.name} className="font-weight-bold">
            {props.label}
          </label>
        )}
        <textarea
          name={props.name}
          cols="30"
          rows="7"
          placeholder={props.placeholder}
          className={props.classes}
          style={inputStyles}
          value={props.value}
          onChange={props.onChange}
          onFocus={(e) => (e.target.style = { ...inputStyles, ...focusStyles })} // Thêm hiệu ứng khi focus
          onBlur={(e) => (e.target.style = inputStyles)} // Quay lại viền mặc định khi blur
        />
      </div>
    );
  }

  // Button element handler
  if (props.tag === "button") {
    return (
      <div className="form-group">
        <button
          className={`btn btn-theme`}
          style={props.style}
          onClick={props.onClick}
        >
          {props.val}
        </button>
      </div>
    );
  }

  // Select element handler
  if (props.tag === "select") {
    return (
      <div className="form-group">
        <label htmlFor={props.name}>{props.label}</label>
        <select
          name={props.name}
          className="form-control first_null"
          id={props.id}
          value={props.value}
          onChange={props.onChange}
          style={inputStyles}
          onFocus={(e) => (e.target.style = { ...inputStyles, ...focusStyles })} // Thêm hiệu ứng khi focus
          onBlur={(e) => (e.target.style = inputStyles)} // Quay lại viền mặc định khi blur
        >
          {options.map((data, index) => (
            <option key={index} value={data.value}>
              {data.text}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return null;
};

export default FormInput;
