import React, { Component, Fragment } from "react";
import Button from "../components/form/button";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../entity/constants";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import ReactLoading from "react-loading";
import {
  NotInterestedOutlined,
  PasswordOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { EmailOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import "../style/form.css";
import "../style/login.css";
import TopNavigationBar from "../components/navigation/topNavigation";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    // Setting initial state
    this.state = {
      identifier: "",
      password: "",
      showPassword: false,
      identifierError: "",
      passwordError: "",
      loginResponse: "",
      loginButtonStatus: "disabled",
      googleButtonStatus: "active",
      facebookButtonStatus: "active",
    };
  }

  // Initiating the session
  componentDidMount = () => {
    axios.get(BASE_URL + "service_provider/session/init");
  };

  validateInput = (inputs) => {
    const { identifier, password } = inputs;
    const isIdentifierEmpty = identifier.length !== 0;
    const isValidPassword =
      /^[a-zA-Z0-9\._\-&!?=#]{8}[a-zA-Z0-9\._\-&!?=#]*$/.test(password); // checks both length and for invalid characters

    return {
      identifier: isIdentifierEmpty,
      password: isValidPassword,
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

    if (isFormValid) {
      newState["loginButtonStatus"] = "active";
    } else {
      newState["loginButtonStatus"] = "disabled";
    }

    if (value == "") {
      // Resetting error value if empty
      newState[[props + "Error"]] = value;
      this.setState(newState);

      return;
    }

    if (props === "password") {
      const isValidPassword = this.validateInput(newState)["password"];
      if (!isValidPassword) {
        newState["passwordError"] = "Please enter valid password.";
      } else {
        newState["passwordError"] = "";
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

  // handles request for signing up user
  handleLogin = (event) => {
    // Start loading
    this.setState({
      identifierError: "",
      passwordError: "",
      loginResponse: "",
      loginButtonStatus: "loading",
      facebookButtonStatus: "disabled",
      googleButtonStatus: "disabled",
    });

    const { identifier, password } = this.state;

    const params = new URLSearchParams();
    params.append("identifier", identifier);
    params.append("password", password);

    // Binding this to that
    const that = this;

    axios
      .post(BASE_URL + "service_provider/login", params)
      .then(function (response) {
        that.setState({
          loginButtonStatus: "active",
          facebookButtonStatus: "active",
          googleButtonStatus: "active",
        });

        // Route to dashboard
        window.location.href = "/";
      })
      .catch(function (error) {
        if (error.response) {
          const data = error.response.data;
          that.setState({
            passwordError: data["credential"] ? data["credential"] : "",
            loginResponse:
              error.response.status == 500 || error.response.status == 401
                ? "Sorry! Unable to initiate login."
                : data["error"]
                ? data["error"]
                : "",
            loginButtonStatus: "active",
            facebookButtonStatus: "active",
            googleButtonStatus: "active",
          });
        } else {
          that.setState({
            loginResponse: "Sorry! Unable to initiate login.",
            loginButtonStatus: "active",
            facebookButtonStatus: "active",
            googleButtonStatus: "active",
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
          that.setState({
            googleButtonStatus: "active",
            facebookButtonStatus: "active",
          });

          // Route to dashboard
          window.location.href = "/";
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
          that.setState({
            loginButtonStatus: "disabled",
            googleButtonStatus: "active",
            facebookButtonStatus: "active",
          });

          // Route to dashboard
          window.location.href = "/";
        })
        .catch(function (error) {
          that.setState({
            loginButtonStatus: "disabled",
            googleButtonStatus: "active",
            facebookButtonStatus: "active",
          });
        });
    }

    // Start loading
    this.setState({
      loginButtonStatus: "disabled",
      googleButtonStatus: "disabled",
      facebookButtonStatus: "loading",
    });
  };

  render() {
    const {
      identifier,
      password,
      showPassword,
      identifierError,
      passwordError,
      loginButtonStatus,
      facebookButtonStatus,
      googleButtonStatus,
      loginResponse,
    } = this.state;

    return (
      <Fragment>
        <TopNavigationBar showLogin={false} />
        <div className="pb-4 mb-5"></div>

        <div className="form-component">
          <h1 color="dark" className="login-title">
            Log in
          </h1>
          <div className="form-outer" overflow="hidden">
            <div className="form-container">
              <div>
                <form className="mb-md">
                  <div className="mb-4"></div>
                  <TextField
                    label="Email"
                    type={"email"}
                    name="email"
                    value={identifier}
                    onChange={this.handleInputChange("identifier")}
                    onBlur={this.handleValidateInput("identifier")}
                    helperText={identifierError}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined />
                        </InputAdornment>
                      ),
                    }}
                    error={identifierError !== "" ? true : false}
                  />

                  <div className="mb-4"></div>
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    name="password"
                    onChange={this.handleInputChange("password")}
                    onBlur={this.handleValidateInput("password")}
                    helperText={passwordError}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PasswordOutlined />
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

                  <div className="forgot-password-container">
                    <div color="dark">
                      <a
                        id="forgot-password-txt"
                        aria-label="Forgot password"
                        href="/forgot_password"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  {loginResponse ? (
                    <div
                      className="alert alert-danger d-flex align-items-center"
                      role="alert"
                    >
                      <NotInterestedOutlined />
                      <div className="ps-2">{loginResponse}</div>
                    </div>
                  ) : null}

                  <div className="mt-3">
                    <Button
                      onClick={this.handleLogin}
                      status={loginButtonStatus}
                    >
                      Log in
                    </Button>
                  </div>
                </form>
              </div>

              <div className="login-or-container">
                <p color="gray2" className="login-or-txt">
                  or
                </p>
              </div>

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
                        <span>Log in with Google</span>
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
                              Log in with Facebook
                            </span>
                          )}
                        </div>
                      </button>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="signup-login">
            <div color="dark">
              <span color="dark">New to Patreon? </span>
              <Link to={"/signup"}>
                <button tabIndex="0" type="button">
                  Sign up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default LoginForm;
