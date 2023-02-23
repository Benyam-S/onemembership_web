import React, { Component, Fragment } from "react";
import Button from "../components/form/button";
import axios from "axios";
import { BASE_URL } from "../entity/constants";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { EmailOutlined, NotInterestedOutlined } from "@mui/icons-material";
import "../style/form.css";
import "../style/forgotPassword.css";
import { sentenceCase } from "change-case";
import TopNavigationBar from "../components/navigation/topNavigation";
import BottomNavigationBar from "../components/navigation/bottomNavigation";

class ForgotPasswordForm extends Component {
  constructor(props) {
    super(props);

    // Setting initial state
    this.state = {
      email: "",
      emailError: "",
      resetResponse: "",
      resetButtonStatus: "disabled",
      success: false,
    };
  }

  // Initiating the session
  componentDidMount = () => {
    axios.get(BASE_URL + "service_provider/session/init");
  };

  validateInput = (inputs) => {
    const { email } = inputs;
    const isValidEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      );
    return {
      email: isValidEmail,
    };
  };

  // Validating the input value
  handleValidateInput = (props) => (event) => {
    const newState = { ...this.state };
    const value = event.target.value;
    let isFormValid = true;

    Object.entries(this.validateInput(newState)).forEach(([key, value]) => {
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
      newState[[props + "Error"]] = value;
      this.setState(newState);

      return;
    }

    const isValidEmail = this.validateInput(newState)["email"];
    if (!isValidEmail) {
      newState["emailError"] = "Please enter valid email address.";
    } else {
      newState["emailError"] = "";
    }

    this.setState(newState);
  };

  // Controlling input value
  handleInputChange = (props) => (event) => {
    this.setState({ [props]: event.target.value });
  };

  // handles request for signing up user
  handleResetPassword = (event) => {
    // Start loading
    this.setState({
      emailError: "",
      resetResponse: "",
      resetButtonStatus: "loading",
    });

    const { email } = this.state;

    const params = new URLSearchParams();
    params.append("email", email);

    // Binding this to that
    const that = this;

    axios
      .post(BASE_URL + "service_provider/password/reset/init", params)
      .then(function (response) {
        console.log(response);
        that.setState({
          resetButtonStatus: "active",
          success: true,
        });
      })
      .catch(function (error) {
        if (error.response) {
          const data = error.response.data;
          that.setState({
            emailError: data["email"] ? data["email"] : "",
            resetResponse:
              error.response.status == 500 || error.response.status == 401
                ? "Sorry! Unable to send reset link to your email."
                : data["error"]
                ? data["error"]
                : "",
            resetButtonStatus: "active",
            success: false,
          });
        } else {
          that.setState({
            resetResponse: "Sorry! Unable to send reset link to your email.",
            resetButtonStatus: "active",
            success: false,
          });
        }
      });

    event.preventDefault();
  };

  render() {
    const { email, emailError, resetResponse, resetButtonStatus, success } =
      this.state;

    return (
      <Fragment>
        <TopNavigationBar />
        <div className="pb-4 mb-5"></div>

        <div className="form-component">
          <div className="form-outer" overflow="hidden">
            <div className="form-container">
              <div className="fp-title-container">
                <h5 color="gray1" id="fp-title">
                  Forgot Password
                </h5>
              </div>

              {!success ? (
                <div>
                  <div className="fp-description-container">
                    <p color="gray2" className="fp-description">
                      Enter your email address and we will send you a link to
                      reset your password.
                    </p>
                  </div>

                  <form className="mb-md">
                    <div className={resetResponse ? "mt-4" : "mt-5"}></div>
                    {resetResponse ? (
                      <div
                        class="alert alert-danger d-flex align-items-center"
                        role="alert"
                      >
                        <NotInterestedOutlined />
                        <div className="ps-2">{resetResponse}</div>
                      </div>
                    ) : null}

                    <TextField
                      label="Email"
                      type={"email"}
                      autoComplete={"email"}
                      value={email}
                      onChange={this.handleInputChange("email")}
                      onBlur={this.handleValidateInput("email")}
                      helperText={emailError}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined />
                          </InputAdornment>
                        ),
                      }}
                      error={emailError !== "" ? true : false}
                    />

                    <Button
                      onClick={this.handleResetPassword}
                      status={resetButtonStatus}
                    >
                      Reset Password
                    </Button>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="fp-description-container">
                    <p color="gray2" className="fp-description">
                      Check your email for a link to reset your password. If it
                      doesn’t appear within a few minutes, check your spam
                      folder.
                    </p>
                  </div>

                  <div className="fp-help">
                    Having problems? Please try again later, or{" "}
                    <a
                      href="https://support.patreon.com/hc/en-us/"
                      className="sc-kDTinF bvOUyG"
                    >
                      contact support
                    </a>
                    .
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pb-4 mb-5"></div>
        <div className="pb-4 mb-5"></div>
        <BottomNavigationBar />
      </Fragment>
    );
  }
}

export default ForgotPasswordForm;
