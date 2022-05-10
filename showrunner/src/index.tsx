import { StrictMode } from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "neutralinojs-types";

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById("root")
);
window.Neutralino.init();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
