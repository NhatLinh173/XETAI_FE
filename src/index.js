import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import "./assets/css/style.css";
import "./assets/css/meanmenu.min.css";
import "./assets/css/responsive.css";
import "./assets/css/animate.min.css";
import "./assets/css/fontawesome.all.min.css";
import "./assets/css/color.css";
import "./assets/css/utilClass.css";

import "./assets/css/style.css";
import "./assets/css/meanmenu.min.css";
import "./assets/css/responsive.css";
import "./assets/css/animate.min.css";
import "./assets/css/fontawesome.all.min.css";
import "./assets/css/color.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
