import React from "react";
import ReactLoading from "react-loading";

const Button = ({ id, className, style, status, onClick, children }) => {
  return (
    <div className="form-button-container">
      <button
        className={`${
          status === "active"
            ? className || "form-button form-button-active"
            : className || "form-button form-button-disabled"
        }`}
        id={id}
        color="blue"
        tabIndex="-1"
        style={style}
        onClick={onClick}
      >
        {status === "loading" ? (
          <div>
            <ReactLoading
              type="spin"
              color="rgb(177, 172, 163)"
              height="1.5rem"
              width="1.5rem"
              className="form-button-loading"
            />
          </div>
        ) : (
          <div>{children}</div>
        )}
      </button>
    </div>
  );
};

export default Button;
