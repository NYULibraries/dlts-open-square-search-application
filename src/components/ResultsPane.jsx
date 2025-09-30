import React from "react";
import { PropTypes } from "prop-types";
import { ResultItem } from "./ResultItem";
import { getFieldValueOrHighlightedFieldValue } from "../utils/utils";
import { Error } from "./Error";

// container component that renders multiple ResultItem components
// or displays helper texts for errors and empty searches
export function ResultsPane({
    publications = [],
    highlighting = {},
    error,
    searched,
}) {
    const listItems = publications.map((book, i) => (
        <ResultItem
            contributors={getFieldValueOrHighlightedFieldValue(
                highlighting,
                book,
                "contributorsAsASentence"
            )}
            date={book.dateOpenAccess}
            description={getFieldValueOrHighlightedFieldValue(
                highlighting,
                book,
                "description"
            )}
            identifier={book.id}
            index={book.id + i}
            key={book.id + i}
            maxDescriptionLength={500}
            subtitle={getFieldValueOrHighlightedFieldValue(
                highlighting,
                book,
                "subtitle"
            )}
            title={getFieldValueOrHighlightedFieldValue(
                highlighting,
                book,
                "title"
            )}
        />
    ));
    return (
        <section>
            <div className="osq-panes" style={{ paddingTop: 32 }}>
                <div className="osq-results-hold">
                    {/* search success scenario */}
                    {!error && searched && publications.length > 0 && (
                        <h2 className="osq-resultsheader">
                            Results: {publications.length} books
                        </h2>
                    )}
                    {/* search empty scenario */}
                    {!error && searched && publications.length == 0 && (
                        <>
                            <h2 className="osq-resultsheader">Results: None</h2>
                            <span>Please try another search</span>
                        </>
                    )}
                    {/* search failure scenario */}
                    {searched && error && <Error message={errorMessage} />}
                </div>
            </div>
            {searched && publications.length > 0 && listItems}
        </section>
    );
}

ResultsPane.propTypes = {
    publications: PropTypes.array,
    error: PropTypes.bool,
    highlighting: PropTypes.object,
    searched: PropTypes.bool.isRequired,
};
