import React from "react";
import "./Spinner.css";

/*
    Spinner element displayed when waiting for results
    From: http://cssload.net/en/spinners/
    Author: https://codepen.io/Terramaster/
*/
export function Spinner() {
    return (
        <div id="spinner" class="osq-pane osq-pane-results">
            <div className="overlay">
                <div className="loader">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}
