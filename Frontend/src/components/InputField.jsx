import React from "react";
import PropTypes from "prop-types";
import "../components/RegisterPage.scss";

const InputField = ({
  label,
  type = "text",
  onChange,
  style = {},
  inputType = "input",
  rows = 3,
  maxLength,
}) => {
  return (
    <div className="input-field" style={style}>
      <label className="input-label">
        {label}
        {inputType === "input" ? (
          <input
            type={type}
            className="input-value"
            onChange={onChange}
            maxLength={maxLength}
          />
        ) : (
          <textarea
            className="input-value"
            onChange={onChange}
            rows={rows}
            maxLength={maxLength}
            style={{ resize: "none" }}
          ></textarea>
        )}
      </label>
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object,
  inputType: PropTypes.oneOf(["input", "textarea"]),
  rows: PropTypes.number,
  maxLength: PropTypes.number,
};

export default InputField;
