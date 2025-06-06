import React from "react";
import { useState } from "react";
import { Spinner } from "./Spinner";
import { ResultsPane } from "./ResultsPane";
import { Error } from "./Error";
import { solrQueryFactory } from "../utils/utils";
import "./SearchForm.css";

export function SearchForm() {
    const [error, setError] = useState(false);
    // TODO: refine error message handling
    const [errorMessage, setErrorMessage] = useState("CORS");
    const [searching, setSearching] = useState(false);
    const [publications, setPublications] = useState([]);
    // const [pristine, setPristine] = useState(true);
    // note: there is no initial load of data, search bar shown empty
    // const [publications, setPublications] = useState(initialDataLoad.docs);

    // yes partial matching with highlighting

    // TODO: handle query params with useSearchParams from react router
    // const handleSearchParams = () => {
    //     pass the search parameters to the url
    // };

    /**
     * method that makes the fetch call to Alberto's API and sets the state
     * @param {event} event - browser event
     */
    const handleSubmit = (event) => {
        // TODO: how do you handle multiple searches one after another?
        // TODO: do you remove the previous state of the search and then populate with data from fetch call?
        event.preventDefault();
        setPristine(false);
        setSearching(true);
        // handleSearchParams();
        const queryURL = solrQueryFactory(event.target.search.value);

        fetch(queryURL)
            .then((res) => res.json())
            .then((data) => {
                if (data.numFound > 0) {
                    console.log(data.docs);
                    setPublications(data.docs);
                }
            })
            .catch((e) => {
                setError(true);
                setErrorMessage(e.message);
            })
            .finally(setSearching(false));
    };

    return (
        <section>
            {/*
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
            <p>import.meta.env.MODE: {import.meta.env.MODE}</p>
            <p>import.meta.env.PROD: {import.meta.env.PROD}</p>
            <p>import.meta.env.DEV: {import.meta.env.DEV}</p>
            <p>import.meta.env.SSR: {import.meta.env.SSR}</p>
            <p>import.meta.env.VITE_TITLE: {import.meta.env.VITE_TITLE}</p>
            */}
            <form id="osq-search" onSubmit={handleSubmit}>
                <div display="flex" className="container">
                    <input
                        aria-label="Search for books"
                        placeholder="Search for books"
                        type="text"
                        id="search-input"
                        name="search"
                    />
                    <button type="submit" aria-label="submit" value="submit">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                        </svg>
                    </button>
                </div>
            </form>
            {searching && <Spinner />}
            {error && <Error message={errorMessage} />}
            {!error && !searching && publications && (
                <ResultsPane
                    publications={publications}
                    error={error}
                    // highlights={}
                    // maxDescriptionLength={publications.maxDescriptionLength}
                    numBooks={publications.length}
                    // numBooks={}
                    // pristine
                />
            )}
        </section>
    );
}
