import React from "react";
import { PropTypes } from "prop-types";
import { ResultItem } from "./ResultItem";
// import { Error } from "./Error";

// container component that renders multiple ResultItem components
// or displays helper texts for errors and empty searches
export function ResultsPane({
    publications = [],
    error,
    errorMessage,
    // numBooks = 0,
    searched,
}) {
    const listItems = publications.map((book, i) => (
        <ResultItem
            // book.contributors[0] is a quirk of Alberto's API wrapping the contributor array in an array
            contributors={book.contributors[0]}
            date={book.dateBook}
            description={book.description}
            identifier={book.id}
            index={book.id + i}
            key={book.id + i}
            maxDescriptionLength={500}
            subtitle={book.subtitle}
            title={book.title}
        />
    ));
    return (
        <section>
            <div className="osq-panes" style={{ paddingTop: 32 }}>
                {/* TODO: consider making this ResultsPaneHeader */}
                <div className="osq-results-hold">
                    {/* search success scenario */}
                    {searched && publications.length > 0 && (
                        <h2 className="osq-resultsheader">
                            Results: {publications.length} books
                        </h2>
                    )}
                    {/* search empty scenario */}
                    {searched && publications.length == 0 && (
                        <>
                            <h2 className="osq-resultsheader">Results: None</h2>
                            <span>Please try another search</span>
                        </>
                    )}
                    {/* search failure scenario */}
                    {searched && error && (
                        <div>
                            Error contacting DLTS Viewer API: {errorMessage}
                        </div>
                    )}
                </div>
            </div>
            {searched && publications.length > 0 && listItems}
        </section>
    );
}

ResultsPane.propTypes = {
    publications: PropTypes.array,
    // use these
    // NOTE: this component in react doesn't even need to know if it should display
    // rendering logic should be carried in parent component
    // display: PropTypes.Boolean.required,
    // Ellipsis character -- on Macos use key combination `Option + ;`
    // ellipsis: PropTypes.String,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    // explore this shape a little more
    // TODO: does this belong on the pane or does it belong on the item
    // highlights: PropTypes.Object.required,
    // TODO: does this belong on the pane or does it belong on the item
    // maxDescriptionLength: PropTypes.number,
    // numBooks: PropTypes.number.isRequired,
    // results: PropTypes.array.required,
    searched: PropTypes.bool.isRequired,
};
