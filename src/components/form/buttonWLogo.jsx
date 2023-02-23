import React from "react";
const ButtonWLogo = ({ logo, onClick, children }) => {
  return (
    <div className="button-with-logo-container ">
      <div>
        <button
          className="button-with-logo"
          color="white"
          tabIndex="0"
          type="button"
          onClick={onClick}
        >
          <div className="button-with-logo-text">
            <div fill="" className="button-logo">
              {logo}
            </div>
            <div className="between-space"></div>
            {children}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ButtonWLogo;
