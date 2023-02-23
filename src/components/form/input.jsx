import React from "react";
import "../../style/form.css";

const FormInput = ({
  name,
  value,
  placeholder,
  type,
  children,
  errorMsg,
  onChange,
  onFocusOut,
  autoComplete,
}) => {
  return (
    <div className="form-input-entry">
      <div>
        <label className="form-input-label" htmlFor={type}>
          {children}
        </label>
        <div className="form-input-container" label="Email">
          <input
            type={type}
            autoComplete={autoComplete}
            className={`form-input ${
              errorMsg === "" ? "" : "form-input-invalid"
            }`}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onFocusOut}
            placeholder={placeholder}
          />
        </div>
        <div className="form-input-error">
          <div>
            <div>
              <span color="error" data-tag="input-error">
                {errorMsg}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormInput;
