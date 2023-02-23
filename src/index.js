import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./style/common.css";
import axios from "axios";

// Setting the default value
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.withCredentials = true;

ReactDOM.render(<App />, document.getElementById("root"));

reportWebVitals();
