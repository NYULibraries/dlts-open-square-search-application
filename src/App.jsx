import React from "react";
import "./App.css";
import { SearchForm } from "./components/SearchForm";
import { GoogleAnalytics, MatomoAnalytics } from "./components/Analytics";
// TODO: is this component redundant?
// should we render directly into `main.jsx`?

function App() {
    return (
        <>
            <GoogleAnalytics />
            <MatomoAnalytics />
            <SearchForm />
        </>
    );
}

export default App;
