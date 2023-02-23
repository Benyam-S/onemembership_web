import React, { Component, Fragment } from "react";
import Button from "../components/form/button";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../entity/constants";
import { sentenceCase } from "change-case";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import ReactLoading from "react-loading";
import {
  Close,
  InfoOutlined,
  NotInterestedOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import TopNavigationBar from "../components/navigation/topNavigation";
import "../style/form.css";
import "../style/signup.css";

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    // Setting initial state
    this.state = {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      displayNameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      signUpResponse: "",
      signUpButtonStatus: "disabled",
      googleButtonStatus: "active",
      facebookButtonStatus: "active",
      verificationCode: "",
      verificationCodeError: "",
      resendButtonStatus: "active",
      verifyButtonStatus: "disabled",
      verificationResponse: "",
      verificationResponseType: "info",
      resendTimer: 60,
      resendTimerRef: 0,
      counting: false,
      dialogOpen: false,
      nonce: "",
    };
  }

  // Initiating the session
  componentDidMount = () => {
    axios.get(BASE_URL + "service_provider/session/init");
  };

  validateInput = (inputs) => {
    const { displayName, email, password, confirmPassword } = inputs;
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

  handleShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  // handles request for sign up user
  handleSignUp = (event) => {
    // Start loading
    this.setState({
      displayNameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      verificationCode: "",
      verificationCodeError: "",
      verificationResponse: "",
      signUpResponse: "",
      signUpButtonStatus: "loading",
      facebookButtonStatus: "disabled",
      googleButtonStatus: "disabled",
      dialogOpen: false,
      counting: false,
    });

    const { displayName, email, password, confirmPassword } = this.state;

    const params = new URLSearchParams();
    params.append("display_name", displayName);
    params.append("email", email);
    params.append("password", password);
    params.append("vpassword", confirmPassword);

    // Binding this to that
    const that = this;

    axios
      .post(BASE_URL + "service_provider/register/init", params)
      .then(function (response) {
        if (response) {
          const data = response.data;
          that.setState({
            nonce: data["nonce"],
            verificationCode: "",
            verificationCodeError: "",
            verificationResponse: "",
            resendButtonStatus: "active",
            verifyButtonStatus: "disabled",
            dialogOpen: true,
            counting: false,
            signUpButtonStatus: "active",
            facebookButtonStatus: "active",
            googleButtonStatus: "active",
          });
        } else {
          that.setState({
            signUpResponse: "Sorry! Unable to initiate new user registration.",
            signUpButtonStatus: "active",
            facebookButtonStatus: "active",
            googleButtonStatus: "active",
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          const data = error.response.data;
          that.setState({
            displayNameError: data["display_name"]
              ? sentenceCase(data["display_name"] + ".")
              : "",
            emailError: data["email"] ? sentenceCase(data["email"]) + "." : "",
            passwordError: data["password"]
              ? data["password"] !== "passwords do not match"
                ? sentenceCase(data["password"]) + "."
                : ""
              : "",
            confirmPasswordError:
              data["password"] === "passwords do not match"
                ? sentenceCase(data["password"]) + "."
                : "",
            signUpResponse:
              error.response.status == 500 || error.response.status == 401
                ? "Sorry! Unable to initiate new user registration."
                : data["error"]
                ? data["error"]
                : "",
            signUpButtonStatus: "active",
            facebookButtonStatus: "active",
            googleButtonStatus: "active",
          });
        } else {
          that.setState({
            signUpResponse: "Sorry! Unable to initiate new user registration.",
            signUpButtonStatus: "active",
            facebookButtonStatus: "active",
            googleButtonStatus: "active",
          });
        }
      });

    event.preventDefault();
  };

  handleResend = (event) => {
    // Start loading
    this.setState({
      verificationResponse: "",
      resendButtonStatus: "loading",
    });

    const { nonce } = this.state;

    // Binding this to that
    const that = this;

    axios
      .get(BASE_URL + `service_provider/register/resend/${nonce}`)
      .then(function (response) {
        if (response.data) {
          // If successful start counting
          const resendTimerRef = setInterval(() => {
            that.startTimer();
          }, 1000);

          const data = response.data;
          that.setState({
            nonce: data["nonce"],
            counting: true,
            verificationResponse: "Verification code sent. Check your email.",
            verificationResponseType: "info",
            resendButtonStatus: "disabled",
            resendTimerRef,
          });
        } else {
          that.setState({
            verificationResponse: "Sorry! Unable to resend email verification.",
            verificationResponseType: "error",
            resendButtonStatus: "active",
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          const data = error.response.data;
          that.setState({
            verificationResponse:
              error.response.status == 500 || error.response.status == 401
                ? "Sorry! Unable to resend email verification."
                : data["error"]
                ? data["error"]
                : "",
            verificationResponseType: "error",
            resendButtonStatus: "active",
          });
        } else {
          that.setState({
            verificationResponse: "Sorry! Unable to resend email verification.",
            verificationResponseType: "error",
            resendButtonStatus: "active",
          });
        }
      });

    event.preventDefault();
  };

  handleVerify = (event) => {
    // Start loading
    this.setState({
      verificationCodeError: "",
      verificationResponse: "",
      verifyButtonStatus: "loading",
      resendButtonStatus: "disabled",
    });

    const { nonce, verificationCode } = this.state;

    const params = new URLSearchParams();
    params.append("otp", verificationCode);

    // Binding this to that
    const that = this;

    axios
      .post(BASE_URL + `service_provider/register/finish/${nonce}`, params)
      .then(function (response) {
        const { counting } = that.state;
        if (response) {
          that.setState({
            verificationResponse: "",
            verificationResponseType: "info",
            verificationCode: "",
            verificationCodeError: "",
            verifyButtonStatus: "disable",
            dialogOpen: false,
          });
        } else {
          that.setState({
            verificationResponse: "Sorry! Verification process failed.",
            verificationResponseType: "error",
            verificationCodeError: "",
            verifyButtonStatus: "active",
            resendButtonStatus: counting ? "disabled" : "active",
          });
        }
      })
      .catch(function (error) {
        const { counting } = that.state;
        if (error.response) {
          const data = error.response.data;
          that.setState({
            verificationCodeError: data["error"] ? data["error"] : "",
            verificationResponse:
              error.response.status == 500 || error.response.status == 401
                ? "Sorry! Verification process failed."
                : "",
            verificationResponseType:
              error.response.status == 500 ? "error" : "info",
            verifyButtonStatus: "active",
            resendButtonStatus: counting ? "disabled" : "active",
          });
        } else {
          that.setState({
            verificationResponse: "Sorry! Verification process failed.",
            verificationResponseType: "error",
            verificationCodeError: "",
            verifyButtonStatus: "active",
            resendButtonStatus: counting ? "disabled" : "active",
          });
        }
      });

    event.preventDefault();
  };

  responseGoogle = (response) => {
    if (response["tokenId"] && response["tokenId"] !== "") {
      const params = new URLSearchParams();
      params.append("access_token", response["tokenId"]);

      // Binding this to that
      const that = this;

      axios
        .post(BASE_URL + "service_provider/login/google", params)
        .then(function (response) {
          console.log(response);
          that.setState({
            googleButtonStatus: "active",
            facebookButtonStatus: "active",
          });
        })
        .catch(function (error) {
          that.setState({
            googleButtonStatus: "active",
            facebookButtonStatus: "active",
          });
        });

      // Start loading
      this.setState({
        googleButtonStatus: "loading",
        facebookButtonStatus: "disabled",
      });
    }
  };

  responseFacebook = (response) => {
    if (response["accessToken"] && response["accessToken"] !== "") {
      const params = new URLSearchParams();

      const {
        accessToken,
        name,
        email,
        picture: {
          data: { url },
        },
      } = response;

      params.append("access_token", accessToken);
      params.append("name", name);
      params.append("email", email);
      params.append("profile_pic", url);

      // Binding this to that
      const that = this;

      axios
        .post(BASE_URL + "service_provider/login/facebook", params)
        .then(function (response) {
          console.log(response);

          that.setState({
            signUpButtonStatus: "disabled",
            googleButtonStatus: "active",
            facebookButtonStatus: "active",
          });
        })
        .catch(function (error) {
          that.setState({
            signUpButtonStatus: "disabled",
            googleButtonStatus: "active",
            facebookButtonStatus: "active",
          });
        });
    }

    // Start loading
    this.setState({
      signUpButtonStatus: "disabled",
      googleButtonStatus: "disabled",
      facebookButtonStatus: "loading",
    });
  };

  startTimer = () => {
    let { resendTimer, counting, resendTimerRef, resendButtonStatus } =
      this.state;
    if (resendTimer > 1 && counting) {
      resendTimer -= 1;
    } else {
      resendTimer = 60;
      counting = false;
      resendButtonStatus = "active";
      clearInterval(resendTimerRef);
    }

    this.setState({ resendTimer, counting, resendButtonStatus });
  };

  render() {
    const {
      displayName,
      email,
      password,
      confirmPassword,
      showPassword,
      displayNameError,
      emailError,
      passwordError,
      confirmPasswordError,
      signUpResponse,
      signUpButtonStatus,
      googleButtonStatus,
      facebookButtonStatus,
      dialogOpen,
      verificationCode,
      verificationCodeError,
      resendButtonStatus,
      verifyButtonStatus,
      verificationResponse,
      verificationResponseType,
      counting,
      resendTimer,
    } = this.state;

    return (
      <Fragment>
        <TopNavigationBar showLogin={false} />
        <div className="pb-4 mb-5"></div>

        <div className="form-component">
          <h1 color="dark" className="signup-title">
            Sign Up
          </h1>

          <div className="form-outer" overflow="hidden">
            <div className="form-container">
              <div className="button-with-logo-container">
                <div>
                  <GoogleLogin
                    className={
                      "button-with-logo " +
                      (googleButtonStatus !== "active"
                        ? "button-with-logo-disabled"
                        : "")
                    }
                    clientId="422297847036-ddnphjt8208j0dtq597eatfmlghd7ito.apps.googleusercontent.com"
                    buttonText={
                      googleButtonStatus === "loading" ? (
                        <span>
                          <ReactLoading
                            type="spin"
                            color="rgb(177, 172, 163)"
                            height="1.5rem"
                            width="1.5rem"
                            className="form-button-loading"
                          />
                        </span>
                      ) : (
                        <span>Sign up with Google</span>
                      )
                    }
                    onSuccess={this.responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
              </div>

              <div className="button-with-logo-container ">
                <div>
                  <FacebookLogin
                    appId="737603410588861"
                    fields="name,email,picture"
                    callback={this.responseFacebook}
                    render={(renderProps) => (
                      <button
                        className={
                          "button-with-logo " +
                          (facebookButtonStatus !== "active"
                            ? "button-with-logo-disabled"
                            : "")
                        }
                        color="white"
                        tabIndex="0"
                        type="button"
                        onClick={renderProps.onClick}
                      >
                        <div className="button-with-logo-text">
                          <div fill="" className="button-logo">
                            <svg
                              id="button-logo-facebook"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.992 3.657 9.129 8.438 9.879V14.89h-2.54V12h2.54V9.796c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.563V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.129 22 16.992 22 12z"></path>
                            </svg>
                          </div>
                          {facebookButtonStatus === "loading" ? (
                            <span style={{ padding: "10px 0px 10px 0px" }}>
                              <ReactLoading
                                type="spin"
                                color="rgb(177, 172, 163)"
                                height="1.5rem"
                                width="1.5rem"
                                className="form-button-loading"
                              />
                            </span>
                          ) : (
                            <span style={{ padding: "10px 0px 10px 0px" }}>
                              Sign up with Facebook
                            </span>
                          )}
                        </div>
                      </button>
                    )}
                  />
                </div>
              </div>

              <div className="signup-or-container">
                <div className="signup-or-line"></div>
                <div className="signup-or-txt">
                  <p color="gray2">or</p>
                </div>
                <div className="signup-or-line"></div>
              </div>

              <div>
                <form className="mb-md">
                  <div className="mb-4"></div>
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

                  <div className="mb-4"></div>
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

                  <div className="mb-4"></div>
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={this.handleInputChange("password")}
                    onBlur={this.handleValidateInput("password")}
                    helperText={passwordError}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
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

                  <div className="mb-4"></div>
                  <TextField
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={this.handleInputChange("confirmPassword")}
                    onBlur={this.handleValidateInput("confirmPassword")}
                    helperText={confirmPasswordError}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={confirmPasswordError !== "" ? true : false}
                  />

                  {signUpResponse ? (
                    <div
                      className="mt-3 mb-4 alert alert-danger d-flex align-items-center"
                      role="alert"
                    >
                      <NotInterestedOutlined />
                      <div className="ps-2">{signUpResponse}</div>
                    </div>
                  ) : null}

                  <div className="mt-3">
                    <Button
                      onClick={this.handleSignUp}
                      status={signUpButtonStatus}
                    >
                      Sign Up
                    </Button>
                  </div>
                </form>
              </div>

              <div className="terms-container">
                <div color="dark">
                  By signing up, you agree to Patreon's{" "}
                  <a
                    href="https://www.patreon.com/policy/legal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Use
                  </a>
                  ,{" "}
                  <a
                    href="https://privacy.patreon.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.patreon.com/policy/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie Policy
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>

          <div className="signup-login">
            <div color="dark">
              <span color="dark">Already have an account? </span>
              <Link to={"/login"}>
                <button tabIndex="0" type="button">
                  Log in
                </button>
              </Link>
            </div>
          </div>

          <Dialog
            open={dialogOpen}
            keepMounted
            onClose={this.handleDialogClose}
            maxWidth={"xs"}
          >
            <DialogTitle>
              <div color="dark" style={{ display: "flex" }}>
                <div className="mt-2 dialog-title" style={{ flexGrow: 1 }}>
                  Verify your email
                </div>
                <IconButton onClick={this.handleDialogClose}>
                  <Close />
                </IconButton>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="dialog-description-container">
                <span color="dark" className="dialog-description-txt">
                  We sent a verification code to your email at{" "}
                  <strong>{email}</strong>.
                </span>
              </div>

              <div className="mb-5"></div>
              <TextField
                label="Verification Code"
                type={"text"}
                placeholder={"XXXXXX"}
                value={verificationCode}
                onChange={this.handleInputChange("verificationCode")}
                onBlur={this.handleValidateInput("verificationCode")}
                helperText={verificationCodeError}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={verificationCodeError !== "" ? true : false}
              />

              {verificationResponse ? (
                <div
                  className={
                    "mt-3 mb-0 alert d-flex align-items-center " +
                    (verificationResponseType === "error"
                      ? "alert-danger"
                      : "alert-info")
                  }
                  role="alert"
                >
                  {verificationResponseType === "error" ? (
                    <NotInterestedOutlined />
                  ) : (
                    <InfoOutlined />
                  )}
                  <div className="ps-2">{verificationResponse}</div>
                </div>
              ) : null}
            </DialogContent>
            <DialogActions sx={{ margin: "15px" }}>
              <Button
                className={
                  resendButtonStatus === "active"
                    ? "form-button form-button-sm light-button-active"
                    : "form-button form-button-sm light-button-disabled"
                }
                onClick={this.handleResend}
                status={resendButtonStatus}
              >
                {counting ? "Resend in " + resendTimer : "Resend code"}
              </Button>
              <Button
                className={
                  verifyButtonStatus === "active"
                    ? "form-button form-button-sm form-button-active"
                    : "form-button form-button-sm form-button-disabled"
                }
                onClick={this.handleVerify}
                status={verifyButtonStatus}
              >
                Verify
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Fragment>
    );
  }
}

export default SignUpForm;
