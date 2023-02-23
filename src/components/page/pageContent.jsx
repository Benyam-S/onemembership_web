import React from "react";
import ReactLoading from "react-loading";

const PageContent = ({ isPageLoading, children }) => {
  if (isPageLoading) {
    return (
      <div
        style={{
          position: "absolute",
          top: "45%",
          display: "block",
          width: "100%",
        }}
      >
        <ReactLoading
          type="bars"
          color="rgb(177, 172, 163)"
          className="page-loading"
        />
      </div>
    );
  } else {
    return children;
  }
};

export default PageContent;
