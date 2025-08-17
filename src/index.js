import "react-app-polyfill/stable";
import "core-js";
import React, {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App";
import {CookiesProvider} from "react-cookie";

createRoot(document.getElementById("root")).render(<StrictMode><App/></StrictMode>);
