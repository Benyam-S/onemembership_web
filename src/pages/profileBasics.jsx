import { Delete, Remove } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import React, { Component } from "react";
import Button from "../components/form/button";

class ProfileBasics extends Component {
  state = {
    displayName: "",
    username: "",
    email: "",
    displayNameError: "",
    usernameError: "",
    emailError: "",
  };

  validateInput = (inputs) => {
    const { displayName, email, password, confirmPassword, verificationCode } =
      inputs;
    const isValidDisplayName = /^[^±@£$^+§¡€¢§¶•ªº«<>|=~]{1,100}$/.test(
      displayName
    );
    const isValidEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      );
    const isValidPassword =
      /^[a-zA-Z0-9\._\-&!?=#]{8}[a-zA-Z0-9\._\-&!?=#]*$/.test(password);
    const isPasswordConfirmed = password === confirmPassword;

    return {
      displayName: isValidDisplayName,
      email: isValidEmail,
      password: isValidPassword,
      confirmPassword: isPasswordConfirmed,
    };
  };

  // Validating the input value
  handleValidateInput = (props) => (event) => {
    const newState = { ...this.state };
    const value = event.target.value;
    let isFormValid = true;

    if (props == "verificationCode") {
      const isValidVerificationCode = /^[0-9]{6}$/.test(value);
      this.setState({
        verifyButtonStatus: isValidVerificationCode ? "active" : "disabled",
        verificationCodeError:
          isValidVerificationCode || value === ""
            ? ""
            : "Please enter valid verification code.",
      });

      return;
    }

    Object.entries(this.validateInput(newState)).forEach(([key, value]) => {
      if (!value) {
        isFormValid = false;
        return;
      }
    });

    // Resetting old sign up response error
    newState["signUpResponse"] = "";

    if (isFormValid) {
      newState["signUpButtonStatus"] = "active";
    } else {
      newState["signUpButtonStatus"] = "disabled";
    }

    if (value == "") {
      // Resetting error value if empty
      newState[[props + "Error"]] = value;
      this.setState(newState);

      return;
    }

    if (props === "displayName") {
      const isValidDisplayName = this.validateInput(newState)["displayName"];
      if (!isValidDisplayName) {
        newState["displayNameError"] = "Please enter valid name.";
      } else {
        newState["displayNameError"] = "";
      }
    } else if (props === "email") {
      const isValidEmail = this.validateInput(newState)["email"];
      if (!isValidEmail) {
        newState["emailError"] = "Please enter valid email address.";
      } else {
        newState["emailError"] = "";
      }
    } else if (props == "password" || props == "confirmPassword") {
      const { password, confirmPassword } = newState;

      const isValidPassword = /^[a-zA-Z0-9\._\-&!?=#]+$/.test(password);
      if (!isValidPassword) {
        newState["passwordError"] = "Password contains invalid character.";
      } else if (password.length < 8) {
        newState["passwordError"] =
          "Password should contain at least 8 characters.";
      } else {
        newState["passwordError"] = "";
      }

      if (
        confirmPassword !== "" &&
        !this.validateInput(newState)["confirmPassword"]
      ) {
        newState["confirmPasswordError"] = "Passwords do not match.";
      } else {
        newState["confirmPasswordError"] = "";
      }
    }

    this.setState(newState);
  };

  // Controlling input value
  handleInputChange = (props) => (event) => {
    this.setState({ [props]: event.target.value });
  };

  render() {
    const {
      displayName,
      username,
      email,
      displayNameError,
      usernameError,
      emailError,
    } = this.state;

    return (
      <div>
        <div className="profile-segment-1">
          <div className="profile-segment-title">
            <div className="segment-title-header">
              <span color="dark">Profile Information</span>
            </div>
          </div>

          <div className="profile-segment-entry">
            <div className="mb-5">
              <div className="mb-2">
                <label color="gray2" className="entry-segment-title">
                  Profile
                </label>
              </div>

              <div>
                <div className="entry-segment-pic-container">
                  <div
                    display="block"
                    src="https://c10.patreonusercontent.com/4/patreon-media/p/user/66334002/18c340d025834930ae4b2af7fc686cae/eyJ3IjoyMDB9/1.png?token-time=2145916800&amp;token-hash=ti9X09CplfEzQfvs5CvMFhLv1UplmTT9hhv9LVQrFUw%3D"
                    className="entry-segment-pic"
                  ></div>

                  <div className="px-2">
                    <Button className={"form-button-sm light-button-active"}>
                      Upload Photo
                    </Button>
                  </div>

                  <IconButton>
                    <Delete />
                  </IconButton>
                </div>
              </div>
            </div>

            <TextField
              label="Name"
              type={"name"}
              name="name"
              autoComplete="name"
              value={displayName}
              onChange={this.handleInputChange("displayName")}
              onBlur={this.handleValidateInput("displayName")}
              helperText={displayNameError}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={displayNameError !== "" ? true : false}
            />

            <div className="mb-5"></div>
            <TextField
              label="Email"
              type={"email"}
              name="email"
              autoComplete="email"
              value={email}
              onChange={this.handleInputChange("email")}
              onBlur={this.handleValidateInput("email")}
              helperText={emailError}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={emailError !== "" ? true : false}
            />

            <div className="mb-5"></div>
            <TextField
              label="Username"
              type={"text"}
              name="username"
              autoComplete="name"
              value={username}
              onChange={this.handleInputChange("username")}
              onBlur={this.handleValidateInput("username")}
              helperText={usernameError}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={usernameError !== "" ? true : false}
            />

            <div style={{ marginTop: "2rem", width: "150px" }}>
              <Button className={"form-button-sm form-button-active"}>
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileBasics;
