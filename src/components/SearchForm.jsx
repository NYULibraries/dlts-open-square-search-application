import React from "react";
import { useState } from "react";
import { Spinner } from "./Spinner";
import { ResultsPane } from "./ResultsPane";
import { solrSearch } from "../utils/open-square-solr";
import "./SearchForm.css";

export function SearchForm() {
    const [error, setError] = useState(false);
    // TODO: refine error message handling
    const [errorMessage, setErrorMessage] = useState("CORS");
    const [searching, setSearching] = useState(false);
    const [publications, setPublications] = useState([]);
    const [highlighting, setHighlighting] = useState();
    // used to determine if the user has done any searches at all yet
    const [searched, setSearched] = useState(false);
    // note: there is no initial load of data, search bar shown empty
    // const [publications, setPublications] = useState(initialDataLoad.docs);

    /**
     * method that makes the fetch call to Alberto's API and sets the state
     * @param {event} event - browser event
     */
    const handleSubmit = async (event) => {
        // TODO: debouncing or request cancellation
        // button is disabled when searching
        event.preventDefault();
        // TODO: add client side input sanitization
        const query = event.target.search.value;
        setSearched(true);
        setSearching(true);
        setPublications([]);
        setHighlighting();

        // TODO: take the search params from the url if present (for cold navigation search)
        // handleSearchParams();

        // we pick up query fields from the front-end because they are intended to be weighted and modified
        // by the user via the UI, and then passed back into the query for the search call.
        // for now, no query field manipulation yet
        // use internal google doc for new keys in the newer solr schema
        const QUERY_FIELDS = {
            // author -> contributors -> contributorsAsAString
            contributorsAsASentence: {
                highlight: true,
                weight: 4,
            },
            // date -> dateOpenAccess
            dateOpenAccess: {
                highlight: true,
                weight: 1,
            },
            description: {
                highlight: true,
                weight: 2,
            },
            // series_names -> series
            series: {
                highlight: true,
                weight: 3,
            },
            subtitle: {
                highlight: true,
                weight: 4,
            },
            title: {
                highlight: true,
                weight: 4,
            },
        };

        try {
            const data = await solrSearch(query, QUERY_FIELDS);
            if (data.response.numFound > 0) {
                setSearching(false);
                setPublications(data.response.docs);
                setHighlighting(data.highlighting);
            } else {
                setSearching(false);
            }
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    };

    return (
        <section>
            <form id="osq-search" onSubmit={handleSubmit}>
                <div display="flex" className="container">
                    <input
                        aria-label="Search for books"
                        placeholder="Search for books"
                        type="text"
                        id="search-input"
                        name="search"
                    />
                    <button
                        type="submit"
                        aria-label="submit"
                        value="submit"
                        disabled={searching}
                    >
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
            {!searching && publications && (
                <ResultsPane
                    publications={publications}
                    error={error}
                    errorMessage={errorMessage}
                    highlighting={highlighting}
                    // maxDescriptionLength={publications.maxDescriptionLength}
                    numBooks={publications.length}
                    // numBooks={}
                    searched={searched}
                />
            )}
        </section>
    );
}
