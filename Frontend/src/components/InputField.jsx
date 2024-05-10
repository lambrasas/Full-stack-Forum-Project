import PropTypes from "prop-types";
import "../components/RegisterPage.scss";

const InputField = ({
  label,
  type = "text",
  onChange,
  value,
  style = {},
  inputType = "input",
  rows = 3,
  maxLength,
  placeholder,
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
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
          />
        ) : (
          <textarea
            className="input-value"
            onChange={onChange}
            value={value}
            rows={rows}
            maxLength={maxLength}
            style={{ resize: "none" }}
            placeholder={placeholder}
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
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  inputType: PropTypes.oneOf(["input", "textarea"]),
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
};

export default InputField;
