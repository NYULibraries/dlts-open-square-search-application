import React from "react";
import PropTypes from "prop-types";
import { ResultItem } from "./ResultItem";

// container component that renders multiple ResultItem components
// or displays helper texts for errors and empty searches
export function ResultsPane({
    publications = [],
    error = false,
    numBooks = 0,
}) {
    console.log("numBooks ", numBooks);
    const listItems = publications.map((book, i) => (
        <ResultItem
            contributors={book.contributors}
            date={book.date}
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
            <header>
                <h2 className="osq-resultsheader">
                    {error &&
                        "Sorry, a server error has occurred. Please try your search again later.\n"}
                    {publications.length > 0
                        ? `Results: ${publications.length} books`
                        : "Results: None"}
                </h2>
            </header>
            <div>
                {publications.length > 0 ? (
                    listItems
                ) : (
                    <span>Please try another search.</span>
                )}
            </div>
        </section>
    );
}

ResultsPane.propTypes = {
    // books: PropTypes.array,
    // they are not books, they are publications of different kinds of media
    publications: PropTypes.array,
    // use these
    // NOTE: this component in react doesn't even need to know if it should display
    // rendering logic should be carried in parent component
    // display: PropTypes.Boolean.required,
    // Ellipsis character -- on Macos use key combination `Option + ;`
    // ellipsis: PropTypes.String,
    error: PropTypes.bool,
    // explore this shape a little more
    // TODO: does this belong on the pane or does it belong on the item
    // highlights: PropTypes.Object.required,
    // TODO: does this belong on the pane or does it belong on the item
    // maxDescriptionLength: PropTypes.number,
    numBooks: PropTypes.number.isRequired,
    // results: PropTypes.array.required,
};
