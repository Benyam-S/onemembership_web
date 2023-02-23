import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import LockOutlined from "@mui/icons-material/LockOutlined";
import NotInterestedOutlined from "@mui/icons-material/NotInterestedOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import TopNavigationBar from "../components/navigation/topNavigation";
import BottomNavigationBar from "../components/navigation/bottomNavigation";
import Button from "../components/form/button";
import { BASE_URL } from "../entity/constants";
import { sentenceCase } from "change-case";
import "../style/form.css";
import "../style/forgotPassword.css";

const PasswordResetForm = () => {
  const { nonce } = useParams();

  // Setting initial state
  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    passwordError: "",
    confirmPasswordError: "",
    resetResponse: "",
    resetButtonStatus: "disabled",
    success: false,
  });

  // Initiating the session
  useEffect(() => {
    axios.get(BASE_URL + "service_provider/session/init");
  }, []);

  const validateInput = (inputs) => {
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
  const handleValidateInput = (props) => (event) => {
    const newState = { ...state };
    const value = event.target.value;
    let isFormValid = true;

    Object.entries(validateInput(state)).forEach(([key, value]) => {
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
      setState({ ...newState });

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
        !validateInput(newState)["confirmPassword"]
      ) {
        newState["confirmPasswordError"] = "Passwords do not match.";
      } else {
        newState["confirmPasswordError"] = "";
      }
    }

    setState({ ...newState });
  };

  const handleShowPassword = () => {
    setState({
      ...state,
      showPassword: !state.showPassword,
    });
  };

  // Controlling input value
  const handleInputChange = (props) => (event) => {
    setState({ ...state, [props]: event.target.value });
  };

  // handles request for signing up user
  const handleResetPassword = (event) => {
    // Start loading
    setState({
      ...state,
      passwordError: "",
      confirmPasswordError: "",
      resetResponse: "",
      resetButtonStatus: "loading",
    });

    const { password, confirmPassword } = state;

    const params = new URLSearchParams();
    params.append("password", password);
    params.append("vPassword", confirmPassword);

    axios
      .post(
        BASE_URL + `service_provider/password/reset/finish/${nonce}`,
        params
      )
      .then(function (response) {
        console.log(response);
        setState({
          ...state,
          resetResponse: "",
          resetButtonStatus: "active",
          success: true,
        });
      })
      .catch(function (error) {
        if (error.response) {
          const data = error.response.data;
          setState({
            ...state,
            passwordError: data["password"]
              ? data["password"] !== "passwords do not match"
                ? sentenceCase(data["password"]) + "."
                : ""
              : "",
            confirmPasswordError:
              data["password"] === "passwords do not match"
                ? sentenceCase(data["password"]) + "."
                : "",
            resetResponse: data["nonce"]
              ? "The link you used to make this request is invalid!"
              : error.response.status == 500 ||
                error.response.status == 401 ||
                data["error"]
              ? "Sorry! Unable to change password."
              : "",
            resetButtonStatus: "active",
            success: false,
          });
        } else {
          setState({
            ...state,
            resetResponse: "Sorry! Unable to change password.",
            resetButtonStatus: "active",
            success: false,
          });
        }
      });

    event.preventDefault();
  };

  return (
    <Fragment>
      <TopNavigationBar
        user={{ profile_pic: "", display_name: "Benyam Simayehu" }}
      />
      <div className="pb-4 mb-5"></div>

      <div className="form-component">
        <div className="form-outer" overflow="hidden">
          <div className="form-container">
            <div className="fp-title-container">
              <h5 color="gray1" id="fp-title">
                Password Reset
              </h5>
            </div>

            {!state.success ? (
              <div>
                <div className="fp-description-container">
                  <p color="gray2" className="fp-description">
                    Please enter your new password and confirm it.
                  </p>
                </div>

                <form className="mb-md">
                  <div className={state.resetResponse ? "mt-4" : "mt-5"}></div>
                  {state.resetResponse ? (
                    <div
                      class="alert alert-danger d-flex align-items-center"
                      role="alert"
                    >
                      <NotInterestedOutlined />
                      <div className="ps-2">{state.resetResponse}</div>
                    </div>
                  ) : null}

                  <TextField
                    label="Password"
                    type={state.showPassword ? "text" : "password"}
                    value={state.password}
                    onChange={handleInputChange("password")}
                    onBlur={handleValidateInput("password")}
                    helperText={state.passwordError}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{ width: "18px", height: "18px" }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleShowPassword}
                            edge="end"
                          >
                            {state.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={state.passwordError !== "" ? true : false}
                  />

                  <div className="mb-4"></div>
                  <TextField
                    label="Confirm Password"
                    type={state.showPassword ? "text" : "password"}
                    value={state.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    onBlur={handleValidateInput("confirmPassword")}
                    helperText={state.confirmPasswordError}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{ width: "18px", height: "18px" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={state.confirmPasswordError !== "" ? true : false}
                  />

                  <Button
                    onClick={handleResetPassword}
                    status={state.resetButtonStatus}
                  >
                    Reset Password
                  </Button>
                </form>
              </div>
            ) : (
              <div>
                <div className="fp-description-container">
                  <p color="gray2" className="fp-description">
                    <span className="fw-bold">Success!</span> Password has been
                    successfully changed.
                  </p>
                </div>

                <div className="fp-login-container">
                  <Link to={"/login"}>
                    <Button onClick={"/login"} status={"active"}>
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pb-4 mb-5"></div>
      <BottomNavigationBar />
    </Fragment>
  );
};

export default PasswordResetForm;
