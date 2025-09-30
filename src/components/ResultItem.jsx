import React from "react";
import { PropTypes } from "prop-types";
import {
    getThumbnailUrl,
    sortContributorsIntoRoleBuckets,
} from "../utils/utils";

// individual result item
// no need for state, iterated by parent component
export function ResultItem({
    contributors,
    date,
    description,
    identifier,
    subtitle,
    title,
    // TODO: add description restriction at the component level
    maxDescriptionLength = 500,
}) {
    return (
        <div
            id={identifier}
            key={identifier}
            name={title}
            className="book-summary-hold"
        >
            <article className="book-summary container">
                <div className="thumb" role="presentation">
                    <a
                        href={`/books/${identifier}/`}
                        tabIndex="-1"
                        aria-hidden="true"
                    >
                        <img
                            src={getThumbnailUrl(identifier)}
                            alt=""
                            className="img-fluid"
                        />
                    </a>
                </div>
                <div className="meta">
                    <div className="book-title-group">
                        <a href={`/books/${identifier}/`}>
                            <div
                                className="book-title"
                                // TODO: find a better solution that doesn't rely on dangerouslySetInnerHTML
                                dangerouslySetInnerHTML={{ __html: title }}
                            ></div>
                            <div
                                className="book-subtitle"
                                dangerouslySetInnerHTML={{ __html: subtitle }}
                            ></div>
                        </a>
                    </div>
                    {sortContributorsIntoRoleBuckets(contributors).map(
                        (contributorSentenceByType, index) => (
                            <div className="author-group" key={index}>
                                <span className="rolename">
                                    {contributorSentenceByType}
                                </span>
                            </div>
                        )
                    )}
                    <div className="pubdate">
                        <span>Published: </span>
                        <span>{date.substring(0, 4)}</span>
                    </div>
                    <div
                        className="description meta"
                        dangerouslySetInnerHTML={{ __html: description }}
                    ></div>
                </div>
            </article>
        </div>
    );
}

// TODO: proptypes deprecated in react 19, use typescript
// https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-proptypes-and-defaultprops
ResultItem.propTypes = {
    contributors: PropTypes.string,
    date: PropTypes.string,
    identifier: PropTypes.string,
    description: PropTypes.string,
    maxDescriptionLength: PropTypes.number,
    subtitle: PropTypes.string,
    title: PropTypes.string,
};
