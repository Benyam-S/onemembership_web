import React from "react";
import SignUpForm from "./pages/signup";
import LoginForm from "./pages/login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPasswordForm from "./pages/forgotPassword";
import PasswordResetForm from "./pages/passwordReset";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/dashboard";
import Projects from "./pages/projects";
import Profile from "./pages/profile";
import ProjectEdit from "./pages/projectEdit";
import ProjectAdd from "./pages/projectAdd";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={SignUpForm} />
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/forgot_password" element={ForgotPasswordForm} />
          <Route
            path="/password/reset/finish/:nonce"
            render={(props) => <PasswordResetForm />}
          />
          <Route
            exact
            path="/projects/search"
            render={(props) => <Projects {...props} />}
          />
          <Route exact path="/project/edit" component={ProjectEdit} />
          <Route exact path="/project/add" component={ProjectAdd} />
          <Route exact path="/profile/basic" component={Profile} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
