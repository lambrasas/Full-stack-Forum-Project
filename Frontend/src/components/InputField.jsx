import React from "react";
import PropTypes from "prop-types";
import "../components/RegisterPage.scss";
const InputField = ({ label, type = "text", onChange }) => (
  <div className="input-field">
    <label className="input-label">
      {label}
      <input type={type} className="input-value" onChange={onChange} />
    </label>
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func,
};

export default InputField;
