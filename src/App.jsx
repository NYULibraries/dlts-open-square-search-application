import React from "react";
import { SearchForm } from "./components/SearchForm";
import { GoogleAnalytics, MatomoAnalytics } from "./components/Analytics";

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
