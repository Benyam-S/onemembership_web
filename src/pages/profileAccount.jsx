import React, { Component } from "react";
import Button from "../components/form/button";
import axios from "axios";
import { BASE_URL } from "../entity/constants";
import InputAdornment from "@mui/material/InputAdornment";
import { sentenceCase } from "change-case";
import {
  Facebook,
  Google,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import OAppBar from "../components/navigation/topNavigation";
import { IconButton, TextField } from "@mui/material";

class ProfileAccount extends Component {
  state = {
    password: "",
    confirmPassword: "",
    showPassword: false,
    passwordError: "",
    confirmPasswordError: "",
    resetResponse: "",
    resetButtonStatus: "disabled",
    success: false,
  };

  validateInput = (inputs) => {
    const { password, confirmPassword } = inputs;

    const isValidPassword =
      /^[a-zA-Z0-9\._\-&!?=#]{8}[a-zA-Z0-9\._\-&!?=#]*$/.test(password);
    const isPasswordConfirmed = password === confirmPassword;

    return {
      password: isValidPassword,
      confirmPassword: isPasswordConfirmed,
    };
  };

  // Validating the input value
  handleValidateInput = (props) => (event) => {
    const newState = { ...this.state };
    const value = event.target.value;
    let isFormValid = true;

    Object.entries(this.validateInput(this.state)).forEach(([key, value]) => {
      if (!value) {
        isFormValid = false;
        return;
      }
    });

    // Resetting old reset response error
    newState["resetResponse"] = "";

    if (isFormValid) {
      newState["resetButtonStatus"] = "active";
    } else {
      newState["resetButtonStatus"] = "disabled";
    }

    if (value == "") {
      // Resetting error value if empty
      newState[props + "Error"] = value;
      this.setState({ ...newState });

      return;
    }

    if (props == "password" || props == "confirmPassword") {
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

    this.setState({ ...newState });
  };

  handleShowPassword = () => {
    this.setState({
      ...this.state,
      showPassword: !this.state.showPassword,
    });
  };

  // Controlling input value
  handleInputChange = (props) => (event) => {
    this.setState({ ...this.state, [props]: event.target.value });
  };

  render() {
    const {
      password,
      confirmPassword,
      showPassword,
      passwordError,
      confirmPasswordError,
      resetResponse,
      resetButtonStatus,
      success,
    } = this.state;

    return (
      <div>
        <div className="profile-segment-1">
          <div className="profile-segment-title">
            <div className="segment-title-header">
              <span color="dark">Login</span>
            </div>
          </div>

          <div className="profile-segment-entry">
            <div>
              <TextField
                label="Old Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={this.handleInputChange("password")}
                onBlur={this.handleValidateInput("password")}
                helperText={passwordError}
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ width: "18px", height: "18px" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={passwordError !== "" ? true : false}
              />

              <div className="mb-5"></div>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={this.handleInputChange("password")}
                onBlur={this.handleValidateInput("password")}
                helperText={passwordError}
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ width: "18px", height: "18px" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={passwordError !== "" ? true : false}
              />

              <div className="mb-5"></div>
              <TextField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={this.handleInputChange("confirmPassword")}
                onBlur={this.handleValidateInput("confirmPassword")}
                helperText={confirmPasswordError}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ width: "18px", height: "18px" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
                error={confirmPasswordError !== "" ? true : false}
              />

              <div style={{ marginTop: "2rem", width: "200px" }}>
                <Button className={"form-button-sm form-button-active"}>
                  Update Password
                </Button>
              </div>
            </div>

            <div className="mt-5">
              <div className="profile-segment-connect">
                <div className="d-flex flex-row">
                  <Facebook sx={{ marginRight: "1rem" }} />
                  <div>Login with Facebook</div>
                </div>

                <button className="profile-connect-button">Connect</button>
              </div>

              <div className="profile-segment-connect">
                <div className="d-flex flex-row">
                  <Google sx={{ marginRight: "1rem" }} />
                  <div>Login with Google</div>
                </div>

                <button className="profile-connect-button">Disconnect</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileAccount;
