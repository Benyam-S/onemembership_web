import { Delete, Remove, Telegram } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import React, { Component, Fragment } from "react";
import Button from "../components/form/button";

class ProfileSettings extends Component {
  state = {
    displayName: "",
    username: "",
    email: "",
    displayNameError: "",
    usernameError: "",
    emailError: "",
  };

  render() {
    return (
      <Fragment>
        <div className="pb-4 mb-5"></div>

        <div className="add-project-outer m-auto p-3">
          <div className="add-project-title-container">
            <h1 color="dark">Project Settings</h1>
            <p color="gray2">
              Set your creator details and make a great first impression
            </p>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ProfileSettings;
